import {db} from '@/lib/db';
import {identity,json,clean,limit,RateLimitError,recordAudit,type Person} from '@/lib/communications';
export const dynamic='force-dynamic';
const reviewer=(p:Person)=>['staff','administrator'].includes(p.role);
async function scope(p:Person){
 const roster=(await db().prepare("SELECT email,name,class_name FROM comm_people WHERE active=1 AND role IN ('student','council') ORDER BY class_name,name").all<{email:string;name:string;class_name:string}>()).results;
 const assigned: string[]=JSON.parse(p.classes||'[]');
 const classes=reviewer(p)?[...new Set([...assigned,...roster.map(s=>s.class_name)])].filter(Boolean).sort():assigned;
 return {classes,students:roster.filter(s=>classes.includes(s.class_name))};
}
function allowed(p:Person,row:any,classes:string[]){return reviewer(p)?row.status!=='Draft'||row.author===p.email:row.author===p.email&&classes.includes(row.class_name)}
export async function GET(r:Request){try{
 const c=await identity(r),p=c.person;if(!p)return json({error:'School sign-in required.'},401);if(!['teacher','staff','administrator'].includes(p.role))return json({error:'Reports are available to teachers and school staff.'},403);
 const {classes,students}=await scope(p);
 const rows=(await db().prepare("SELECT r.*,p.name author_name,s.name student_name FROM teacher_reports r LEFT JOIN comm_people p ON p.email=r.author LEFT JOIN comm_people s ON s.email=r.student WHERE r.author=? OR (?=1 AND r.status!='Draft') ORDER BY r.updated DESC LIMIT 101").bind(p.email,Number(reviewer(p))).all<any>()).results.filter(row=>allowed(p,row,classes)&&(!row.student||reviewer(p)||students.some(s=>s.email===row.student&&s.class_name===row.class_name)));
 return json({account:p.email,reviewer:reviewer(p),classes,students,reports:rows.slice(0,100),hasMore:rows.length>100});
 }catch{return json({error:'Reports could not load. Please retry.'},503)}}
async function payload(r:Request){const reader=r.body?.getReader();if(!reader)throw Error('Report details required.');let size=0,text='';const decoder=new TextDecoder();try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>14000){await reader.cancel();throw Error('Report is too large.')}text+=decoder.decode(part.value,{stream:true})}text+=decoder.decode();return JSON.parse(text)}finally{reader.releaseLock()}}
export async function POST(r:Request){try{
 if(r.headers.get('origin')!==new URL(r.url).origin)return json({error:'Request not allowed.'},403);
 const c=await identity(r),p=c.person;if(!p)return json({error:'School sign-in required.'},401);if(!['teacher','staff','administrator'].includes(p.role))return json({error:'Reports are available to teachers and school staff.'},403);
 await limit('reports:'+p.email,40);const b=await payload(r),d=db(),{classes,students}=await scope(p);
 const id=clean(b.id,100);if(!/^[a-f0-9-]{36}$/i.test(id))throw Error('Check the report identifier.');
 const old=await d.prepare('SELECT * FROM teacher_reports WHERE id=?').bind(id).first<any>();
 if(old&&!allowed(p,old,classes))return json({error:'Report unavailable.'},404);
 const now=Date.now();
 if(b.action==='review'){
  if(!old||old.status==='Draft'||!reviewer(p))return json({error:'Report unavailable.'},404);
  if(!['Submitted','In review','Resolved'].includes(b.status)||typeof b.review!=='string'||b.review.length>2000)throw Error('Check the review status and feedback.');
  const result=await d.prepare('UPDATE teacher_reports SET status=?,review=?,reviewer=?,revision=revision+1,updated=? WHERE id=? AND revision=?').bind(b.status,b.review.trim(),p.email,now,id,b.revision).run();
  if(!result.meta.changes)return json({error:'This report changed. Reload it before saving.'},409);
 }else{
  if(!['save','submit'].includes(b.action))throw Error('Unknown action.');
  if(old&&(old.author!==p.email||old.status!=='Draft'))return json({error:'Submitted reports cannot be edited.'},409);
  const title=clean(b.title,160),body=clean(b.body,4000),className=clean(b.class_name,20),student=String(b.student||''),date=String(b.report_date||'');
  if(!classes.includes(className)||student&&!students.some(s=>s.email===student&&s.class_name===className))return json({error:'Choose an assigned class and an active student in that class.'},403);
  if(!['Progress','Attendance','Behavior','General'].includes(b.category)||!['normal','high'].includes(b.priority)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T12:00:00Z'))||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw Error('Check the category, date and priority.');
  const status=b.action==='submit'?'Submitted':'Draft';
  if(old){const result=await d.prepare('UPDATE teacher_reports SET class_name=?,student=?,category=?,priority=?,title=?,body=?,report_date=?,status=?,revision=revision+1,updated=? WHERE id=? AND author=? AND revision=? AND status=\'Draft\'').bind(className,student,b.category,b.priority,title,body,date,status,now,id,p.email,b.revision).run();if(!result.meta.changes)return json({error:'This draft changed. Reload it before saving.'},409)}
  else {const result=await d.prepare('INSERT OR IGNORE INTO teacher_reports(id,author,class_name,student,category,priority,title,body,report_date,status,created,updated) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,p.email,className,student,b.category,b.priority,title,body,date,status,now,now).run();if(!result.meta.changes)return json({error:'This report already exists. Reload it before saving.'},409)}
 }
 await recordAudit(c,'class-report-'+b.action,id);return json({ok:true,id});
 }catch(e){return json({error:e instanceof RateLimitError?e.message:e instanceof SyntaxError?'Check the report details.':e instanceof Error&&/required|Check|large|Unknown/.test(e.message)?e.message:'Report could not be saved. Your draft is still open. Please retry.'},e instanceof RateLimitError?429:400)}}
