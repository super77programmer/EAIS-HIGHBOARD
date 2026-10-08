'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Star, Shield, Check, Users } from 'lucide-react';
import { useMotion } from '@/lib/motion';
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
  return <section id="hero" className="logo-intro" ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Welcome to EAIS High Board"><div className="intro-content"><p className="intro-kicker">EAIS · NEW CAIRO</p><svg className="intro-logo" viewBox="-18 -15 194 109" role="img" aria-label="EAIS school logo"><defs><linearGradient id="intro-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff5e7e"/><stop offset="1" stopColor="#ffad57"/></linearGradient></defs>{logoPaths.map((d,i)=><path key={i} className="intro-logo-path" d={d} fill="url(#intro-gradient)" stroke="#ff8d92" strokeWidth=".8"/>)}</svg><h1 className="intro-title"><span>YOUR SCHOOL.</span><span>YOUR HIGH BOARD.</span></h1><p className="intro-school">Egyptian American International School</p><div className="intro-progress" aria-hidden="true"><span/></div></div></section>;
}
export function MotionLayer({view,revision}:{view:string;revision:string}) {
  const {runtime,reduced}=useMotion();
  useEffect(()=>{if(!runtime||reduced)return;const {gsap}=runtime;const ctx=gsap.context(()=>{document.querySelectorAll<HTMLElement>('.feed-section').forEach(section=>{const cards=Array.from(section.querySelectorAll<HTMLElement>('.feed-card')).filter(card=>!card.parentElement?.closest('.feed-card'));cards.forEach((card,i)=>gsap.from(card,{y:18,autoAlpha:0,duration:.38,delay:(i%3)*.05,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 90%',once:true}}))})});return()=>ctx.revert()},[runtime,reduced,view,revision]);
  useEffect(()=>{if(!runtime||reduced)return;const {gsap}=runtime;const ctx=gsap.context(()=>{});const press=(e:PointerEvent)=>{if(e.button!==0)return;const el=(e.target as Element)?.closest<HTMLButtonElement>('button');if(!el||el.disabled)return;ctx.add(()=>gsap.to(el,{scale:.95,duration:.1,yoyo:true,repeat:1,ease:'power2.out',overwrite:'auto',clearProps:'transform'}))};document.addEventListener('pointerdown',press,{passive:true});return()=>{document.removeEventListener('pointerdown',press);ctx.revert()}},[runtime,reduced]);return null;
}
export function AnimatedProgress({width}:{width:number}) {
  const el=useRef<HTMLSpanElement>(null);const initial=useRef(width);const {runtime,reduced}=useMotion();
  useEffect(()=>{if(!el.current)return;if(!runtime||reduced){el.current.style.width=width+'%';return}const tween=runtime.gsap.to(el.current,{width:width+'%',duration:1,ease:'elastic.out(1, 0.75)',overwrite:true});return()=>tween.kill()},[width,runtime,reduced]);
  return <span ref={el} className="poll-fill progress-bar" style={{width:initial.current+'%'}}/>;
}
export function RatingStars({value,busy,onRate}:{value:number;busy:boolean;onRate:(n:number)=>void}) {
  const [hover,setHover]=useState(0);const ref=useRef<HTMLDivElement>(null);const {runtime,reduced}=useMotion();const shown=hover||value;
  useEffect(()=>{const fills=ref.current?.querySelectorAll<HTMLElement>('.rating-fill');if(!fills)return;const tweens:any[]=[];fills.forEach((fill,i)=>{const width=shown>i?'100%':'0%';if(!runtime||reduced)fill.style.width=width;else tweens.push(runtime.gsap.to(fill,{width,duration:.6,ease:'elastic.out(1, 0.75)',overwrite:true}))});return()=>tweens.forEach(t=>t.kill())},[shown,runtime,reduced]);
  return <div ref={ref} className="stars" onMouseLeave={()=>setHover(0)} aria-label="Rate today’s lunch">{[1,2,3,4,5].map(n=><button key={n} className={'rating-star '+(value===n?'rated':'')} type="button" aria-label={`Rate lunch ${n} out of 5`} aria-pressed={value===n} disabled={busy} onMouseEnter={()=>setHover(n)} onFocus={()=>setHover(n)} onBlur={()=>setHover(0)} onClick={()=>onRate(n)}><span className="star-art"><Star className="star-outline" size={26}/><span className="rating-fill"><Star size={26} fill="currentColor"/></span></span></button>)}</div>;
}
type Profile={student_id:string;grade:number;class_section:string;nickname:string;school_email?:string};
export function ProfileSetup({profile,onSave}:{profile:Profile|null;onSave:(profile:Profile)=>void}) {
  const [moreSections,setMoreSections]=useState(false),[complete,setComplete]=useState(false);const completionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);useEffect(()=>()=>{if(completionTimer.current)clearTimeout(completionTimer.current)},[]);const [step,setStep]=useState(0),[grade,setGrade]=useState(profile?.grade||8),[section,setSection]=useState(profile?.class_section.replace(String(profile.grade),'')||'A'),[name,setName]=useState(profile?.nickname||''),[email,setEmail]=useState(profile?.school_email||'');const ref=useRef<HTMLDivElement>(null);const {runtime,reduced}=useMotion();
  useEffect(()=>{if(!ref.current||!runtime||reduced)return;const ctx=runtime.gsap.context(()=>runtime.gsap.fromTo('.onboarding-step',{y:20,opacity:0},{y:0,opacity:1,duration:.4,ease:'back.out(1.7)'}),ref);return()=>ctx.revert()},[step,runtime,reduced]);
  return <div ref={ref} className="profile-setup"><div className="onboarding-brand"><img src="/brand/eais-charcoal.svg" width="84" height="42" alt="EAIS"/><div><b>A little more you.</b><span>YOUR HIGH BOARD EXPERIENCE</span></div></div><div className="setup-progress"><div className="setup-progress-label"><span>{step===0?'Your class':'Your school profile'}</span><small>Step {step+1} of 2</small></div><div className="setup-progress-track" role="progressbar" aria-label="Profile setup progress" aria-valuemin={0} aria-valuemax={2} aria-valuenow={step+1}><span style={{width:step===0?'50%':'100%'}}/></div></div><form onSubmit={e=>{e.preventDefault();if(step===0){setStep(1);return}if(!/^[^\s@]+@els-egypt\.info$/i.test(email.trim()))return;if(complete)return;setComplete(true);const next={student_id:profile?.student_id||'anon_'+crypto.randomUUID(),grade,class_section:grade+section,nickname:name.trim(),school_email:email.trim().toLowerCase()};completionTimer.current=setTimeout(()=>onSave(next),reduced?0:500)}}><div className="onboarding-step" key={step}>{step===0?<><h3>Find your people.</h3><p>We’ll bring you the events, schedules and polls for your class.</p><fieldset className="profile-choice"><legend>Grade level</legend><div className="profile-pills grade-pills">{Array.from({length:12},(_,i)=>i+1).map(g=><button key={g} type="button" aria-pressed={grade===g} onClick={()=>setGrade(g)}>Grade {g}</button>)}</div></fieldset><fieldset className="profile-choice"><legend>Class section</legend><div className="profile-pills section-pills">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0,moreSections?26:Math.max(6,'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(section)+1)).map(s=><button key={s} type="button" aria-label={'Section '+s} aria-pressed={section===s} onClick={()=>setSection(s)}>{s}</button>)}</div><button className="text-button" type="button" aria-expanded={moreSections} onClick={()=>setMoreSections(!moreSections)}>{moreSections?'Show fewer sections':'More sections'}</button></fieldset><div className="class-preview"><Users size={20}/><span>YOUR SPACE<strong>Grade {grade} · Class {grade}{section}</strong></span><Check size={17}/></div></>:<><h3>Make it your school space.</h3><p>Add your name and school email to prepare your profile for teacher chat.</p><label>Your full name<input required autoComplete="name" maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name here"/></label><label>School email<input required type="email" autoComplete="email" pattern="[^\s@]+@els-egypt\.info" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your.name@els-egypt.info"/><small>Use your school-issued @els-egypt.info address.</small></label><div className={"class-preview final-preview "+(complete?"profile-complete":"")} role="status"><Users size={20}/><span>{name.trim()||"YOUR SPACE"}<strong>Grade {grade} · Class {grade}{section}</strong></span><Check className="profile-check" size={22}/></div></>}</div><div className="privacy-note"><Shield size={17}/><span>Your profile stays on this device. Google verification is required before teacher chat; anonymous suggestions never share your profile email.</span></div><div className="step-actions">{step===1&&<button type="button" className="secondary" disabled={complete} onClick={()=>setStep(0)}>Back</button>}<button className="primary full" type="submit" disabled={complete}>{complete?'You’re all set':step===0?'Continue':profile?'Save my profile':'Open my board'}{step===1&&<Check size={17}/>}</button></div></form></div>;
}
