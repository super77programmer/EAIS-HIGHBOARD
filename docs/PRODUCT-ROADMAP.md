# High Board role and feature plan — 8 October 2026

| Account | Daily experience | Publishing | Restricted controls |
| --- | --- | --- | --- |
| Student | Current student experience, class updates, calendar, polls, teacher chat, private suggestions | Suggestions to moderation | Own conversations and assigned class content |
| Teacher | Smaller teacher workspace, weekly sessions, breaks, current/next lesson, assigned students | Assigned-class announcements, events and trips | No school-wide publication or account management |
| High Board / council | Student experience plus workspace and moderation desk | Grade/class/all-school polls, announcement/event drafts for staff approval | No role changes, teacher private chats or security settings |
| Staff | Assigned classes, teacher workspace, reports, publication approval | School announcements and approvals | Moderation based on school safeguarding policy |
| Administrator | Operational workspace and roster | Full content review | Role assignment, configuration, security and audit |

Implemented in this update: role-aware workspace, private recurring teacher timetable, assigned-class publication, school poll creation with verified voting, council approval stages, large private media uploads, policy links and audience checks.

Next product improvements, proposed rather than implemented:
1. Event RSVP, capacity, waiting list and cancellation notifications. Trips need separate school guardian-consent processes; never treat RSVP as consent.
2. Teacher notification quiet hours, urgent-versus-routine priority, opt-in push, per-class notification preferences and unread announcements.
3. Canonical school timetable import, substitutions and holidays; personal timetable entries currently do not detect school changes.
4. Publication editing/version history, scheduled release and acknowledgement for critical instructions.
5. School-managed privacy centre: verified requests, consent records, controlled export/deletion, retention jobs and incident records.
6. File cancellation button, reload-resumable uploads, storage dashboard, scanning quarantine and lifecycle removal of expired multipart sessions.
7. Accessible Arabic/English interface, keyboard review and screen-reader testing with actual users.
8. Simple event and poll participation summaries without public student-level identities.

Launch order: restricted pilot with test data → permission and realistic upload checks → school/privacy operational approval → limited teacher/class pilot → school-wide rollout with measured quotas and support coverage.

Design: preserve existing approved homepage composition. Use the working workspace's timetable, audience controls, readable cards and clear role labels. No new design plugin is required. Figma can help with a later design-system pass; Canva is not currently available as a callable tool in this session. More plugins do not fix backend security or legal authorisation.

## Trip-interest update
Implemented reversible interest responses, homepage dismissal, calendar rejoining, verified-class checks and a protected staff collection list. See [Trip interest](TRIP-INTEREST.md) for behavior and limits and [100 recommendations](100-IMPROVEMENTS.md) for the prioritised backlog.
