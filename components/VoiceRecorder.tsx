'use client';
import {useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronUp,Lock,Mic,Pause,Play,Send,Square,Trash2} from 'lucide-react';

type Phase='idle'|'starting'|'holding'|'locked'|'paused'|'finishing';
type Outcome='send'|'preview'|'discard';
type Capture={cancelled:boolean;mode:'holding'|'locked';recorder:MediaRecorder|null;stream:MediaStream|null;parts:Blob[];bytes:number;outcome:Outcome|null;elapsed:number;started:number;paused:boolean};
const clock=(seconds:number)=>Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');

export function VoiceRecorder({disabled=false,demo=false,maxSeconds=120,onComplete,onError,onActive}:{disabled?:boolean;demo?:boolean;maxSeconds?:number;onComplete:(file:File,sendNow:boolean)=>void|Promise<void>;onError:(message:string)=>void;onActive?:(active:boolean)=>void}){
 const [phase,setPhase]=useState<Phase>('idle'),[seconds,setSeconds]=useState(0),[movement,setMovement]=useState({x:0,y:0}),[preview,setPreview]=useState(''),[hint,setHint]=useState('');
 const capture=useRef<Capture|null>(null),origin=useRef<{x:number;y:number;id:number}|null>(null),alive=useRef(true),previewUrl=useRef(''),ticker=useRef<ReturnType<typeof setInterval>|null>(null),button=useRef<HTMLButtonElement>(null),pauseButton=useRef<HTMLButtonElement>(null),keyboardSession=useRef(false),restoreFocus=useRef(false);
 const callbacks=useRef({onComplete,onError,onActive});callbacks.current={onComplete,onError,onActive};
 const clearPreview=()=>{if(previewUrl.current){URL.revokeObjectURL(previewUrl.current);previewUrl.current=''}if(alive.current)setPreview('')};
 const duration=(s:Capture)=>s.elapsed+(s.paused?0:performance.now()-s.started);
 function release(s:Capture){s.stream?.getTracks().forEach(track=>track.stop());s.stream=null;if(ticker.current)clearInterval(ticker.current);ticker.current=null;origin.current=null;clearPreview()}
 function idle(s:Capture){release(s);if(capture.current!==s)return;capture.current=null;if(keyboardSession.current)restoreFocus.current=true;keyboardSession.current=false;if(alive.current){setPhase('idle');setMovement({x:0,y:0});callbacks.current.onActive?.(false)}}
 function finish(outcome:Outcome){const s=capture.current;if(!s||s.outcome)return;s.outcome=outcome;origin.current=null;if(!s.recorder){s.cancelled=true;idle(s);return}if(alive.current)setPhase('finishing');if(s.recorder.state!=='inactive')s.recorder.stop();else idle(s)}
 function pause(){const s=capture.current;if(!s?.recorder||s.outcome||s.paused||s.recorder.state!=='recording')return;s.elapsed=duration(s);s.paused=true;s.mode='locked';s.recorder.pause();s.recorder.requestData();setSeconds(Math.floor(s.elapsed/1000));setPhase('paused')}
 function resume(){const s=capture.current;if(!s?.recorder||s.outcome||!s.paused)return;clearPreview();s.paused=false;s.started=performance.now();s.recorder.resume();setPhase('locked')}
 async function start(mode:'holding'|'locked'){
  if(disabled||capture.current)return;keyboardSession.current=mode==='locked';
  const s:Capture={cancelled:false,mode,recorder:null,stream:null,parts:[],bytes:0,outcome:null,elapsed:0,started:0,paused:false};capture.current=s;setHint('');setSeconds(0);setMovement({x:0,y:0});setPhase('starting');callbacks.current.onActive?.(true);
  try{
   if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined')throw Error('Voice recording is unavailable in this browser. Attach an audio file instead.');
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});s.stream=stream;
   if(!alive.current||s.cancelled||capture.current!==s){stream.getTracks().forEach(t=>t.stop());return}
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg'].find(type=>MediaRecorder.isTypeSupported(type));const recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);s.recorder=recorder;
   recorder.ondataavailable=e=>{if(!e.data.size||s.cancelled)return;s.parts.push(e.data);s.bytes+=e.data.size;if(s.bytes>20*1024*1024){callbacks.current.onError('Voice notes must be under 20 MB.');finish('discard');return}if(s.paused&&!s.outcome&&alive.current){clearPreview();previewUrl.current=URL.createObjectURL(new Blob(s.parts,{type:recorder.mimeType||'audio/webm'}));setPreview(previewUrl.current)}};
   recorder.onstop=()=>{const elapsed=duration(s),outcome=s.outcome||'preview',type=(recorder.mimeType||'audio/webm').split(';')[0],blob=new Blob(s.parts,{type});idle(s);if(!alive.current||s.cancelled||outcome==='discard')return;if(!blob.size||elapsed<350){setHint('Hold the microphone longer to record a voice note.');return}const file=new File([blob],'Voice message.'+(type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm'),{type});void Promise.resolve(callbacks.current.onComplete(file,outcome==='send')).catch(e=>{if(alive.current)callbacks.current.onError(e instanceof Error?e.message:'Voice note could not be sent.')})};
   recorder.onerror=()=>{s.cancelled=true;if(recorder.state!=='inactive')recorder.stop();idle(s);if(alive.current)callbacks.current.onError('Recording was interrupted. Please try again or attach an audio file.')};
   s.started=performance.now();recorder.start(200);setPhase(s.mode);ticker.current=setInterval(()=>{if(capture.current!==s||s.outcome)return;const value=Math.floor(duration(s)/1000);setSeconds(value);if(value>=maxSeconds)finish('preview')},200);
  }catch(e){idle(s);if(alive.current&&!s.cancelled)callbacks.current.onError(e instanceof Error?e.message:'Microphone access was declined. Try again or attach an audio file.')}
 }
 function down(e:React.PointerEvent<HTMLButtonElement>){if(e.button!==0||disabled||capture.current)return;e.preventDefault();origin.current={x:e.clientX,y:e.clientY,id:e.pointerId};e.currentTarget.setPointerCapture?.(e.pointerId);void start('holding')}
 function move(e:React.PointerEvent<HTMLButtonElement>){const point=origin.current,s=capture.current;if(!point||point.id!==e.pointerId||!s||s.mode==='locked'||s.outcome)return;const x=Math.min(0,e.clientX-point.x),y=Math.min(0,e.clientY-point.y);setMovement({x:Math.max(-100,x),y:Math.max(-90,y)});if(x<=-85&&-x>=-y){finish('discard');setHint('Voice note cancelled.')}else if(y<=-65&&-y>-x){s.mode='locked';origin.current=null;setMovement({x:0,y:0});if(s.recorder)setPhase('locked')}}
 function up(e:React.PointerEvent<HTMLButtonElement>){const s=capture.current;if(!s||s.mode==='locked'||s.outcome)return;if(origin.current?.id!==e.pointerId)return;if(!s.recorder){finish('discard');setHint('Hold to record. Swipe up to keep recording.')}else finish('send')}
 useEffect(()=>{alive.current=true;const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&capture.current){e.preventDefault();restoreFocus.current=true;finish('discard')}};const visibility=()=>{if(!document.hidden)return;const s=capture.current;if(!s)return;if(s.mode==='holding')finish('discard');else if(s.recorder)pause();else finish('discard')};document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);return()=>{alive.current=false;document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);const s=capture.current;if(s){s.cancelled=true;if(s.recorder){s.recorder.onstop=null;s.recorder.ondataavailable=null;s.recorder.onerror=null;if(s.recorder.state!=='inactive')s.recorder.stop()}release(s);capture.current=null}}},[]);
 useEffect(()=>{if(phase==='locked'&&keyboardSession.current)pauseButton.current?.focus();if(phase==='idle'&&restoreFocus.current){restoreFocus.current=false;button.current?.focus()}},[phase]);
 const active=phase!=='idle',locked=capture.current?.mode==='locked',paused=phase==='paused';
 return <div className={'voice-control '+(active?'is-recording':'')+(locked?' is-locked':'')}>
  {hint&&!active&&<div className="voice-hint" role="status">{hint}</div>}
  {active&&<div className="voice-recording-panel" role="group" aria-label="Voice recording">
   <div className="voice-recording-status" role="status"><span className={paused?'voice-dot is-paused':'voice-dot'}/><time>{clock(seconds)}</time><span>{phase==='starting'?'Opening microphone…':phase==='finishing'?'Preparing voice note…':paused?'Paused':locked?'Recording locked':'Slide left to cancel'}</span>{!locked&&<ChevronLeft size={17}/>}</div>
   {paused&&preview&&<audio controls src={preview} aria-label="Preview voice recording"/>}
   {locked&&<div className="voice-locked-actions"><button type="button" className="icon-button" aria-label="Discard voice recording" onClick={()=>finish('discard')}><Trash2 size={21}/></button><button type="button" ref={pauseButton} className="icon-button" aria-label={paused?'Resume voice recording':'Pause voice recording'} disabled={phase==='starting'||phase==='finishing'} onClick={paused?resume:pause}>{paused?<Mic size={23}/>:<Pause size={23}/>}</button><button type="button" className="voice-preview-stop" disabled={phase==='starting'||phase==='finishing'} onClick={()=>finish('preview')}><Square size={16}/>Stop & preview</button><button type="button" className="chat-round-action" aria-label="Send voice recording" disabled={phase==='starting'||phase==='finishing'} onClick={()=>finish('send')}><Send size={22}/></button></div>}
  </div>}
  {active&&!locked&&<div className="voice-lock-target" aria-label="Swipe up to lock recording" style={{transform:`translateY(${movement.y/3}px)`,opacity:.7+Math.abs(movement.y)/300}}><Lock size={20}/><ChevronUp size={18}/></div>}
  <button ref={button} type="button" className="chat-round-action chat-mic" aria-label={demo?'Record demo voice':'Record voice message'} aria-describedby="voice-gesture-help" disabled={disabled&& !active||phase==='finishing'} style={!locked?{transform:`translate(${movement.x/2}px,${movement.y/3}px)`}:undefined} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{if(capture.current?.mode==='holding')finish('discard')}} onLostPointerCapture={()=>{if(capture.current?.mode==='holding')finish('discard')}} onContextMenu={e=>e.preventDefault()} onClick={e=>{if(e.detail===0&&!capture.current)void start('locked')}}><Mic size={24}/><span className="sr-only">Record voice</span></button>
  <span id="voice-gesture-help" className="sr-only">Hold to record, slide left to cancel, or swipe up to lock. Activate with the keyboard to record hands-free.</span>
 </div>;
}
