'use client';
const frames=new Map<symbol,boolean>(),listeners=new Set<()=>void>();
export const messengerSnapshot=()=>frames.size?[...frames.values()].some(Boolean)?'thread':'inbox':'none';
export function setMessengerPresence(key:symbol,active:boolean|undefined){if(active===undefined)frames.delete(key);else frames.set(key,active);const state=messengerSnapshot();if(typeof document!=='undefined'){if(state==='none')delete document.body.dataset.messenger;else document.body.dataset.messenger=state}listeners.forEach(f=>f())}
export function subscribeMessenger(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener)}}
