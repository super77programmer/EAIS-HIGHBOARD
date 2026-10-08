export const homeFocusOptions = [
  { value: 'balanced', label: 'Balanced overview', description: 'A little of everything for your school day.' },
  { value: 'trips', label: 'Trips', description: 'See upcoming trips and participation details first.' },
  { value: 'announcements', label: 'Announcements', description: 'Read school and class updates first.' },
  { value: 'polls', label: 'Polls', description: 'See open decisions and vote first.' },
  { value: 'events', label: 'Events & assessments', description: 'Start with your next event and assessment.' },
] as const;
export type HomeFocus = typeof homeFocusOptions[number]['value'];
export function normalizeHomeFocus(value: unknown): HomeFocus {
  return homeFocusOptions.some(option => option.value === value) ? value as HomeFocus : 'balanced';
}
