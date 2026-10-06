'use client';
import {useEffect,useRef,useState} from 'react';
import {MessageSquare,Search,Lock,Check,CheckCheck,CheckCircle2,FileText,Mic,Paperclip,Send,Square,Trash2,X} from 'lucide-react';
import {prohibited} from '@/lib/moderation';

type Role='student'|'teacher';
type Attachment={url:string;name:string;type:string;size:number};
type Message={id:number;role:Role;body:string;created:number;read:boolean;attachment?:Attachment};
const names:Record<Role,string>={student:'Ahmed · Student',teacher:'Mr. Karim · Teacher'};
const initial=():Message[]=>[{id:0,role:'teacher',body:'Hello Ahmed! You can send your question or share your proposal here. How can I help?',created:Date.now(),read:true}];
const size=(n:number)=>n>1024*1024?(n/1024/1024).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';

export function TeacherChatDemo(){
 const [role,setRole]=useState<Role>('student'),[messages,setMessages]=useState<Message[]>(initial),[drafts,setDrafts]=useState({student:'',teacher:''}),[pending,setPending]=useState<Partial<Record<Role,Attachment>>>({}),[error,setError]=useState(''),[recording,setRecording]=useState(false),[seconds,setSeconds]=useState(0),[starting,setStarting]=useState(false);
 const history=useRef<HTMLDivElement>(null),file=useRef<HTMLInputElement>(null),urls=useRef(new Set<string>()),nextId=useRef(1),recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),alive=useRef(true),timer=useRef<ReturnType<typeof setInterval>|null>(null),totalBytes=useRef(0),recordBytes=useRef(0);
 const draft=drafts[role],attachment=pending[role],full=messages.length>=100;
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;if(timer.current)clearInterval(timer.current);if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());urls.current.forEach(u=>URL.revokeObjectURL(u))}},[]);
 useEffect(()=>{if(history.current)history.current.scrollTop=history.current.scrollHeight},[messages,role]);
 function removePending(forRole:Role){const old=pending[forRole];if(old){URL.revokeObjectURL(old.url);urls.current.delete(old.url);totalBytes.current-=old.size}setPending(p=>({...p,[forRole]:undefined}))}
 function addAttachment(blob:Blob,name:string,forRole:Role){
  const previous=pending[forRole];if(blob.size>20*1024*1024||totalBytes.current-(previous?.size||0)+blob.size>50*1024*1024){setError('Use a file under 20 MB. Reset the demo if its 50 MB preview limit is full.');return}
  if(prohibited(name)){setError('Please use a respectful file name.');return}
  if(previous){URL.revokeObjectURL(previous.url);urls.current.delete(previous.url);totalBytes.current-=previous.size}
  const url=URL.createObjectURL(blob);urls.current.add(url);totalBytes.current+=blob.size;setPending(p=>({...p,[forRole]:{url,name,type:blob.type,size:blob.size}}));setError('');
 }
 function selectFile(f?:File){if(!f)return;const ext=f.name.split('.').pop()?.toLowerCase();if(!ext||!['jpg','jpeg','png','webp','gif','mp4','webm','mov','mp3','m4a','ogg','wav','pdf','docx','xlsx','pptx','txt'].includes(ext)){setError('Choose an image, video, audio clip, PDF, Office document or text file.');return}addAttachment(f,f.name,role)}
 function send(text=draft){const body=text.trim();if(full||recording||starting||(!body&&!attachment))return;if(prohibited(body)){setError('Please rephrase your message using respectful language.');return}setMessages(m=>[...m,{id:nextId.current++,role,body,attachment,created:Date.now(),read:false}]);setDrafts(d=>({...d,[role]:''}));setPending(p=>({...p,[role]:undefined}));setError('')}
 function switchRole(next:Role){if(recording||starting)return;setRole(next);setMessages(m=>m.map(message=>message.role!==next?{...message,read:true}:message));setError('')}
 async function startRecording(){
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError('Recording is unavailable in this browser. Attach an audio file instead.');return}
  setStarting(true);setError('');try{const audio=await navigator.mediaDevices.getUserMedia({audio:true});if(!alive.current){audio.getTracks().forEach(t=>t.stop());return}stream.current=audio;
   const mime=['audio/webm','audio/mp4','audio/ogg'].find(t=>MediaRecorder.isTypeSupported(t));const media=new MediaRecorder(audio,mime?{mimeType:mime}:undefined);recorder.current=media;const chunks:Blob[]=[];recordBytes.current=0;const recordingRole=role;
   media.ondataavailable=e=>{if(e.data.size){chunks.push(e.data);recordBytes.current+=e.data.size;if(recordBytes.current>20*1024*1024&&media.state==='recording')media.stop()}};
   media.onstop=()=>{audio.getTracks().forEach(t=>t.stop());stream.current=null;if(timer.current)clearInterval(timer.current);timer.current=null;if(!alive.current)return;setRecording(false);const blob=new Blob(chunks,{type:media.mimeType||'audio/webm'});if(blob.size)addAttachment(blob,'Voice message.'+(blob.type.includes('mp4')?'m4a':blob.type.includes('ogg')?'ogg':'webm'),recordingRole)};
   media.onerror=()=>{audio.getTracks().forEach(t=>t.stop());if(timer.current)clearInterval(timer.current);if(alive.current){setRecording(false);setError('Recording failed. Try attaching an audio file.')}};
   media.start(250);setSeconds(0);setRecording(true);let elapsed=0;timer.current=setInterval(()=>{elapsed++;setSeconds(elapsed);if(elapsed>=60&&media.state==='recording')media.stop()},1000);
  }catch{stream.current?.getTracks().forEach(t=>t.stop());setError('Microphone access was unavailable or declined. You can attach an audio file instead.')}finally{if(alive.current)setStarting(false)}
 }
 function reset(){if(recording||starting)return;urls.current.forEach(u=>URL.revokeObjectURL(u));urls.current.clear();totalBytes.current=0;setPending({});setDrafts({student:'',teacher:''});setMessages(initial());setRole('student');setError('');nextId.current=1}
 function preview(a:Attachment){return <div className="demo-attachment">{a.type.startsWith('image/')&&a.type!=='image/svg+xml'?<img src={a.url} alt={a.name}/>:a.type.startsWith('video/')?<video src={a.url} controls preload="metadata"/>:a.type.startsWith('audio/')?<audio src={a.url} controls preload="metadata"/>:<div className="demo-file"><FileText size={24}/><span>{a.name}</span></div>}<small>{a.name} · {size(a.size)} · Local preview</small></div>}
 return <section className="chat-demo two-sided-demo" aria-label="Teacher chat demo">
  <aside className="demo-inbox"><span className="eyebrow">EAIS MESSAGES</span><h2>Your inbox</h2><div className="demo-inbox-search"><Search size={17}/><span>Find a conversation</span></div><span className="demo-inbox-label">EXAMPLE CONVERSATION</span><div className="demo-inbox-thread"><span className="demo-avatar teacher">K</span><div><b>Mr. Karim</b><small>Try asking your first question</small></div></div><div className="demo-inbox-bottom"><Lock size={18}/><p>Your real inbox will show teachers assigned to your class after school sign-in is set up.</p></div></aside><div className="demo-main">
  <div className="demo-top"><div><h3>Mr. Karim <CheckCircle2 size={18}/></h3><p>Ahmed and Mr. Karim · Example participants</p></div><span className="pill amber">DEMO</span></div>
  <p className="demo-disclaimer">Demo only · Switch sides to reply. Nothing is sent or saved.</p>
  <div className="demo-role-switch" aria-label="Demo sender">{(['student','teacher'] as Role[]).map(r=><button key={r} aria-pressed={role===r} disabled={recording||starting} onClick={()=>switchRole(r)}>{r==='student'?'Student view':'Teacher view'}{messages.some(m=>m.role!==r&&!m.read)&&<span className="demo-unread" aria-label="Unread demo messages">{messages.filter(m=>m.role!==r&&!m.read).length}</span>}</button>)}</div>
  <div className="demo-perspective"><span className={'demo-avatar '+role}>{role==='student'?'A':'K'}</span><div><strong>Sending as {names[role]}</strong><small>To {names[role==='student'?'teacher':'student']} · Simulated conversation</small></div></div>
  <div ref={history} className="demo-messages" role="log" aria-label="Demo messages" aria-live="polite">{messages.map(m=><div key={m.id} className={'demo-bubble '+(m.role===role?'mine':'')}><small>{names[m.role]}</small>{m.body&&<span dir="auto">{m.body}</span>}{m.attachment&&preview(m.attachment)}<div className="demo-message-meta"><time>{new Date(m.created).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</time>{m.role===role&&<span>{m.read?<CheckCheck size={14}/>:<Check size={14}/>} {m.read?'Read in demo':'Sent in demo'}</span>}</div></div>)}</div>

  {attachment&&<div className="demo-pending">{preview(attachment)}<button className="icon-button" aria-label="Remove demo attachment" disabled={recording||starting} onClick={()=>removePending(role)}><X size={18}/></button></div>}
  {error&&<p className="comm-error" role="alert">{error}</p>}
  <form className="demo-composer" onSubmit={e=>{e.preventDefault();send()}}><label className="sr-only" htmlFor="demo-message">Try a demo message</label><input id="demo-message" value={draft} maxLength={2000} disabled={full} onChange={e=>setDrafts(d=>({...d,[role]:e.target.value}))} placeholder={role==='student'?'Ask your teacher…':'Reply to Ahmed…'} autoComplete="off"/><button type="submit" className="primary" aria-label="Send demo message" disabled={(!draft.trim()&&!attachment)||full||recording||starting}><Send size={18}/></button></form>
  <div className="demo-tools"><input ref={file} type="file" className="sr-only" tabIndex={-1} aria-label="Choose demo attachment" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,audio/*,.pdf,.docx,.xlsx,.pptx,.txt" onChange={e=>{selectFile(e.target.files?.[0]);e.target.value=''}}/><button className="text-button" disabled={recording||starting||full} onClick={()=>file.current?.click()}><Paperclip size={17}/>Attach file</button><button className="text-button" disabled={starting||full} onClick={()=>recording?recorder.current?.stop():startRecording()}>{recording?<Square size={17}/>:<Mic size={17}/>} {recording?`Stop · ${seconds}s`:starting?'Opening microphone…':'Record voice'}</button></div>
  <details className="demo-help"><summary>Demo details & reset</summary><div className="demo-footer"><small>{full?'Demo full. Reset to continue.':'Text is filtered in English, Arabic and Franco. Media content is not filtered. Voice clips stop after 60 seconds.'}</small><button className="text-button" disabled={recording||starting} onClick={reset}><Trash2 size={15}/>Reset demo</button></div></details>
 </div></section>
}
