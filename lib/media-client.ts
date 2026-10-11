export async function uploadMedia(file:File,thread:string,onProgress:(n:number)=>void,signal?:AbortSignal){
 async function request(url:string,body:BodyInit,type='application/json',cancellable=true){
  if(cancellable)signal?.throwIfAborted();
  const timeout=AbortSignal.timeout(120000);
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':type},body,signal:cancellable&&signal?AbortSignal.any([signal,timeout]):timeout});
  const j:any=await r.json();if(!r.ok)throw Error(j.error||'Upload failed.');return j;
 }
 const session=await request('/api/media-upload?action=begin',JSON.stringify({name:file.name,mime:file.type,size:file.size,thread}));
 const base='/api/media-upload?id='+encodeURIComponent(session.id);
 try{const count=Math.ceil(file.size/session.chunkSize);for(let part=1;part<=count;part++){
  signal?.throwIfAborted();const body=file.slice((part-1)*session.chunkSize,part*session.chunkSize);let sent=false,error:unknown;
  for(let attempt=0;attempt<3&&!sent;attempt++){signal?.throwIfAborted();try{await request(base+'&action=part&part='+part,body,'application/octet-stream');sent=true}catch(e){if(signal?.aborted)throw e;error=e}}
  if(!sent)throw error;onProgress(Math.min(99,Math.round(part/count*100)));
 }signal?.throwIfAborted();const result=await request(base+'&action=complete','{}');onProgress(100);return result;
 }catch(e){try{await request(base+'&action=abort','{}','application/json',false)}catch{}throw e}
}
