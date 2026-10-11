'use client';
import {useEffect,useState} from 'react';
import {WifiOff} from 'lucide-react';
export function ConnectionStatus(){const [offline,setOffline]=useState(false);useEffect(()=>{const update=()=>setOffline(!navigator.onLine);update();window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);return offline?<div className="connection-banner" role="status"><WifiOff size={18}/><span>You’re offline. Reconnect before saving changes or sending messages.</span></div>:null}
