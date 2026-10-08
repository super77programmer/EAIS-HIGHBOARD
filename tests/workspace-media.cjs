// Run with node tests/communications.cjs. Uses Node's in-memory SQLite and real route handlers.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{DatabaseSync}=require('node:sqlite'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),ts=require('typescript'),out=fs.mkdtempSync(path.join(os.tmpdir(),'hb-communications-'));fs.symlinkSync(root+'/node_modules',out+'/node_modules','dir');
for(const f of ['app/api/workspace/route.ts','app/api/media-upload/route.ts','lib/communications.ts','lib/board.ts','lib/file-validation.ts','app/api/board/route.ts','lib/moderation.ts','lib/admin-auth.ts','app/api/community/route.ts','app/api/attachments/route.ts','app/api/school-auth/route.ts']){const dest=out+'/'+f.replace(/\.ts$/,'.js');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,ts.transpileModule(fs.readFileSync(root+'/'+f,'utf8').replaceAll("'@/",`'${out}/`),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText)}
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
(async()=>{
for(const p of [{email:'s@els-egypt.info',name:'Student',role:'student',class_name:'8A'},{email:'o@els-egypt.info',name:'Other',role:'student',class_name:'8B'},{email:'t@els-egypt.info',name:'Teacher',role:'teacher',classes:['8A']},{email:'c@els-egypt.info',name:'Council',role:'council',class_name:'8A'},{email:'a@els-egypt.info',name:'Admin',role:'administrator'}])sql.prepare('INSERT INTO comm_people(email,name,role,class_name,classes,active) VALUES(?,?,?,?,?,1)').run(p.email,p.name,p.role,p.class_name||'',JSON.stringify(p.classes||[]));
sql.prepare("INSERT INTO comm_people(email,name,role,class_name,classes,active) VALUES(?,?,?,'','[]',1)").run("unassigned@els-egypt.info","Unassigned student","student");
const cookieFor=async x=>'hb_identity='+await core.newSession(x+'@els-egypt.info',1),student=await cookieFor('s'),teacher=await cookieFor('t'),outsider=await cookieFor('o'),council=await cookieFor('c'),admin=await cookieFor('a');
const unassigned=await cookieFor('unassigned');
for(const [id,audience] of [['global-test',{is_global:true,target_grades:[],target_classes:[],excluded_classes:[]}],['class-test',{is_global:false,target_grades:[],target_classes:['8A'],excluded_classes:[]}],['excluded-test',{is_global:true,target_grades:[],target_classes:[],excluded_classes:['8A']}]] )sql.prepare('INSERT INTO content(id,kind,data) VALUES(?,?,?)').run(id,'announcement',JSON.stringify({id,kind:'announcement',title:id,description:'School update',stage:'Published',owner:'a@els-egypt.info',audience}));
const unassignedWorkspace=(await call(workspace,null,unassigned)).data;assert.ok(unassignedWorkspace.items.some(i=>i.id==='global-test'));assert.equal(unassignedWorkspace.items.some(i=>['class-test','excluded-test'].includes(i.id)),false);assert.equal(unassignedWorkspace.canManage,false);const assignedWorkspace=(await call(workspace,null,student)).data;assert.ok(assignedWorkspace.items.some(i=>i.id==='class-test'));assert.equal(assignedWorkspace.items.some(i=>i.id==='excluded-test'),false);
sql.exec("DELETE FROM content WHERE id IN ('global-test','class-test','excluded-test')");

const post={action:'publish',kind:'announcement',title:'Class update',description:'Bring your notebook',classes:['8A'],grades:[],global:false,stage:'Published'};
assert.equal((await call(workspace,post,student)).status,400);
assert.equal((await call(workspace,{...post,classes:['8B']},teacher)).status,400);
assert.equal((await call(workspace,{...post,global:true},teacher)).status,400);
assert.equal((await call(workspace,post,teacher)).status,200);
const own=(await call(workspace,null,teacher)).data.items[0];assert.equal(own.mine,true);assert.equal(own.owner,undefined);
assert.equal((await call(workspace,null,outsider)).data.items.length,0);assert.equal((await call(workspace,null,student)).data.items.length,1);
const restoredClass=await call(board,null,student,'?grade=8&class=8B&student=anon_test');assert.ok(restoredClass.data.items.some(i=>i.id===own.id));assert.equal(restoredClass.data.verifiedClass,'8A');
const forged=await call(board,null,outsider,'?grade=8&class=8A&student=anon_test');assert.equal(forged.data.items.some(i=>i.id===own.id),false);
assert.equal((await call(board,null,'','?grade=8&class=8A&student=anon_test')).data.items.some(i=>i.id===own.id),false);
assert.equal((await call(workspace,{...post,kind:'poll'},teacher)).status,400);
assert.equal((await call(workspace,{...post,title:'Council update',global:true,classes:[]},council)).data.stage,'Pending approval');
const pending=(await call(workspace,null,council)).data.items.find(i=>i.title==='Council update');assert.equal((await call(workspace,null,student)).data.items.some(i=>i.id===pending.id),false);
assert.equal((await call(workspace,{action:'release',id:pending.id},teacher)).status,400);assert.equal((await call(workspace,{action:'release',id:pending.id},admin)).data.stage,'Published');
assert.equal((await call(workspace,{action:'archive',id:own.id},council)).status,400);
const session={action:'schedule',day:0,start:'09:00',end:'09:45',title:'Maths',class_name:'8A',kind:'Session'};
assert.equal((await call(workspace,session,teacher)).status,200);assert.equal((await call(workspace,{...session,class_name:'8B'},teacher)).status,400);assert.equal((await call(workspace,session,student)).status,400);assert.equal((await call(workspace,null,student)).data.schedule.length,0);
const saved=(await call(workspace,null,teacher)).data.schedule[0];await call(workspace,{action:'removeSchedule',id:saved.id},outsider);assert.equal((await call(workspace,null,teacher)).data.schedule.length,1);
const thread=(await ok({action:'start',teacher:'t@els-egypt.info'},student)).data.id,size=80*1024*1024;
const begin={thread,name:'Lesson.mp4',mime:'video/mp4',size};assert.equal((await call(media,begin,outsider,'?action=begin')).status,400);assert.equal((await call(media,{...begin,size:501*1024*1024},teacher,'?action=begin')).status,400);assert.equal((await call(media,{...begin,name:'Program.exe'},teacher,'?action=begin')).status,400);
const started=await call(media,begin,teacher,'?action=begin');assert.equal(started.status,200,JSON.stringify(started.data));const id=started.data.id;
assert.equal((await call(media,{},teacher,'?action=complete&id='+id)).status,400);assert.equal((await call(media,new Uint8Array(8*1024*1024),outsider,'?action=part&part=1&id='+id,'application/octet-stream')).status,400);
assert.equal((await call(media,new Uint8Array(8*1024*1024),teacher,'?action=part&part=1&id='+id,'application/octet-stream')).status,400);
for(let n=1;n<=10;n++){const bytes=new Uint8Array(8*1024*1024);if(n===1)bytes.set(new TextEncoder().encode('ftyp'),4);assert.equal((await call(media,bytes,teacher,'?action=part&part='+n+'&id='+id,'application/octet-stream')).status,200);}
const completed=await call(media,{},teacher,'?action=complete&id='+id);assert.equal(completed.status,200);assert.equal(completed.data.size,size);assert.equal(sql.prepare('SELECT size FROM comm_files WHERE id=?').get(id).size,size);assert.equal(sql.prepare('SELECT COUNT(*) n FROM media_parts').get().n,0);
const abandoned=(await call(media,begin,teacher,'?action=begin')).data.id;assert.equal((await call(media,{},teacher,'?action=abort&id='+abandoned)).status,200);assert.equal(uploads.size,0);
console.log('PASS: workspace role/class privacy, council approval, timetable isolation and 80 MB multipart upload with access, type, size, incomplete and abort checks.');
})().catch(e=>{console.error(e);process.exitCode=1});
