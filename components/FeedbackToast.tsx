'use client';
import {useEffect,useRef,useState} from 'react';
import {AlertCircle,CheckCircle2,Info,X} from 'lucide-react';
export type FeedbackKind='success'|'warning'|'error';
export function FeedbackToast({message,kind='success',onDismiss}:{message:string;kind?:FeedbackKind;onDismiss:()=>void}){
 const [hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[hidden,setHidden]=useState(false);const close=useRef(onDismiss);close.current=onDismiss;
 useEffect(()=>{const visibility=()=>setHidden(document.hidden);visibility();document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility)},[]);
 useEffect(()=>{if(kind==='error'||hovered||focused||hidden)return;const timer=setTimeout(()=>close.current(),kind==='warning'?10000:6000);return()=>clearTimeout(timer)},[message,kind,hovered,focused,hidden]);
 const Icon=kind==='error'?AlertCircle:kind==='warning'?Info:CheckCircle2;
 return <div className={'toast feedback-toast toast-'+kind} role={kind==='error'?'alert':'status'} aria-atomic="true" onPointerEnter={()=>setHovered(true)} onPointerLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setFocused(false)}}><Icon size={19} aria-hidden="true"/><span>{message}</span><button type="button" className="icon-button" onClick={onDismiss} aria-label="Dismiss notification"><X size={17}/></button></div>;
}
