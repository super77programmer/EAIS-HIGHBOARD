'use client';
import { useEffect, useState } from 'react';
export type MotionRuntime = { gsap: any; ScrollTrigger: any };
declare global { interface Window { gsap?: any; ScrollTrigger?: any; } }
let loading: Promise<MotionRuntime | null> | null = null;
function script(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script'); tag.src = src; tag.async = true;
    const timeout = window.setTimeout(() => { tag.remove(); reject(new Error('Motion script timed out')); }, 6000);
    tag.onload = () => { clearTimeout(timeout); resolve(); };
    tag.onerror = () => { clearTimeout(timeout); tag.remove(); reject(new Error('Motion script unavailable')); };
    document.head.appendChild(tag);
  });
}
export function loadMotion(): Promise<MotionRuntime | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!loading) loading = (async () => {
    await Promise.all([window.gsap ? Promise.resolve() : script('/vendor/gsap.min.js'),
    window.ScrollTrigger ? Promise.resolve() : script('/vendor/ScrollTrigger.min.js')]);
    if (!window.gsap || !window.ScrollTrigger) return null;
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ ignoreMobileResize: true });
    return { gsap: window.gsap, ScrollTrigger: window.ScrollTrigger };
  })().catch(() => null);
  return loading;
}
export function useMotion() {
  const [runtime, setRuntime] = useState<MotionRuntime | null>(null);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true; const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReduced(media.matches); if (!media.matches) loadMotion().then(value => { if (active) setRuntime(value); }); }; change(); media.addEventListener('change', change);
    return () => { active = false; media.removeEventListener('change', change); };
  }, []);
  return { runtime, reduced };
}
