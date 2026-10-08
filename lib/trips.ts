import {visible,type Item} from '@/lib/board';
import type {Context} from '@/lib/communications';
export type TripChoice='interested'|'declined';
export function studentTripAccess(trip:Item,c:Context){const p=c.person;return !!p&&['student','council'].includes(p.role)&&!!p.class_name&&['Published','Cancelled'].includes(trip.stage||'Published')&&visible(trip.audience,Number(p.class_name.slice(0,-1)),p.class_name)}
export function collectionAccess(c:Context){return c.isAdmin||c.staff||c.person?.role==='teacher'}
export function collectorClasses(c:Context):string[]|null{return c.isAdmin||c.staff?null:c.person?.role==='teacher'?JSON.parse(c.person.classes):[]}
