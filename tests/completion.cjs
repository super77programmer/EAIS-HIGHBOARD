// Run with node tests/communications.cjs. Uses Node's in-memory SQLite and real route handlers.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{DatabaseSync}=require('node:sqlite'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),ts=require('typescript'),out=fs.mkdtempSync(path.join(os.tmpdir(),'hb-communications-'));fs.symlinkSync(root+'/node_modules',out+'/node_modules','dir');
for(const f of ['app/api/planner/route.ts','app/api/trips/route.ts','lib/trips.ts','lib/trip-questions.ts','app/api/workspace/route.ts','lib/school-time.ts','lib/home-focus.ts','components/PublishingEditor.tsx','components/Planner.tsx','app/api/media-upload/route.ts','lib/communications.ts','lib/board.ts','lib/file-validation.ts','app/api/board/route.ts','lib/moderation.ts','lib/admin-auth.ts','app/api/community/route.ts','app/api/attachments/route.ts','app/api/school-auth/route.ts']){const dest=out+'/'+f.replace(/\.ts$/,'.js');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,ts.transpileModule(fs.readFileSync(root+'/'+f,'utf8').replaceAll("'@/",`'${out}/`),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText)}
const sql=new DatabaseSync(':memory:');for(const f of fs.readdirSync(root+'/drizzle').filter(x=>x.endsWith('.sql')).sort())sql.exec(fs.readFileSync(root+'/drizzle/'+f,'utf8'));
const storage=new Map();const database={prepare(query){let values=[];return {bind(...v){values=v;return this},async first(){return sql.prepare(query).get(...values)||null},async all(){return {results:sql.prepare(query).all(...values)}},async run(){const r=sql.prepare(query).run(...values);return {meta:{changes:Number(r.changes)}}}}},async batch(list){sql.exec('BEGIN');try{const r=await Promise.all(list.map(q=>q.run()));sql.exec('COMMIT');return r}catch(e){sql.exec('ROLLBACK');throw e}}};
global.__testDb=database;global.__testFiles={async put(k,v){storage.set(k,v)},async delete(k){for(const key of Array.isArray(k)?k:[k])storage.delete(key)},async get(k){const b=storage.get(k);return b?{body:b,size:b.length}:null}};
fs.writeFileSync(out+'/lib/db.js',"exports.db=()=>global.__testDb;exports.files=()=>global.__testFiles;exports.settings=()=>({ADMIN_PIN:'test-pin-only',SESSION_SECRET:'a-very-long-random-test-only-session-secret'});");
const core=require(out+'/lib/communications.js'),route=require(out+'/app/api/community/route.js'),attachments=require(out+'/app/api/attachments/route.js'),auth=require(out+'/lib/admin-auth.js'),{prohibited}=require(out+'/lib/moderation.js');
const origin='https://school.test';let tests=0;async function req(body,cookie='',query=''){const r=new Request(origin+'/api/community'+query,{method:body?'POST':'GET',headers:{origin,cookie,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const res=await route[body?'POST':'GET'](r);const data=await res.json();return {res,data}}
async function ok(body,cookie,query){const x=await req(body,cookie,query);assert.equal(x.res.status,200,JSON.stringify(x.data));tests++;return x}
async function denied(body,cookie,query){const x=await req(body,cookie,query);assert.ok(x.res.status>=400,'Expected access denial');tests++;return x}

const workspace=require(out+'/app/api/workspace/route.js'),media=require(out+'/app/api/media-upload/route.js'),board=require(out+'/app/api/board/route.js');
const uploads=new Map();global.__testFiles.createMultipartUpload=async(key)=>{const uploadId=crypto.randomUUID();uploads.set(uploadId,{key,parts:new Map()});return {uploadId,abort:async()=>uploads.delete(uploadId)}};
global.__testFiles.resumeMultipartUpload=(key,id)=>({async uploadPart(n,b){assert.ok(b.length<=8*1024*1024);uploads.get(id).parts.set(n,b.length);return {etag:'part-'+n}},async complete(parts){const x=uploads.get(id);storage.set(key,{length:parts.reduce((n,p)=>n+x.parts.get(p.partNumber),0)});uploads.delete(id)},async abort(){uploads.delete(id)}});global.__testFiles.head=async key=>storage.has(key)?{size:storage.get(key).length}:null;
async function call(handler,body,cookie='',query='',type='application/json'){const r=new Request(origin+'/api/test'+query,{method:body?'POST':'GET',headers:{origin,cookie,'content-type':type},...(body?{body:type==='application/json'?JSON.stringify(body):body}:{})});const res=await handler[body?'POST':'GET'](r);return {status:res.status,data:await res.json()}}

const planner=require(out+'/app/api/planner/route.js'),trips=require(out+'/app/api/trips/route.js'),schoolTime=require(out+'/lib/school-time.js');
(async()=>{
for(const p of [{email:'s@els-egypt.info',name:'Student',role:'student',class_name:'8A'},{email:'o@els-egypt.info',name:'Other',role:'student',class_name:'8B'},{email:'t@els-egypt.info',name:'Teacher',role:'teacher',classes:['8A']},{email:'v@els-egypt.info',name:'Other teacher',role:'teacher',classes:['8B']},{email:'c@els-egypt.info',name:'Council',role:'council',class_name:'8A'},{email:'f@els-egypt.info',name:'Staff',role:'staff'},{email:'a@els-egypt.info',name:'Admin',role:'administrator'}])sql.prepare('INSERT INTO comm_people(email,name,role,class_name,classes,active) VALUES(?,?,?,?,?,1)').run(p.email,p.name,p.role,p.class_name||'',JSON.stringify(p.classes||[]));
const cookies={};for(const k of ['s','o','t','v','c','f','a'])cookies[k]='hb_identity='+await core.newSession(k+'@els-egypt.info',1);
const student=cookies.s,other=cookies.o,teacher=cookies.t,council=cookies.c,staff=cookies.f,admin=cookies.a;
assert.equal((await call(planner,null)).data.connected,false);
assert.equal((await call(planner,{action:'create',title:'Homework'})).status,401);
const task={action:'create',title:'Finish algebra',subject:'Math',due:'2026-10-20',priority:'high'};
assert.equal((await call(planner,task,student)).status,200);
let saved=(await call(planner,null,student)).data.tasks[0];assert.equal(saved.title,task.title);assert.equal(saved.revision,1);
assert.equal((await call(planner,null,other)).data.tasks.length,0);
assert.equal((await call(planner,{action:'toggle',id:saved.id,revision:1,done:true},other)).status,404);
assert.equal((await call(planner,{action:'toggle',id:saved.id,revision:1,done:true},admin)).status,404);
assert.equal((await call(planner,{action:'toggle',id:saved.id,revision:1,done:true},student)).status,200);
assert.equal((await call(planner,{action:'toggle',id:saved.id,revision:1,done:false},student)).status,409);
assert.equal((await call(planner,{...task,action:'update',id:saved.id,revision:2,title:'Review geometry'},student)).status,200);
assert.equal((await call(planner,null,student)).data.tasks[0].revision,3);
assert.equal((await call(planner,{...task,due:'2026-02-30'},student)).status,400);
assert.equal((await call(planner,{action:'preference',homeFocus:'trips'},student)).status,200);
assert.equal((await call(planner,null,student)).data.homeFocus,'trips');assert.equal((await call(planner,null,other)).data.homeFocus,undefined);
assert.equal((await call(planner,{action:'preference',homeFocus:'admin'},student)).status,400);
const csrf=await planner.POST(new Request(origin+'/api/planner',{method:'POST',headers:{origin:'https://evil.test',cookie:student},body:JSON.stringify(task)}));assert.equal(csrf.status,403);
assert.equal(schoolTime.schoolInstant('2026-10-11T09:00'),'2026-10-11T06:00:00.000Z');
assert.equal(schoolTime.schoolInstant('2026-11-15T09:00'),'2026-11-15T07:00:00.000Z');
assert.throws(()=>schoolTime.schoolInstant('2026-04-24T00:30'));assert.throws(()=>schoolTime.schoolInstant('2026-10-29T23:30'));assert.throws(()=>schoolTime.schoolInstant('2026-02-30T09:00'));
const post={action:'publish',kind:'announcement',title:'Bring notebooks',description:'Notebook reminder',classes:['8A'],grades:[],global:false,stage:'Draft'};
assert.equal((await call(workspace,post,teacher)).status,200);
let item=(await call(workspace,null,teacher)).data.items[0];
assert.equal((await call(workspace,{...post,action:'edit',id:item.id,revision:1,title:'Bring geometry notebooks'},cookies.v)).status,400);
assert.equal((await call(workspace,{...post,action:'edit',id:item.id,revision:1,title:'Bring geometry notebooks'},teacher)).status,200);
assert.equal((await call(workspace,{...post,action:'edit',id:item.id,revision:1},teacher)).status,409);
assert.equal((await call(workspace,{...post,action:'edit',id:item.id,revision:2,classes:['8B']},teacher)).status,400);
assert.equal((await call(workspace,{action:'release',id:item.id},teacher)).status,200);
assert.equal((await call(workspace,null,other)).data.items.length,0);
assert.equal((await call(workspace,{...post,title:'Council trip',stage:'Published'},council)).status,200);
const draft=(await call(workspace,null,council)).data.items.find(i=>i.title==='Council trip');assert.equal(draft.stage,'Pending approval');
assert.equal((await call(workspace,{action:'reject',id:draft.id,reviewNote:'Add the meeting point'},teacher)).status,400);
assert.equal((await call(workspace,{action:'reject',id:draft.id,reviewNote:'Add the meeting point'},staff)).status,200);
let reviewed=(await call(workspace,null,council)).data.items.find(i=>i.id===draft.id);assert.equal(reviewed.stage,'Draft');assert.equal(reviewed.reviewNote,'Add the meeting point');
assert.equal((await call(workspace,{...post,action:'edit',id:draft.id,revision:reviewed.revision||1,title:'Updated council trip',stage:'Published'},council)).status,200);
assert.equal((await call(workspace,{action:'release',id:draft.id},staff)).status,200);
const schedule={action:'schedule',title:'Mathematics',day:1,start:'09:00',end:'10:00',class_name:'8A',kind:'Session'};
assert.equal((await call(workspace,schedule,teacher)).status,200);let session=(await call(workspace,null,teacher)).data.schedule[0];
assert.equal((await call(workspace,{...schedule,action:'editSchedule',id:session.id,revision:session.revision||1,start:'10:00',end:'11:00'},teacher)).status,200);
assert.equal((await call(workspace,{...schedule,action:'editSchedule',id:session.id,revision:session.revision||1},cookies.v)).status,404);
assert.equal((await call(workspace,{...schedule,start:'10:30',end:'11:30'},teacher)).status,400);
const future=new Date(Date.now()+7*86400000).toISOString(),end=new Date(Date.now()+8*86400000).toISOString();
const tripPost={...post,kind:'event',category:'Trip',title:'Museum trip',start:future,end,cost:200,notes:'Bring water',stage:'Published'};
assert.equal((await call(workspace,tripPost,teacher)).status,200);const trip=(await call(workspace,null,teacher)).data.items.find(i=>i.title==='Museum trip');
assert.equal((await call(trips,{trip:trip.id,choice:'interested'},student)).status,200);
let row=(await call(trips,null,teacher,'?manage=1')).data.trips.find(i=>i.id===trip.id).students[0];assert.match(row.id,/^[a-f0-9]{64}$/);assert.equal(row.actor,undefined);
const mark={action:'collection',trip:trip.id,student:row.id,field:'paid',value:true};
assert.equal((await call(trips,mark,student)).status,403);assert.equal((await call(trips,mark,council)).status,403);assert.equal((await call(trips,mark,cookies.v)).status,403);
assert.equal((await call(trips,mark,teacher)).status,200);assert.equal((await call(trips,{...mark,field:'permission'},teacher)).status,200);
assert.equal((await call(trips,null,student)).data.mine[trip.id].paid,true);assert.equal((await call(trips,null,student)).data.mine[trip.id].permission,true);assert.equal((await call(trips,null,other)).data.mine[trip.id],undefined);
assert.equal((await call(trips,{...mark,field:'anything'},teacher)).status,400);
assert.equal((await call(trips,{trip:trip.id,choice:'declined'},student)).status,200);
row=(await call(trips,null,teacher,'?manage=1')).data.trips.find(i=>i.id===trip.id);assert.equal(row.total,0);assert.equal(row.students.length,1,'Receipt stays visible after a decline');assert.equal(row.students[0].choice,'declined');
assert.equal((await call(trips,mark,teacher)).status,400);assert.equal((await call(trips,{...mark,value:false},teacher)).status,200);assert.equal((await call(trips,{...mark,field:'permission',value:false},teacher)).status,200);assert.equal((await call(trips,null,teacher,'?manage=1')).data.trips.find(i=>i.id===trip.id).students.length,0);
sql.prepare('UPDATE content SET data=? WHERE id=?').run(JSON.stringify({...trip,interestDeadline:new Date(Date.now()-1000).toISOString()}),trip.id);
assert.equal((await call(trips,{trip:trip.id,choice:'interested'},student)).status,409);
assert.equal((await call(planner,{action:'delete',id:saved.id,revision:3},student)).status,200);assert.equal((await call(planner,null,student)).data.tasks.length,0);
console.log('PASS: private planner CRUD and conflicting revisions, account preference isolation, Cairo DST boundaries, owner-only draft editing, staff review feedback, timetable editing/overlap, private trip collection ticks and receipt preservation after decline, response deadline and CSRF.');
})().catch(e=>{console.error(e);process.exitCode=1});
