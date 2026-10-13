'use client';
import {useEffect,useRef,useState} from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
import {appearanceKey,applyAppearance,readAppearance,normalizeAppearance,type Appearance} from '@/lib/appearance';
export function AppearanceControl(){const [value,setValue]=useState<Appearance>('system');const selectedPreference=useRef<Appearance>('system');useEffect(()=>{const media=window.matchMedia?.('(prefers-color-scheme: dark)');const refresh=()=>{setValue(selectedPreference.current);applyAppearance(selectedPreference.current,!!media?.matches)};selectedPreference.current=readAppearance();refresh();const storage=(e:StorageEvent)=>{if(e.key===appearanceKey||e.key===null){selectedPreference.current=readAppearance();refresh()}};media?.addEventListener('change',refresh);window.addEventListener('storage',storage);return()=>{media?.removeEventListener('change',refresh);window.removeEventListener('storage',storage)}},[]);
 const Icon=value==='dark'?Moon:value==='light'?Sun:Monitor;
 return <label className="appearance-control" title={'Appearance: '+value}><Icon size={18} aria-hidden="true"/><span className="sr-only">Appearance</span><select aria-label="Appearance" value={value} onChange={e=>{const selected=normalizeAppearance(e.target.value);selectedPreference.current=selected;setValue(selected);applyAppearance(selected,!!window.matchMedia?.('(prefers-color-scheme: dark)').matches);try{localStorage.setItem(appearanceKey,selected)}catch{}}}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
}
