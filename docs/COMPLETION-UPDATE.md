# Daily-use completion update — 11 October 2026

The existing warm orange/coral identity, entrance sequence and Home-based staff desk are retained.

## Delivered

- Home includes a private school-account task planner: add/edit, subject, optional due date, priority, completion/reopening, search, due-now/completed filters and confirmed removal. Tasks persist in D1 across devices and are never exposed to other students or staff, including administrators. Revision checks reject stale edits.
- Home focus is saved to the connected account, with local browsing fallback. Guided setup reads existing account preferences. Focus cards and actual Home reading order remain selectable.
- Staff/council publishing supports draft editing, previews, stage filters and staff feedback with return-to-draft/resubmission. Teacher audience restrictions remain server enforced; published polls must be archived/replaced to preserve votes.
- Teacher sessions and breaks can be edited. Times, assignments and overlaps are validated server-side.
- Event/poll form dates consistently represent Cairo wall-clock time even on devices in other timezones. Skipped/repeated clock-change times receive a specific error.
- Trip forms include fee, meeting point, packing notes and an optional response deadline. Staff record received cash and the existing paper permission form with audit entries. Students see their own confirmation only. Collection lists retain received-payment/form records after a decline until staff resolve them. The filtered collection list can be printed.
- Calendar offers an interested-trips filter.
- Attachment uploads show progress and cancellation. Cancelling stops multipart retries, attempts server cleanup, and preserves the message draft and selected file. Navigating away cancels an ongoing upload.
- Offline status and bounded network requests provide clearer failure states. Private content is cleared on account-change events; stale responses cannot replace newer board/planner/workspace state.

## Validation

TypeScript compilation, component interaction tests and SQLite-backed real API handler tests cover planner/privacy/conflicting writes, editing/approval/timetable permissions, trip receipt handling/deadlines, Cairo DST, upload cancellation/retries and existing messaging, auth, polls, moderation and attachment flows. Build and publication status are recorded by the release workflow.

The managed control-browser capability is unavailable in this session. Full browser visual QA and production school-account OAuth interaction were not performed; component tests are not browser screenshots.

## Remaining external setup

School Google OAuth origins, a real approved roster/role assignment and school-run account tests still need the school/operator configuration. Existing operational requirements in SCHOOL-LAUNCH-READINESS.md remain outstanding, including defined retention, restore-tested backups and school approval. This release does not assert completion of those decisions or unlimited hosting/storage.

Personal task titles are private personal notes; they are not student submissions or official academic records. Trip checkboxes record staff receipt only and are not payment processing or an automatic place guarantee.
