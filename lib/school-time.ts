const zone = 'Africa/Cairo';
export function schoolDateTime(value: string) {
  if (!value) return '';
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value)).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
// Resolve the school's wall clock independently of the browser's timezone.
// Repeated or skipped DST times need an explicit choice rather than silent drift.
export function schoolInstant(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw Error('Enter a valid Cairo date and time.');
  const nominal = Date.parse(value + ':00Z');
  if (!Number.isFinite(nominal)) throw Error('Enter a valid Cairo date and time.');
  const candidates = [2, 3].map(offset => new Date(nominal - offset * 3600000).toISOString()).filter(x => schoolDateTime(x) === value);
  if (candidates.length !== 1) throw Error('This Cairo time is skipped or repeated during the clock change. Choose another time.');
  return candidates[0];
}
