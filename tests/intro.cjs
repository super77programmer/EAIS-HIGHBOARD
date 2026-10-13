const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),out=fs.mkdtempSync(path.join(os.tmpdir(),'hb-intro-'));
fs.symlinkSync(root+'/node_modules',out+'/node_modules','dir');
for(const file of ['lib/home-focus.ts','components/HomeFocusPicker.tsx','components/AppNavigation.tsx','components/TripQuestions.tsx','components/Workspace.tsx','lib/school-time.ts','lib/home-focus.ts','components/PublishingEditor.tsx','components/Planner.tsx','components/TripCollection.tsx','components/TripInterest.tsx','lib/media-client.ts','lib/trip-client.ts','app/page.tsx','components/Motion.tsx','components/AppTutorial.tsx','components/FileAttachment.tsx','lib/day-agenda.ts','components/DayAgenda.tsx','components/HomeOverview.tsx','components/SchoolUpdates.tsx','components/SchoolMessenger.tsx','components/ChatComposer.tsx','components/SchoolCalendar.tsx','lib/calendar.ts','components/FeedbackToast.tsx','components/VoiceMessage.tsx','components/VoiceRecorder.tsx','components/ChatDemo.tsx','components/Community.tsx','components/Reliability.tsx','lib/http.ts','lib/community-client.ts','lib/motion.ts','lib/logo-paths.ts','lib/board.ts','lib/moderation.ts']){
 const dest=out+'/'+file.replace(/\.tsx?$/,'.js');fs.mkdirSync(path.dirname(dest),{recursive:true});
 fs.writeFileSync(dest,ts.transpileModule(fs.readFileSync(root+'/'+file,'utf8').replaceAll("'@/",`'${out}/`),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText);
}
fs.copyFileSync(root+'/lib/school-calendar-data.json',out+'/lib/school-calendar-data.json');
const {JSDOM}=require('jsdom'),dom=new JSDOM('<div id="root"></div>',{url:'https://test.local',pretendToBeVisual:true,runScripts:'outside-only'}),w=dom.window;
let reduced=false;
w.matchMedia=()=>({matches:reduced,addEventListener(){},removeEventListener(){}});
w.SVGElement.prototype.getTotalLength=()=>200;w.SVGElement.prototype.getBBox=()=>({x:0,y:0,width:160,height:80});
for(const k of ['window','document','HTMLElement','Element','SVGElement','Node'])global[k]=w[k];
for(const k of ['getComputedStyle','requestAnimationFrame','cancelAnimationFrame','matchMedia'])global[k]=w[k].bind(w);
Object.defineProperty(global,'navigator',{value:w.navigator,configurable:true});global.IS_REACT_ACT_ENVIRONMENT=true;
w.eval(fs.readFileSync(root+'/public/vendor/gsap.min.js','utf8'));w.ScrollTrigger={config(){},register(){}};
const React=require('react'),{createRoot}=require('react-dom/client'),{LogoHero}=require(out+'/components/Motion');
const r=createRoot(document.getElementById('root'));
let entries=0;
async function render(){await React.act(async()=>{r.render(React.createElement(LogoHero,{onEnter:()=>entries++}));await new Promise(resolve=>setTimeout(resolve,20))})}
(async()=>{
 await render();assert.equal(document.body.style.overflow,'hidden');assert.equal(document.activeElement.getAttribute('aria-label'),'Welcome to EAIS High Board');assert.equal(document.querySelector('.intro-skip'),null);
 const timeline=w.gsap.globalTimeline.getChildren().find(t=>t.vars.onComplete);
 assert.ok(timeline,'Entrance has an automatic completion timeline');assert.equal(timeline.vars.scrollTrigger,undefined,'Entrance is independent of scrolling');
 assert.ok(timeline.duration()<4,'Intro lasts less than four seconds');
 await React.act(async()=>{timeline.progress(1);});assert.equal(entries,1,'Animation automatically enters app');
 await React.act(async()=>document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'})));assert.equal(entries,1,'Skip and completion cannot enter twice');
 await React.act(async()=>r.render(null));assert.equal(document.body.style.overflow,'','Scrolling restored after intro');
 reduced=true;await render();assert.equal(entries,2,'Reduced motion enters immediately');await React.act(async()=>r.render(null));
 reduced=false;await render();await React.act(async()=>document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'})));assert.equal(entries,3,'Escape skips intro');
 await React.act(async()=>r.unmount());w.gsap.ticker.sleep();w.close();
 console.log('PASS: GSAP automatic entry, bounded duration, keyboard skip, single completion, reduced motion and scroll restoration.');
})().catch(e=>{console.error(e);w.gsap.ticker.sleep();w.close();process.exitCode=1});
