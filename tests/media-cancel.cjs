const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),Module=require('node:module');
const moduleUnderTest=new Module(__filename);moduleUnderTest._compile(ts.transpileModule(fs.readFileSync('lib/media-client.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,__filename);
const {uploadMedia}=moduleUnderTest.exports;
(async()=>{
 const controller=new AbortController(),calls=[],progress=[];
 global.fetch=async(url,options)=>{calls.push(url);if(url.includes('action=begin'))return Response.json({id:'upload',chunkSize:8*1024*1024});if(url.includes('action=part')){controller.abort();throw new DOMException('Cancelled','AbortError')}assert.ok(url.includes('action=abort'));assert.equal(options.signal.aborted,false,'Cleanup must survive user cancellation');return Response.json({ok:true})};
 await assert.rejects(uploadMedia(new File([new Uint8Array(25*1024*1024)],'lesson.mp4',{type:'video/mp4'}),'thread',n=>progress.push(n),controller.signal),{name:'AbortError'});
 assert.equal(calls.filter(x=>x.includes('action=part')).length,1);assert.equal(calls.filter(x=>x.includes('action=abort')).length,1);assert.equal(calls.some(x=>x.includes('action=complete')),false);
 const retryCalls=[];let first=true;
 global.fetch=async(url)=>{retryCalls.push(url);if(url.includes('action=begin'))return Response.json({id:'success',chunkSize:8*1024*1024});if(url.includes('part=1')&&first){first=false;throw Error('Temporary connection failure')}return Response.json(url.includes('action=complete')?{id:'attachment'}:{ok:true})};
 const result=await uploadMedia(new File([new Uint8Array(9*1024*1024)],'lesson.mp4',{type:'video/mp4'}),'thread',n=>progress.push(n));assert.equal(result.id,'attachment');assert.equal(retryCalls.filter(x=>x.includes('part=1')).length,2);assert.equal(progress.at(-1),100);assert.equal(progress.at(-2),99);
 console.log('PASS: cancellation stops retries and completion, abort cleanup survives cancellation, failed parts retry, progress reaches 100 only after finalization.');
})().catch(e=>{console.error(e);process.exitCode=1});
