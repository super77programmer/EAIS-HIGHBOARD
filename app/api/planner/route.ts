import {db} from '@/lib/db';
import {identity,json,clean,limit,RateLimitError} from '@/lib/communications';
import {homeFocusOptions} from '@/lib/home-focus';
export const dynamic='force-dynamic';
export async function GET(r:Request){
 try{const c=await identity(r);if(!c.person)return json({connected:false,tasks:[]});
 const tasks=(await db().prepare('SELECT id,title,subject,due,priority,done,revision,updated FROM personal_tasks WHERE actor=? ORDER BY done,due,id').bind(c.person.email).all()).results;
 const p=await db().prepare('SELECT home_focus FROM school_preferences WHERE actor=?').bind(c.person.email).first<{home_focus:string}>();
 return json({connected:true,account:c.person.email,tasks,homeFocus:p?.home_focus});
 }catch{return json({error:'Unable to load your planner. Try again.'},503)}
}
export async function POST(r:Request){
 try{if(r.headers.get('origin')!==new URL(r.url).origin)return json({error:'Request not allowed.'},403);
 const c=await identity(r);if(!c.person)return json({error:'School sign-in required.'},401);
 const raw=await r.text();if(raw.length>3000)return json({error:'Request too large.'},413);const b=JSON.parse(raw);await limit('planner:'+c.person.email,60);const d=db();
 if(b.action==='preference'){
  if(!homeFocusOptions.some(x=>x.value===b.homeFocus))throw Error('Choose a valid Home focus.');
  await d.prepare('INSERT INTO school_preferences(actor,home_focus) VALUES(?,?) ON CONFLICT(actor) DO UPDATE SET home_focus=excluded.home_focus').bind(c.person.email,b.homeFocus).run();return json({ok:true});
 }
 if(['toggle','delete','update'].includes(b.action)){
  const task=await d.prepare('SELECT * FROM personal_tasks WHERE id=? AND actor=?').bind(clean(b.id,100),c.person.email).first<{revision:number}>();
  if(!task)return json({error:'Task unavailable.'},404);if(b.revision!==task.revision)return json({error:'This task changed on another device. Refresh and try again.'},409);
  if(b.action==='delete'){const result=await d.prepare('DELETE FROM personal_tasks WHERE id=? AND actor=? AND revision=?').bind(b.id,c.person.email,b.revision).run();if(!result.meta.changes)return json({error:'Task changed. Refresh and retry.'},409);return json({ok:true})}
  if(b.action==='toggle'){
   if(typeof b.done!=='boolean')throw Error('Check task status.');
   const result=await d.prepare('UPDATE personal_tasks SET done=?,revision=revision+1,updated=? WHERE id=? AND actor=? AND revision=?').bind(Number(b.done),Date.now(),b.id,c.person.email,b.revision).run();if(!result.meta.changes)return json({error:'Task changed. Refresh and retry.'},409);return json({ok:true});
  }
 }
 if(!['create','update'].includes(b.action))throw Error('Unknown action.');
 const title=clean(b.title,160),subject=String(b.subject||'').trim(),due=String(b.due||''),priority=b.priority||'normal';
 if(subject.length>60||!['normal','high'].includes(priority)||due&&(!/^\d{4}-\d{2}-\d{2}$/.test(due)||!Number.isFinite(Date.parse(due+'T12:00:00Z'))||new Date(due+'T12:00:00Z').toISOString().slice(0,10)!==due))throw Error('Check the subject, due date and priority.');
 if(b.action==='update'){const result=await d.prepare('UPDATE personal_tasks SET title=?,subject=?,due=?,priority=?,revision=revision+1,updated=? WHERE id=? AND actor=? AND revision=?').bind(title,subject,due,priority,Date.now(),b.id,c.person.email,b.revision).run();if(!result.meta.changes)return json({error:'Task changed. Refresh and retry.'},409)}
 else{const count=await d.prepare('SELECT COUNT(*) n FROM personal_tasks WHERE actor=?').bind(c.person.email).first<{n:number}>();if((count?.n||0)>=300)throw Error('Your planner is full. Remove completed tasks to add more.');await d.prepare('INSERT INTO personal_tasks(id,actor,title,subject,due,priority,done,revision,updated) VALUES(?,?,?,?,?,?,0,1,?)').bind(crypto.randomUUID(),c.person.email,title,subject,due,priority,Date.now()).run()}
 return json({ok:true});
 }catch(e){return json({error:e instanceof Error?e.message:'Unable to save your task.'},e instanceof RateLimitError?429:400)}
}
