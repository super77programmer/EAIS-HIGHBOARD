export const homeFocusOptions = [
  { value: 'balanced', label: 'Balanced overview', description: 'A little of everything for your school day.' },
  { value: 'trips', label: 'Trips', description: 'Keep upcoming trips and participation details within reach.' },
  { value: 'announcements', label: 'Announcements', description: 'Read school and class updates first.' },
  { value: 'polls', label: 'Polls', description: 'Find open decisions and take part in school polls.' },
  { value: 'events', label: 'Events & assessments', description: 'Prioritize upcoming dates below your daily updates.' },
] as const;
export type HomeFocus = typeof homeFocusOptions[number]['value'];
export function normalizeHomeFocus(value: unknown): HomeFocus {
  return homeFocusOptions.some(option => option.value === value) ? value as HomeFocus : 'balanced';
}
