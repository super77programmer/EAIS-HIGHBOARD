# School calendar import and UX — 13 October 2026

Source: owner-provided EAIS parent calendar 2026–27, 12 pages, created 14 September 2026. The source was extracted and every page was rendered and visually checked. Structured records live in `lib/school-calendar-data.json`, each with a stable ID, source page, grade audience, date range and time status. There are 231 records, covering August 2026 through August 2027.

## Import rules

- The board initializes the supplied calendar once, even in an existing initialized database. Small batches and INSERT OR IGNORE make partial or concurrent initialization safe to repeat. A completion marker prevents later refreshes from overwriting staff edits or restoring deleted entries.
- Grade numbers printed in the source set the audience. Dates without a stated grade are school-level dates; students should confirm applicability with the school. ACT/SAT dates are scoped to high-school grades and do not assert registration or test eligibility.
- Dates without an exact time use exclusive-end date-only intervals. The UI says Time to be confirmed for activities and assessments; it does not invent rooms, costs, exam lengths or attendance hours. Calendar exports use VALUE=DATE for these entries.
- Holiday ranges follow the shaded source cells. Eid / Islamic New Year dates are tentative. The two printed March SAT dates remain separate and both explicitly require confirmation.
- Week labels are represented as periods, with exact individual activities still requiring school confirmation. Spirit Week and league finals have tentative period labels. The White Desert departure is 31 March; a return date was not supplied and was not invented.
- Regular-day repeating school hours, decorative themes and unspecified next-year dates are not expanded into daily events. Multi-grade events with different times are separated only when both start and end were supplied.
- School dates lead Home and assessments when present. Sample events remain stored, but are hidden from the real calendar until explicitly enabled. Existing posts, polls, menu items and private data are preserved.

## Calendar interaction changes

Compact month navigation with native month jumping, visible selected-date agenda, collapsible full-width filters, an Agenda view, keyboard date movement, bounded month rows and event dots on small screens. Multi-day events appear on every date they cover, including ranges crossing months. Empty searches and active filters can reset directly. Dates use Cairo time independently of browser timezone. Long day titles and filter values remain readable within narrow layouts.

## Validation

TypeScript, CSS/source structural checks, production packaging, the full functional suite, and dedicated calendar tests cover date boundaries, source integrity, grade scopes, import idempotency, preservation of edits/deletions, keyboard navigation, monthly/weekly/daily/agenda modes, sample opt-in and date-only ICS exports. Phone appearance and gesture/keyboard behavior still require device testing.
