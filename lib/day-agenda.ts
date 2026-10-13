import type {Item} from './board';
import {calendarDay,eventsOnDay} from './calendar';
export function dayAgenda<T extends Item>(events:T[],now=new Date()){
 const today=calendarDay(now),stamp=now.getTime(),valid=events.filter(i=>i.stage!=='Cancelled'&&i.start&&i.end&&Number.isFinite(Date.parse(i.start))&&Number.isFinite(Date.parse(i.end)));
 const rank=(i:Item)=>i.allDay?2:Date.parse(i.end!)<=stamp?3:Date.parse(i.start!)<=stamp?0:1;
 const todayEvents=(eventsOnDay(valid,today) as T[]).sort((a,b)=>rank(a)-rank(b)||Date.parse(a.start!)-Date.parse(b.start!)||a.id.localeCompare(b.id));
 const future=valid.filter(i=>calendarDay(i.start!)>today).sort((a,b)=>Date.parse(a.start!)-Date.parse(b.start!)||a.id.localeCompare(b.id));
 const lead=todayEvents[0]||future[0],rows=todayEvents.filter(i=>i.id!==lead?.id).slice(0,3);
 const nextAssessment=valid.filter(i=>i.category==='Exam'&&Date.parse(i.start!)>stamp&&!todayEvents.some(t=>t.id===i.id)).sort((a,b)=>Date.parse(a.start!)-Date.parse(b.start!))[0];
 return{today,todayEvents,lead,rows,more:Math.max(0,todayEvents.length-(lead?1:0)-rows.length),nextAssessment,finished:todayEvents.length>0&&todayEvents.every(i=>!i.allDay&&Date.parse(i.end!)<=stamp)};
}
