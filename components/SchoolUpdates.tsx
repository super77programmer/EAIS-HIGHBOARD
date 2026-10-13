'use client';
import {readJSON} from '@/lib/http';
import {useEffect,useRef,useState} from 'react';
import {ChevronDown,Megaphone,Pin,Search} from 'lucide-react';
import {communityFetch} from '@/lib/community-client';
import type {Item} from '@/lib/board';
export type SchoolUpdate=Item&{effective?:string;expiry?:string;pinned?:boolean;updated?:number};
const EMPTY:SchoolUpdate[]=[];
const revision=(item:SchoolUpdate)=>JSON.stringify([item.title,item.description,item.effective,item.updated]);
const dateLabel=(value:string)=>new Date(value+'T12:00:00Z').toLocaleDateString('en-GB',{timeZone:'Africa/Cairo',day:'numeric',month:'short'});
export function SchoolUpdates({items=EMPTY,profileKey,loading=false,limit=3}:{items?:SchoolUpdate[];profileKey:string;loading?:boolean;limit?:number}) {
 const [community,setCommunity]=useState<SchoolUpdate[]>([]),[ready,setReady]=useState(false),[error,setError]=useState(''),[query,setQuery]=useState(''),[all,setAll]=useState(false),[seen,setSeen]=useState<Record<string,string>>({}),[prioritySeen,setPrioritySeen]=useState<Record<string,string>>({});
 const epoch=useRef(0),storageKey='hb-announcements-v1:'+profileKey;
 useEffect(()=>{
  let live=true;
  try{const stored=JSON.parse(localStorage.getItem(storageKey)||'{}');const valid=stored&&typeof stored==='object'&&!Array.isArray(stored)?stored:{};setSeen(valid);setPrioritySeen(valid)}catch{setSeen({});setPrioritySeen({})}
  async function load(){const request=++epoch.current;try{const r=await communityFetch('/api/community');if(!r.ok)throw Error('School updates could not refresh.');const data=await readJSON(r) as {announcements?:SchoolUpdate[]};if(live&&request===epoch.current){setCommunity(data.announcements||[]);setError('');setReady(true)}}catch{if(live&&request===epoch.current){setError('School updates could not refresh.');setReady(true)}}}
  const refresh=()=>{setCommunity([]);setReady(false);load()};
  load();const timer=setInterval(()=>{if(!document.hidden)load()},30000);
  window.addEventListener('hb-inbox-updated',refresh);window.addEventListener('hb-board-updated',load);
  return()=>{live=false;epoch.current++;clearInterval(timer);window.removeEventListener('hb-inbox-updated',refresh);window.removeEventListener('hb-board-updated',load)};
 },[storageKey]);
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});
 const updates=[...new Map([...items,...community].map(i=>[i.id,i])).values()].filter(i=>(!i.effective||i.effective<=today)&&(!i.expiry||i.expiry>=today)).sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned)||Number(prioritySeen[a.id]===revision(a))-Number(prioritySeen[b.id]===revision(b))||(b.updated||Date.parse(b.effective||'')||0)-(a.updated||Date.parse(a.effective||'')||0));
 const unread=updates.filter(i=>seen[i.id]!==revision(i)).length;
 const matches=updates.filter(i=>(i.title+' '+(i.description||'')).toLowerCase().includes(query.trim().toLowerCase()));
 function read(item:SchoolUpdate){setSeen(previous=>{const next={...previous,[item.id]:revision(item)};const entries=Object.entries(next).slice(-250);try{localStorage.setItem(storageKey,JSON.stringify(Object.fromEntries(entries)))}catch{}return next})}
 return <section className="daily-school-updates school-bulletin" data-home-section="announcements" id="home-announcements" aria-labelledby="school-updates-title">
  <div className="daily-section-heading"><div className="bulletin-title"><span className="bulletin-symbol"><Megaphone size={21}/></span><div><h2 id="school-updates-title">School announcements</h2><p>What’s new for your school day</p></div></div>{unread>0&&<span className="update-count">{unread} new</span>}</div>
  {updates.length>limit&&<label className="update-search"><Search size={17}/><input type="search" aria-label="Search announcements" placeholder="Find an announcement" value={query} onChange={e=>{setQuery(e.target.value);setAll(true)}}/></label>}
  <div className="home-announcement-list">{(all||query?matches:matches.slice(0,limit)).map(item=><details className={'home-announcement '+(seen[item.id]!==revision(item)?'is-new':'')} key={item.id} onToggle={e=>{if(e.currentTarget.open)read(item)}}><summary><span className="announcement-avatar" aria-hidden="true">{item.pinned?<Pin size={18}/>:<Megaphone size={18}/>}</span><span className="announcement-copy"><small>{item.author||'High Board'}{item.effective?' · '+dateLabel(item.effective):''}{item.sample?' · Sample':''}</small><b dir="auto">{item.title}</b><span className="announcement-excerpt" dir="auto">{item.description}</span><span className="announcement-open-label">Read update <ChevronDown size={14}/></span></span>{seen[item.id]!==revision(item)&&<span className="new-update-dot" aria-label="New announcement"/>}</summary><p dir="auto">{item.description||'No additional details.'}</p></details>)}</div>
  {(loading||!ready)&&!updates.length&&!error&&<div className="bulletin-loading" role="status"><span/><span/><span/><small>Loading school announcements…</small></div>}
  {!loading&&ready&&!updates.length&&!error&&<div className="bulletin-empty"><Megaphone size={24}/><div><h3>No announcements yet</h3><p>School and class updates will appear here when published.</p></div></div>}
  {query&&!matches.length&&<p className="home-empty-note">No announcements match “{query}”. Try another search.</p>}
  {error&&<p className="comm-error" role="alert">{error} <button className="text-button" onClick={()=>window.dispatchEvent(new Event('hb-board-updated'))}>Retry</button></p>}
  {matches.length>limit&&!query&&<button className="bulletin-more" aria-expanded={all} onClick={()=>setAll(v=>!v)}>{all?'Show fewer updates':`View all ${matches.length} announcements`}<ChevronDown size={16}/></button>}
 </section>;
}
