import {db} from '@/lib/db';
import {identity,json,clean,moderate,limit,recordAudit,RateLimitError,type Context} from '@/lib/communications';
import {visible} from '@/lib/board';
export const dynamic='force-dynamic';
function assigned(c:Context):string[]{return c.person?JSON.parse(c.person.classes):[]}
function instant(value:unknown){const s=clean(value,40);if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(s)||!Number.isFinite(Date.parse(s)))throw Error('Enter a valid date and time.');return new Date(s).toISOString()}
function publishingAudience(b:any,c:Context){const classes=Array.isArray(b.classes)?[...new Set(b.classes)]:[],grades=Array.isArray(b.grades)?[...new Set(b.grades)]:[];if(classes.some((x:any)=>typeof x!=='string'||!/^([1-9]|1[0-2])[A-Z]$/.test(x))||grades.some((x:any)=>!Number.isInteger(x)||x<1||x>12)||typeof b.global!=='boolean')throw Error('Choose a valid audience.');if(c.person?.role==='teacher'&&(b.global||grades.length||!classes.length||classes.some(x=>!assigned(c).includes(x as string))))throw Error('Teachers can publish only to their assigned classes.');if(!b.global&&!classes.length&&!grades.length)throw Error('Choose an audience.');return {is_global:b.global,target_grades:grades,target_classes:classes,excluded_classes:[]}}
function checkTeacherAudience(i:any,c:Context){if(c.person?.role==='teacher'&&(i.audience.is_global||i.audience.target_grades.length||!i.audience.target_classes.length||i.audience.target_classes.some((cl:string)=>!assigned(c).includes(cl))))throw Error('Your class assignments have changed.')}
export async function GET(r:Request){try{
 const c=await identity(r);if(!c.person)return json({person:null});
 const rows=(await db().prepare("SELECT data FROM content WHERE kind IN ('announcement','event','poll')").all<{data:string}>()).results.map(x=>JSON.parse(x.data));
 const cls=c.person.class_name,classes=assigned(c),canManage=c.isAdmin||c.moderator||c.person.role==='teacher';
 const items=rows.filter(i=>c.isAdmin||i.owner===c.person!.email||c.staff&&i.stage==='Pending approval'||(['Published','Cancelled'].includes(i.stage||'Published')&&(cls?visible(i.audience,Number(cls.slice(0,-1)),cls):classes.length?classes.some(cl=>visible(i.audience,Number(cl.slice(0,-1)),cl)):i.audience.is_global&&!i.audience.excluded_classes?.length)));
 const schedule=(await db().prepare('SELECT id,data FROM workspace_schedule WHERE actor=?').bind(c.person.email).all<{id:string;data:string}>()).results.map(x=>({id:x.id,...JSON.parse(x.data)}));
 return json({person:{name:c.person.name,role:c.person.role,class_name:cls,classes},canManage,items:items.sort((a,b)=>(b.created||0)-(a.created||0)).map(({owner,...i}:any)=>({...i,mine:owner===c.person!.email})),schedule});
 }catch{return json({error:'Unable to load your workspace.'},503)}}
export async function POST(r:Request){try{
 if(r.headers.get('origin')!==new URL(r.url).origin)return json({error:'Request not allowed'},403);
 const raw=await r.text();if(raw.length>16000)return json({error:'Request too large'},413);const b=JSON.parse(raw),c=await identity(r);if(!c.person)return json({error:'School sign-in required.'},401);
 await limit('workspace:'+c.person.email);const d=db(),teacher=c.person.role==='teacher',manager=teacher||c.moderator||c.isAdmin;
 if(['schedule','editSchedule','removeSchedule'].includes(b.action)){
  if(!['teacher','staff','administrator'].includes(c.person.role))throw Error('Teacher access required.');
  const previous=b.id?await d.prepare('SELECT data FROM workspace_schedule WHERE id=? AND actor=?').bind(clean(b.id,100),c.person.email).first<{data:string}>():null;
  if(b.action!=='schedule'&&!previous)return json({error:'Session unavailable.'},404);
  if(b.action==='removeSchedule'){await d.prepare('DELETE FROM workspace_schedule WHERE id=? AND actor=?').bind(b.id,c.person.email).run();return json({ok:true})}
  if(previous&&b.revision!==(JSON.parse(previous.data).revision||1))return json({error:'This session changed. Refresh and try again.'},409);
  const day=Number(b.day),start=String(b.start||''),end=String(b.end||''),className=String(b.class_name||'');
  if(!Number.isInteger(day)||day<0||day>6||!/^([01]\d|2[0-3]):[0-5]\d$/.test(start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(end)||end<=start)throw Error('Check the day and session times.');
  if(className&&!assigned(c).includes(className)&&!c.isAdmin)throw Error('Choose an assigned class.');
  const saved=(await d.prepare('SELECT id,data FROM workspace_schedule WHERE actor=?').bind(c.person.email).all<{id:string;data:string}>()).results;
  if(saved.some(x=>{const s=JSON.parse(x.data);return x.id!==b.id&&s.day===day&&start<s.end&&end>s.start}))throw Error('This overlaps another session or break.');
  if(saved.length>=100&&!previous)throw Error('Timetable is full. Remove unused sessions.');
  const data={revision:previous?(JSON.parse(previous.data).revision||1)+1:1,day,start,end,class_name:className,title:clean(b.title,120),room:String(b.room||'').slice(0,80),kind:b.kind==='Break'?'Break':'Session'};await moderate(data.title+' '+data.room);
  const noOverlap="NOT EXISTS(SELECT 1 FROM workspace_schedule WHERE actor=? AND id<>? AND json_extract(data,'$.day')=? AND json_extract(data,'$.end')>? AND json_extract(data,'$.start')<?)";
  const result=previous?await d.prepare('UPDATE workspace_schedule SET data=? WHERE id=? AND actor=? AND data=? AND '+noOverlap).bind(JSON.stringify(data),b.id,c.person.email,previous.data,c.person.email,b.id,day,start,end).run():await d.prepare('INSERT INTO workspace_schedule(id,actor,data) SELECT ?,?,? WHERE '+noOverlap+' AND (SELECT COUNT(*) FROM workspace_schedule WHERE actor=?)<100').bind(crypto.randomUUID(),c.person.email,JSON.stringify(data),c.person.email,'',day,start,end,c.person.email).run();
  if(!result.meta.changes)return json({error:'Your timetable changed or this session overlaps. Refresh and try again.'},409);return json({ok:true});
 }
 if(!manager)throw Error('Publishing access required.');
 let previous:any=null,previousRaw='';
 if(['release','archive','reject','edit'].includes(b.action)){
  const row=await d.prepare("SELECT data FROM content WHERE id=? AND kind IN ('announcement','event','poll')").bind(clean(b.id,100)).first<{data:string}>();if(!row)throw Error('Content unavailable.');const i=JSON.parse(row.data);
  if(b.action==='reject'){if(!c.staff||i.stage!=='Pending approval')throw Error('Staff review access required.');const note=clean(b.reviewNote,600);await moderate(note);i.reviewNote=note;i.stage='Draft'}
  if(b.action==='release'){
   if(!['Draft','Pending approval'].includes(i.stage))throw Error('This post is already released.');
   if(!c.staff&&i.owner!==c.person.email)throw Error('You can only submit your own draft.');checkTeacherAudience(i,c);
   if(i.kind==='poll'&&!(Date.parse(i.end)>Date.now()))throw Error('The voting deadline has passed. Edit the draft before publishing.');
   if(i.kind==='event'&&!(Date.parse(i.end)>Date.now()))throw Error('This event has ended. Edit the draft before publishing.');
   i.stage=c.person.role==='council'?'Pending approval':'Published';delete i.reviewNote;
  }
  if(b.action==='archive'){if(!c.isAdmin&&i.owner!==c.person.email)throw Error('You can only archive your own posts.');i.stage='Archived'}
  if(b.action!=='edit'){
   i.revision=(i.revision||1)+1;
   const result=await d.prepare('UPDATE content SET data=? WHERE id=? AND data=?').bind(JSON.stringify(i),b.id,row.data).run();if(!result.meta.changes)return json({error:'This update changed. Refresh and try again.'},409);await recordAudit(c,'Workspace '+i.stage,i.id);return json({ok:true,stage:i.stage});
  }
  if(!c.isAdmin&&i.owner!==c.person.email)throw Error('You can only edit your own updates.');
  if(i.stage==='Archived')throw Error('Archived updates cannot be edited.');
  if(b.revision!==(i.revision||1))return json({error:'This update changed. Refresh and try again.'},409);
  if(b.kind!==i.kind)throw Error('Keep the original content type.');
  if(i.kind==='poll'&&i.stage==='Published')throw Error('Archive a published poll and create a new one to protect existing votes.');
  previous=i;previousRaw=row.data;
 }
 if(!['publish','edit'].includes(b.action))throw Error('Unknown action.');
 const audience=publishingAudience(b,c),kind=String(b.kind);if(!['announcement','event','poll'].includes(kind))throw Error('Choose a content type.');if(kind==='poll'&&teacher)throw Error('School polls are managed by High Board.');
 const title=clean(b.title,160),description=clean(b.description,2000);await moderate(title+' '+description);
 const stage=b.stage==='Draft'?'Draft':c.person.role==='council'?'Pending approval':'Published';
 const i:any={...previous,id:previous?.id||crypto.randomUUID(),kind,title,description,owner:previous?.owner||c.person.email,author:previous?.author||c.person.name,created:previous?.created||Date.now(),revision:(previous?.revision||0)+1,stage,audience};
 if(kind==='announcement')i.effective=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo'}).format(new Date());
 if(kind==='event'){
  i.category=b.category==='Trip'?'Trip':'Class Event';i.start=instant(b.start);i.end=instant(b.end);if(Date.parse(i.end)<=Date.parse(i.start))throw Error('End must be after start.');i.room=String(b.room||'').slice(0,100);
  if(i.category==='Trip'){
   if(b.cost!==''&&b.cost!==undefined){const cost=Number(b.cost);if(!Number.isFinite(cost)||cost<0||cost>100000)throw Error('Check the trip fee.');i.cost=cost}
   for(const field of ['deadline','interestDeadline'])if(b[field]){i[field]=instant(b[field]);if(Date.parse(i[field])>Date.parse(i.start))throw Error('Trip deadlines must be before departure.')}
   i.notes=String(b.notes||'').trim();if(i.notes.length>1000)throw Error('Keep the packing checklist under 1,000 characters.');await moderate(i.notes);
  }
 }
 if(kind==='poll'){i.options=String(b.options||'').split('\n').map(s=>s.trim()).filter(Boolean);if(i.options.length<2||i.options.length>8||new Set(i.options.map((s:string)=>s.toLowerCase())).size!==i.options.length||i.options.some((s:string)=>s.length>100))throw Error('Enter 2–8 different choices, one per line.');await moderate(i.options.join(' '));i.end=instant(b.end);if(stage!=='Draft'&&!(Date.parse(i.end)>Date.now()))throw Error('Choose a future closing date.');i.verified=true;i.multi=false}
 if(previous){const result=await d.prepare('UPDATE content SET data=? WHERE id=? AND data=?').bind(JSON.stringify(i),i.id,previousRaw).run();if(!result.meta.changes)return json({error:'This update changed. Refresh and try again.'},409)}else await d.prepare('INSERT INTO content(id,kind,data) VALUES(?,?,?)').bind(i.id,kind,JSON.stringify(i)).run();
 await recordAudit(c,'Workspace '+stage,i.id);return json({ok:true,stage});
 }catch(e){return json({error:e instanceof Error?e.message:'Unable to save.'},e instanceof RateLimitError?429:400)}}
