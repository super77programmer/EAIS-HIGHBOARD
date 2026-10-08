# School app usability update — 8 October 2026

## Implemented

- Immediate student home: the opening logo animation no longer delays access.
- One grouped navigation system: School, My account, Student life and Administration where authorised.
- A desktop sidebar and a mobile navigation drawer, with active-page state, Escape closing, keyboard focus handling and focus return.
- Clear labels: Home, Assessments, My workspace, Messages and Administration.
- A keyboard skip link to the main content.
- Restrained blue-and-white surfaces, consistent controls, readable metadata, reduced decorative text and compact page headings.
- Calendar search over visible event titles, descriptions and meeting points; category filters, clear filters, result counts, a readable cross-date result list and matching selected-day agenda.
- Existing trip interest, private questions, messages, polls and staff workflows retained.

The editable [Figma concepts](https://www.figma.com/design/reo7vMDacUfLmRnZOG1UK8) cover desktop home/calendar and mobile trip details. They contain generic example text and no private roster data. Concepts guide the production design; they are not a claim of pixel-identical implementation.

## Further practical ideas

| Priority | Small addition | Purpose |
|---|---|---|
| Next | Manual cash-received tick with collector/time | Give staff a clear collection record without card payments. |
| Next | Interest deadline field | Close sign-ups before the departure day. |
| Next | Edit/duplicate a teacher session | Avoid deleting and retyping timetable entries. |
| Next | Edit draft and preview audience | Reduce accidental publication mistakes. |
| Later | Topic tag on trip questions | Separate transport, permission, payment and packing questions. |
| Later | Oldest-unanswered question first | Help contacts answer waiting students fairly. |
| Later | Organiser trip FAQ | Answer common questions without publishing private exchanges. |
| Later | Printable trip instructions | Let staff share a clean meeting-point/packing brief. |
| Later | Class headings in collection view | Make classroom visits easier to organise. |
| Later | Staff response-hours note | Set a realistic expectation for private replies. |
| Later | Clear ended-event history | Keep past events out of everyday views. |
| Later | Role-specific quick help | Explain the student, teacher and High Board workflows. |

All use the current app and storage. No new subscriptions or external services are proposed. Payment, permission and final trip confirmation remain school-managed. The 100-item backlog remains a prioritised pool; build a small verified batch at a time.

## Verification and limits

TypeScript, interaction checks and production build are required for this release. The interaction harness covers immediate home, menu opening/navigation/Escape, calendar search/category/reset, trip interest/rejoining, private questions/contact replies and existing chat/poll/onboarding workflows. Figma previews were visually inspected; a final minor text-layout correction was structurally checked, with another screenshot blocked by the Starter-plan tool-call limit. A native browser screenshot review of the production layout is not available in this environment; test on actual school phones and laptops during the restricted pilot. This update is not a claim of full accessibility certification.
