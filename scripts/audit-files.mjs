import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const postcss=createRequire(require.resolve('vite'))('postcss');
const files=[...new Set([...execFileSync('git',['ls-files'],{encoding:'utf8'}).trim().split('\n'),...execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'}).trim().split('\n')])].filter(Boolean).sort();
const rows=[],issues=[];
for(const file of files){const bytes=fs.readFileSync(file),ext=path.extname(file),text=bytes.toString('utf8');let check='Read / inventory';
 try{
  if(/\.(tsx?|mts|cts|jsx?)$/.test(file)){const tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ext==='.tsx'?ts.ScriptKind.TSX:ext==='.jsx'?ts.ScriptKind.JSX:ext==='.js'?ts.ScriptKind.JS:ts.ScriptKind.TS);if(tree.parseDiagnostics.length)throw Error(tree.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')).join('; '));check='Syntax / source scan';if(/\beval\s*\(|new Function\s*\(/.test(text)&&!file.startsWith('public/vendor/'))issues.push(file+': dynamic code execution needs review')}
  else if(ext==='.json'){JSON.parse(text);check='JSON structure'}
  else if(ext==='.css'){postcss.parse(text,{from:file});check='CSS structure'}
  else if(ext==='.sh'){execFileSync('bash',['-n',file],{stdio:'pipe'});check='Shell syntax'}
  else if(ext==='.jpg'){if(bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)throw Error('Invalid JPEG boundaries');check='Binary format'}
  else if(ext==='.svg'){if(!/<svg[\s>]/.test(text)||/<script[\s>]/i.test(text))throw Error('Invalid or scripted SVG');check='SVG structure / script scan'}
  else if(ext==='.sql'){if(!text.trim())throw Error('Empty migration');check='SQL read; execution covered by backend suites'}
  rows.push({file,bytes:bytes.length,check});
 }catch(e){issues.push(file+': '+e.message);rows.push({file,bytes:bytes.length,check:'FAIL'})}
}
const report='# App file review\n\nReviewed '+rows.length+' tracked and new files. Every file was read by the structural audit; the table records the applicable check. This is a static inventory and syntax review, supplemented by TypeScript, a production build, and functional tests. It is not a claim that every possible behavior has been verified.\n\n## Functional review\n\n- Teacher messaging: authorized recipient selection, private attachments, draft retention, keyboard layout, hold/release, upward lock, left cancellation, pause/resume, time limits and microphone cleanup.\n- Voice playback: compact controls, measured waveform after first playback, seeking and three playback speeds. Decoding is bounded to 20 MB, aborts on unmount, and stores no private audio cache. Larger audio plays without waveform decoding.\n- Backend: school identity, role/class authorization, CSRF, moderation, deduplicated sends, file signatures, multipart upload cancellation, trip interest and private questions, planner revisions, publishing and timetable conflicts.\n- Messaging refresh improvement: older paginated chats are pruned when their authorized peer disappears; a removed selection returns to the inbox instead of leaving a blank mobile conversation.\n- Board API improvement: streamed bodies are bounded to 16,000 bytes even without Content-Length.\n- Existing theme, intro, announcement-first Home and navigation remain in use. Alternate design experiments and unused component primitives were inventoried and preserved.\n\n## Verification limits\n\nReal-device microphone permissions, codec decoding, visual appearance, mobile keyboard behavior and gesture feel still require a phone/browser check. Static analysis cannot establish complete security or production readiness. Existing school-launch requirements in SCHOOL-LAUNCH-READINESS.md still apply.\n\n## File inventory\n\n| File | Bytes | Check |\n| --- | ---: | --- |\n'+rows.map(r=>'| `'+r.file+'` | '+r.bytes+' | '+r.check+' |').join('\n')+'\n\n## Structural findings\n\n'+(issues.length?issues.map(i=>'- '+i).join('\n'):'No structural failures found.')+'\n';
fs.writeFileSync('docs/FINAL-APP-REVIEW.md',report);console.log(JSON.stringify({files:rows.length,issues}));if(issues.length)process.exitCode=1;
