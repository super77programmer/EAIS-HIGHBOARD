'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Star, Shield, Check, Users } from 'lucide-react';
import { useMotion } from '@/lib/motion';
import {communityFetch} from '@/lib/community-client';
import { GoogleAccess } from '@/components/Community';
import { logoPaths } from '@/lib/logo-paths';
export function LogoHero({onEnter}:{onEnter:()=>void}) {
  const root=useRef<HTMLElement>(null);
  const {runtime}=useMotion();const enter=useRef(onEnter);enter.current=onEnter;
  const finished=useRef(false);
  const finish=useCallback(()=>{if(!finished.current){finished.current=true;enter.current()}},[]);
  useEffect(()=>{
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';root.current?.focus({preventScroll:true});
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>{if(media.matches)finish()};change();media.addEventListener('change',change);
    const timeout=setTimeout(finish,5000);
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape')finish();if(event.key==='Tab'){event.preventDefault();root.current?.focus()}};
    document.addEventListener('keydown',key);
    return()=>{clearTimeout(timeout);media.removeEventListener('change',change);document.removeEventListener('keydown',key);document.body.style.overflow=previous};
  },[finish]);
  useLayoutEffect(()=>{
    if(!runtime||!root.current||finished.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const {gsap}=runtime;
    const ctx=gsap.context(()=>{
      const paths=gsap.utils.toArray('.intro-logo-path') as SVGPathElement[];
      paths.forEach((path,i)=>{const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length,fillOpacity:0,x:(i-1)*28,y:i===1?22:-12,rotation:(i-1)*8,transformOrigin:'50% 50%'});});
      gsap.set('.intro-content',{visibility:'visible'});
      gsap.timeline({onComplete:finish})
        .from('.intro-kicker',{autoAlpha:0,y:12,duration:.4},0)
        .from('.intro-logo',{scale:.82,autoAlpha:0,duration:.65,ease:'power3.out'},.1)
        .to(paths,{strokeDashoffset:0,x:0,y:0,rotation:0,duration:1.15,stagger:.12,ease:'power3.out'},.15)
        .to(paths,{fillOpacity:1,strokeWidth:0,duration:.5,stagger:.06},.9)
        .from('.intro-title span',{autoAlpha:0,y:24,stagger:.12,duration:.65,ease:'power3.out'},1.1)
        .from('.intro-school',{autoAlpha:0,y:10,duration:.4},1.6)
        .fromTo('.intro-progress span',{scaleX:0},{scaleX:1,duration:2.25,ease:'power1.inOut'},0)
        .to('.intro-content',{y:-24,scale:1.04,autoAlpha:0,duration:.45,ease:'power2.in'},2.55)
        .to(root.current,{clipPath:'inset(0 0 100% 0)',duration:.65,ease:'power4.inOut'},2.75);
    },root);
    return()=>ctx.revert();
  },[runtime,finish]);
  return <section id="hero" className="logo-intro" ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Welcome to EAIS High Board"><div className="intro-content" style={{visibility:'hidden'}}><p className="intro-kicker">EAIS · NEW CAIRO</p><svg className="intro-logo" viewBox="-18 -15 194 109" role="img" aria-label="EAIS school logo"><defs><linearGradient id="intro-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff5e7e"/><stop offset="1" stopColor="#ffad57"/></linearGradient></defs>{logoPaths.map((d,i)=><path key={i} className="intro-logo-path" d={d} fill="url(#intro-gradient)" stroke="#ff8d92" strokeWidth=".8"/>)}</svg><h1 className="intro-title"><span>YOUR SCHOOL.</span><span>YOUR HIGH BOARD.</span></h1><p className="intro-school">Egyptian American International School</p><div className="intro-progress" aria-hidden="true"><span/></div></div></section>;
}
export function MotionLayer({view,revision}:{view:string;revision:string}) {
  const {runtime,reduced}=useMotion();const revealed=useRef(new WeakSet<HTMLElement>());
  useEffect(()=>{if(!runtime||reduced)return;const {gsap}=runtime;const ctx=gsap.context(()=>{document.querySelectorAll<HTMLElement>('.feed-section').forEach(section=>{const cards=Array.from(section.querySelectorAll<HTMLElement>('.feed-card')).filter(card=>!card.parentElement?.closest('.feed-card')&&!revealed.current.has(card));cards.forEach((card,i)=>{revealed.current.add(card);gsap.from(card,{y:10,opacity:0,duration:.24,delay:Math.min(i,2)*.035,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 95%',once:true}})})})});return()=>ctx.revert()},[runtime,reduced,view,revision]);
  return null;
}
export function AnimatedProgress({width}:{width:number}) {
  const el=useRef<HTMLSpanElement>(null);const initial=useRef(width);const {runtime,reduced}=useMotion();
  useEffect(()=>{if(!el.current)return;if(!runtime||reduced){el.current.style.width=width+'%';return}const tween=runtime.gsap.to(el.current,{width:width+'%',duration:.3,ease:'power2.out',overwrite:true});return()=>tween.kill()},[width,runtime,reduced]);
  return <span ref={el} className="poll-fill progress-bar" style={{width:initial.current+'%'}}/>;
}
export function RatingStars({value,busy,onRate}:{value:number;busy:boolean;onRate:(n:number)=>void}) {
  const [hover,setHover]=useState(0);const ref=useRef<HTMLDivElement>(null);const {runtime,reduced}=useMotion();const shown=hover||value;
  useEffect(()=>{const fills=ref.current?.querySelectorAll<HTMLElement>('.rating-fill');if(!fills)return;const tweens:any[]=[];fills.forEach((fill,i)=>{const width=shown>i?'100%':'0%';if(!runtime||reduced)fill.style.width=width;else tweens.push(runtime.gsap.to(fill,{width,duration:.2,ease:'power2.out',overwrite:true}))});return()=>tweens.forEach(t=>t.kill())},[shown,runtime,reduced]);
  return <div ref={ref} className="stars" onMouseLeave={()=>setHover(0)} aria-label="Rate today’s lunch">{[1,2,3,4,5].map(n=><button key={n} className={'rating-star '+(value===n?'rated':'')} type="button" aria-label={`Rate lunch ${n} out of 5`} aria-pressed={value===n} disabled={busy} onMouseEnter={()=>setHover(n)} onFocus={()=>setHover(n)} onBlur={()=>setHover(0)} onClick={()=>onRate(n)}><span className="star-art"><Star className="star-outline" size={26}/><span className="rating-fill"><Star size={26} fill="currentColor"/></span></span></button>)}</div>;
}
type Profile={student_id:string;grade:number;class_section:string;nickname:string;school_email?:string;onboarding_version?:number};
export function ProfileSetup({profile,onSave}:{profile:Profile|null;onSave:(profile:Profile)=>void}) {
 const [step,setStep]=useState(0),[grade,setGrade]=useState(profile?.grade||8),[section,setSection]=useState(profile?.class_section.replace(String(profile.grade),'')||'A'),[name,setName]=useState(profile?.nickname||''),[account,setAccount]=useState<any>(null),[accountError,setAccountError]=useState('');
 const heading=useRef<HTMLHeadingElement>(null);
 const refresh=useCallback(async()=>{try{const r=await communityFetch('/api/community',true);if(!r.ok)throw Error('School account status is temporarily unavailable.');return await r.json() as any}catch(e){setAccountError((e as Error).message);return null}},[]);
 useEffect(()=>{let live=true;refresh().then(d=>{if(!live||!d)return;setAccount(d);if(d.person){if(!profile?.nickname)setName(d.person.name||'');const cls=d.person.class_name;if(/^([1-9]|1[0-2])[A-Z]$/.test(cls)){setGrade(Number(cls.slice(0,-1)));setSection(cls.slice(-1))}}});return()=>{live=false}},[refresh]);
 useEffect(()=>{heading.current?.focus({preventScroll:true})},[step]);
 function save(){onSave({student_id:profile?.student_id||'anon_'+crypto.randomUUID(),grade,class_section:grade+section,nickname:name.trim(),onboarding_version:2,...(account?.person?.email?{school_email:account.person.email}:profile?.school_email?{school_email:profile.school_email}:{})})}
 const titles=['Your school day, in one place','Make the board yours','Connect to your school','You’re ready to begin'];
 return <div className="profile-setup guided-onboarding"><div className="onboarding-brand"><img src="/brand/eais-charcoal.svg" width="84" height="42" alt="EAIS"/><div><b>EAIS High Board</b><span>STUDENT LIFE</span></div></div><ol className="onboarding-steps" aria-label="Setup progress">{['Welcome','Your class','School access','Ready'].map((label,i)=><li key={label} aria-current={i===step?'step':undefined} className={i<=step?'complete':''}><span>{i<step?<Check size={14}/>:i+1}</span>{label}</li>)}</ol><p className="eyebrow">STEP {step+1} OF 4</p><h3 ref={heading} tabIndex={-1}>{titles[step]}</h3><form onSubmit={e=>{e.preventDefault();if(step<3)setStep(step+1);else save()}}>
 {step===0&&<><p>A quick tour and a few preferences will help you find what you need.</p><div className="onboarding-features"><article><b>Stay in the loop</b><p>Home brings together school announcements, events and polls.</p></article><article><b>Plan your day</b><p>Find trips in Calendar, respond to invitations and check Schedules.</p></article><article><b>Talk to the right person</b><p>Choose an assigned teacher in Messages. Your conversations stay private.</p></article></div></>}
 {step===1&&<><p>Choose the class you want to browse. Your school assigns access to private class content.</p><label>What should we call you? <small>Optional</small><input autoComplete="given-name" maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Your first name"/></label><div className="two-fields"><label>Grade<select aria-label="Grade" value={grade} onChange={e=>setGrade(Number(e.target.value))}>{Array.from({length:12},(_,i)=>i+1).map(g=><option value={g} key={g}>Grade {g}</option>)}</select></label><label>Class section<select aria-label="Class section" value={section} onChange={e=>setSection(e.target.value)}>{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c=><option value={c} key={c}>Section {c}</option>)}</select></label></div><div className="class-preview"><Users size={20}/><span>Your browsing class<strong>Grade {grade} · Class {grade}{section}</strong></span><Check size={17}/></div></>}
 {step===2&&<><p>School sign-in unlocks private teacher messages and trip responses. You can also explore the public board first.</p>{account?.person?<div className="onboarding-account"><Shield size={18}/><span><b>{account.person.name}</b><small>Verified school account · {account.person.role} · {account.person.class_name||'Class assignment pending'}</small></span></div>:account?.googleClientId?<GoogleAccess data={account} onDone={async()=>{const d=await refresh();if(d){setAccount(d);if(d.person?.name&&!name)setName(d.person.name)}}}/>:<div className="onboarding-school-access"><Shield size={24}/><div><b>{account?'School sign-in is not available yet':'Checking school access…'}</b><p>{account?'The school needs to connect Google sign-in. You can still explore announcements, events and polls.':'You can continue browsing while we check.'}</p></div></div>}{accountError&&<p role="status">{accountError} You can continue browsing.</p>}<p className="onboarding-privacy">Student, teacher and High Board roles come from the school roster. Choosing a class here does not grant private access.</p></>}
 {step===3&&<><p>{name.trim()?`Welcome, ${name.trim()}. `:''}Here’s how to get started.</p><div className="class-preview"><Check size={22}/><span>Your board<strong>Class {grade}{section} · {account?.person?'School account connected':'Browsing access'}</strong></span></div><div className="onboarding-features"><article><b>Start on Home</b><p>Read the latest announcements and see what’s coming up.</p></article><article><b>Join a trip</b><p>Open a trip in Calendar and choose “I want to go.” Change your mind there anytime before the deadline.</p></article><article><b>Need a hand?</b><p>Use “How to use” in the header to replay the app guide. Your class badge opens these preferences.</p></article></div><p className="onboarding-privacy">Preferences stay on this device. Private features need a verified school account.</p></>}
 <div className="onboarding-actions">{step>0&&<button type="button" className="secondary" onClick={()=>setStep(step-1)}>Back</button>}<button className="primary" type="submit">{step===3?'Open my board':step===0?'Get started':step===2&&!account?.person?'Continue browsing':'Continue'}<Check size={17}/></button></div></form></div>;
}
