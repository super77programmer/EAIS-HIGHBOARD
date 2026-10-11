'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {VoiceRecorder} from './VoiceRecorder';
import {Camera,FileText,Image,Paperclip,Send,Smile,X} from 'lucide-react';

export type ChatFileKind='document'|'media'|'camera';
export function pickChatFile(input:HTMLInputElement|null,kind:ChatFileKind,demo=false){
 if(!input)return;
 input.accept=kind==='document'?'.pdf,.docx,.xlsx,.pptx,audio/*'+(demo?',.txt':''):kind==='camera'?'image/jpeg,image/png':'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime';
 if(kind==='camera')input.setAttribute('capture','environment');else input.removeAttribute('capture');
 input.click();
}

export function ChatComposer({children,hasContent,disabled=false,busy=false,onEmoji,onPick,voice,demo=false}:{children:ReactNode;hasContent:boolean;disabled?:boolean;busy?:boolean;onEmoji:(emoji:string)=>void;onPick?:(kind:ChatFileKind)=>void;voice?:{onComplete:(file:File,sendNow:boolean)=>void|Promise<void>;onError:(message:string)=>void;onActive?:(active:boolean)=>void;maxSeconds?:number};demo?:boolean}){
 const [voiceActive,setVoiceActive]=useState(false);const [panel,setPanel]=useState<'emoji'|'attachments'|null>(null),frame=useRef<HTMLDivElement>(null),emojiButton=useRef<HTMLButtonElement>(null),attachButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!panel)return;const close=(e:Event)=>{if(e.type==='keydown'&&(e as KeyboardEvent).key==='Escape'){setPanel(null);(panel==='emoji'?emojiButton:attachButton).current?.focus()}else if(e.type==='pointerdown'&&!frame.current?.contains(e.target as Node))setPanel(null)};document.addEventListener('pointerdown',close);document.addEventListener('keydown',close);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',close)}},[panel]);
 useEffect(()=>{if(disabled)setPanel(null)},[disabled]);
 const choose=(kind:ChatFileKind)=>{setPanel(null);onPick?.(kind)};
 return <div ref={frame} className={'chat-compose '+(voiceActive?'voice-active':'')}>
  {panel==='emoji'&&<div className="emoji-picker" aria-label="Choose an emoji">{['😊','👍','🙏','🎉','✅','❤️','🤔','👋'].map(emoji=><button type="button" key={emoji} aria-label={'Insert '+emoji} onClick={()=>{onEmoji(emoji);setPanel(null);frame.current?.querySelector('textarea')?.focus()}}>{emoji}</button>)}<button className="emoji-close" type="button" aria-label={demo?'Close demo emoji picker':'Close emoji picker'} onClick={()=>{setPanel(null);emojiButton.current?.focus()}}><X size={16}/></button></div>}
  {panel==='attachments'&&<div className="chat-attachment-menu" role="group" aria-label="Choose attachment type"><div><strong>Share in this chat</strong><button type="button" className="icon-button" aria-label="Close attachment menu" onClick={()=>{setPanel(null);attachButton.current?.focus()}}><X size={18}/></button></div><div>{([{kind:'document',label:'Document',Icon:FileText},{kind:'media',label:'Photos & videos',Icon:Image},{kind:'camera',label:'Camera',Icon:Camera}] as const).map(({kind,label,Icon})=><button type="button" key={kind} onClick={()=>choose(kind)}><span><Icon size={24}/></span>{label}</button>)}</div></div>}
  <div className="chat-composer-row"><div className="chat-input-pill">
   <button ref={emojiButton} type="button" className="icon-button emoji-toggle" aria-label={demo?'Choose demo emoji':'Choose emoji'} aria-expanded={panel==='emoji'} disabled={disabled} onClick={()=>setPanel(panel==='emoji'?null:'emoji')}><Smile size={23}/></button>
   {children}
   {onPick&&<><button ref={attachButton} type="button" className="icon-button chat-attach" aria-label={demo?'Attach demo file':'Attach a file'} aria-expanded={panel==='attachments'} disabled={disabled} onClick={()=>setPanel(panel==='attachments'?null:'attachments')}><Paperclip size={22}/></button><button type="button" className="icon-button chat-camera" aria-label={demo?'Take demo photo':'Take a photo'} disabled={disabled} onClick={()=>choose('camera')}><Camera size={23}/></button></>}
  </div>
  {hasContent||!voice?<button type="submit" className="chat-round-action chat-send" aria-label={busy?'Sending message':demo?'Send demo message':'Send message'} disabled={disabled||!hasContent}><Send size={22}/><span className="sr-only">{busy?'Sending…':'Send'}</span></button>:<VoiceRecorder {...voice} demo={demo} disabled={disabled} onActive={active=>{setVoiceActive(active);if(active)frame.current?.querySelector('textarea')?.blur();voice.onActive?.(active)}}/>}
  </div>
 </div>;
}
