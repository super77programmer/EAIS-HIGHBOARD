'use client';

import type { ReactNode } from 'react';
import { CalendarDays, Check, Clock, Compass, GraduationCap, MapPin, MessageSquare, Plus, Ticket, Users, Utensils } from 'lucide-react';
import type { Item } from '@/lib/board';

type Entry = Item & { total: number; counts?: number[]; mine?: string };
type Props = {
  profile: { nickname: string; grade: number; class_section: string };
  events: Entry[]; upcoming: Entry[]; polls: Entry[]; featured?: Entry; payment?: Entry;
  meals: { name: string; price: number; soldOut?: boolean }[];
  sample: boolean; loading: boolean; filter: string; shown: Entry[];
  onFilter: (filter: string) => void; onNavigate: (tab: string) => void;
  onVoice: (section: string) => void; onDetail: (entry: Entry) => void;
  onDay: (day: string) => void; renderEvent: (entry: Entry) => ReactNode;
  renderPoll: (entry: Entry) => ReactNode; announcements: ReactNode;
};
const dayKey = (date: Date) => date.toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
const format = (value: string, options: Intl.DateTimeFormatOptions) => new Date(value).toLocaleString('en-GB', { timeZone: 'Africa/Cairo', ...options });
const occursOn = (event: Entry, day: string) => !!event.start && event.stage !== 'Cancelled' && dayKey(new Date(event.start)) <= day && dayKey(new Date(event.end ? Math.max(Date.parse(event.start), Date.parse(event.end) - 1) : event.start)) >= day;

export function HomeOverview(props: Props) {
  const { profile, events, upcoming, polls, featured, payment, meals, loading, filter, shown, sample, onFilter, onNavigate, onVoice, onDetail, onDay, renderEvent, renderPoll, announcements } = props;
  const now = new Date(), today = dayKey(now);
  const todayEvents = events.filter(event => occursOn(event, today));
  const activePolls = polls.filter(poll => Date.parse(poll.end || '') > now.getTime());
  const nextExam = upcoming.find(event => event.category === 'Exam' && event.stage !== 'Cancelled' && Date.parse(event.start!) >= now.getTime());
  const weekStart = new Date(today + 'T12:00:00Z');
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  const week = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(weekStart); day.setUTCDate(day.getUTCDate() + offset);
    return { day, key: day.toISOString().slice(0, 10) };
  });
  const firstName = profile.nickname.trim().split(/\s+/)[0];
  const activeTripDeadline = featured?.deadline && Date.parse(featured.deadline) > now.getTime();

  return <div className="home-dashboard feed-section" id="student-board">
    <header className="home-heading">
      <div><span className="home-overline">YOUR CLASS. YOUR SCHOOL.</span><h1>{firstName ? `Hey, ${firstName}.` : 'Your school day.'}</h1><p>Here’s what’s happening at EAIS.</p></div>
      <div className="home-heading-meta"><span><CalendarDays size={16}/>{format(now.toISOString(), { weekday: 'short', day: 'numeric', month: 'long' })}</span><span className="home-class"><Users size={16}/>Grade {profile.grade} · {profile.class_section}</span></div>
    </header>
    {sample && <div className="home-preview-note"><span>PREVIEW DATA</span><p>Sample events and menu. School announcements appear when published.</p></div>}

    <div className="home-top-grid">
      <section className="home-today home-surface">
        <div className="home-section-heading"><div><span className="home-overline">THE DAILY BRIEF</span><h2>Today at school</h2></div><span className="home-date-stamp"><b>{format(now.toISOString(), { day: '2-digit' })}</b>{format(now.toISOString(), { month: 'short' })}</span></div>
        <div className="home-today-body">
          {loading && !events.length ? <p role="status" className="home-empty">Loading today’s updates…</p> : todayEvents.length ? <div className="home-timeline">{todayEvents.slice(0, 3).map(event => <button className="home-timeline-item" key={event.id} onClick={() => onDetail(event)}><span className="home-timeline-time">{event.category === 'Holiday' ? 'ALL DAY' : format(event.start!, { hour: '2-digit', minute: '2-digit' })}</span><span><small>{event.category}{event.sample ? ' · Sample' : ''}</small><strong>{event.title}</strong>{event.room && <span className="home-location"><MapPin size={14}/>{event.room}</span>}</span></button>)}{todayEvents.length > 3 && <button className="home-link" onClick={() => onDay(today)}>View all {todayEvents.length} events today</button>}</div> : <div className="home-today-empty"><CalendarDays size={28}/><h3>A clear calendar today.</h3><p>No events scheduled for your class.</p><button className="home-link" onClick={() => onNavigate('Schedules')}>View schedules</button></div>}
        </div>
        <div className="home-today-footer"><GraduationCap size={20}/><div><span>Next assessment</span><strong>{nextExam ? nextExam.title : 'No upcoming exams'}</strong></div>{nextExam && <button onClick={() => onDetail(nextExam)}>{format(nextExam.start!, { day: 'numeric', month: 'short' })}</button>}</div>
      </section>

      {featured ? <article className={'home-trip home-surface' + (featured.id === 'trip-rayan' ? ' home-trip-photo' : '')}>
        <div className="home-trip-visual">{featured.id === 'trip-rayan' && <img src="/images/wadi-el-rayan.jpg" alt="Lake and desert shoreline at Wadi El Rayan" fetchPriority="high"/>}<div className="home-trip-shade"/><div className="home-trip-badges"><span><Compass size={15}/>NEXT SCHOOL TRIP</span>{featured.sample && <span>Sample</span>}</div><div className="home-trip-caption"><span>{format(featured.start!, { weekday: 'short', day: 'numeric', month: 'long' })}</span><h2>{featured.id === 'trip-rayan' ? 'Wadi El Rayan' : featured.title}</h2><p>{featured.id === 'trip-rayan' ? 'Sandboarding. Open skies. A day together.' : featured.description}</p></div></div>
        <div className="home-trip-footer"><div><Ticket size={18}/><span><small>Trip cost</small><strong>{featured.cost !== undefined ? `${featured.cost} EGP` : 'To be confirmed'}</strong></span></div><button className="home-primary" onClick={() => onDetail(featured)}>Trip details</button></div>
        {activeTripDeadline && <button className="home-trip-deadline" onClick={() => onDetail(featured)}><Clock size={15}/>Payment closes {format(featured.deadline!, { day: 'numeric', month: 'short' })}</button>}
      </article> : <section className="home-voice-feature home-surface"><MessageSquare size={30}/><span className="home-overline">STUDENT VOICE</span><h2>Make school<br/>a little more yours.</h2><p>Share a suggestion privately with the High Board and follow its reply.</p><button className="home-primary" onClick={() => onVoice('Private suggestions')}>Share an idea</button></section>}
    </div>

    <section className="home-week home-surface" aria-label="This week’s school events"><div className="home-section-heading"><h2>This week</h2><button className="home-link" onClick={() => onNavigate('Calendar')}>Full calendar <CalendarDays size={16}/></button></div><div className="home-week-days">{week.map(({ day, key }) => {
      const count = events.filter(event => occursOn(event, key)).length;
      return <button key={key} className={'home-week-day' + (key === today ? ' today' : '') + (day.getUTCDay() >= 5 ? ' weekend' : '')} aria-current={key === today ? 'date' : undefined} aria-label={`${format(day.toISOString(), { weekday: 'long', day: 'numeric', month: 'long' })}, ${count} events`} onClick={() => onDay(key)}><span>{format(day.toISOString(), { weekday: 'short' })}</span><b>{day.getUTCDate()}</b><small>{count ? `${count} event${count === 1 ? '' : 's'}` : key === today ? 'Today' : '—'}</small><span className={'home-day-mark' + (count ? ' has-events' : '')} aria-hidden="true"/></button>;
    })}</div></section>

    <div className="home-quick-actions" aria-label="School shortcuts">
      <button onClick={() => onVoice('Teacher chat')}><span className="home-action-icon"><MessageSquare size={21}/></span><span><b>Teacher chat</b><small>Pick up a conversation</small></span></button>
      <button onClick={() => onVoice('Council polls')}><span className="home-action-icon"><Check size={21}/></span><span><b>Open polls{activePolls.length > 0 && <em>{activePolls.length}</em>}</b><small>Have your say</small></span></button>
      <button onClick={() => onNavigate('Canteen')}><span className="home-action-icon"><Utensils size={21}/></span><span><b>Canteen</b><small>See today’s menu</small></span></button>
      <button onClick={() => onVoice('Private suggestions')}><span className="home-action-icon"><Plus size={21}/></span><span><b>Share an idea</b><small>Private replies from the board</small></span></button>
    </div>

    {payment && payment.id !== featured?.id && <button className="home-deadline-notice" onClick={() => onDetail(payment)}><Clock size={18}/><span><b>{payment.title}</b> · Payment closes {format(payment.deadline!, { day: 'numeric', month: 'short' })}</span></button>}
    <div className="home-announcements">{announcements}</div>
    <div className="home-bottom-grid">
      <section className="home-events home-surface"><div className="home-section-heading"><div><span className="home-overline">ON YOUR CALENDAR</span><h2>Coming up</h2></div><span className="home-total">{upcoming.length}</span></div><div className="home-event-filters" role="group" aria-label="Filter upcoming events">{['All', 'Trips', 'Exams', 'Class Events', 'Holidays', 'Polls'].map(value => <button key={value} aria-pressed={filter === value} className={filter === value ? 'active' : ''} onClick={() => onFilter(value)}>{value === 'Class Events' ? 'Class' : value}</button>)}</div><div className="home-event-list">{filter === 'Polls' ? polls.length ? polls.map(poll => <div className="embedded-poll" key={poll.id}>{renderPoll(poll)}</div>) : <p className="home-empty">No polls for your class yet.</p> : shown.length ? shown.slice(0, 5).map(renderEvent) : <p className="home-empty">{loading ? 'Loading school events…' : 'No upcoming events in this category.'}</p>}</div>{filter !== 'Polls' && shown.length > 5 && <button className="home-link home-more" onClick={() => onNavigate('Calendar')}>View all {shown.length} events</button>}</section>
      <aside className="home-side-stack">
        {activePolls.length > 0 && <section className="home-poll"><div className="home-section-heading"><h2>Your vote matters</h2><MessageSquare size={18}/></div>{renderPoll(activePolls[0])}</section>}
        <section className="home-menu home-surface"><div className="home-section-heading"><h2>At the canteen</h2><Utensils size={20}/></div>{meals.length ? <div>{meals.slice(0, 3).map((meal, index) => <div className="home-menu-item" key={index}><span>{meal.name}{meal.soldOut && <small>Sold out</small>}</span><b>{meal.price} <small>EGP</small></b></div>)}</div> : <p className="home-empty">Today’s menu hasn’t been posted yet.</p>}<button className="home-link" onClick={() => onNavigate('Canteen')}>Full menu</button></section>
        <a className="home-classroom" href="https://classroom.google.com" target="_blank" rel="noreferrer"><GraduationCap size={23}/><span><b>Google Classroom</b><small>Homework & learning materials</small></span></a>
      </aside>
    </div>
  </div>;
}
