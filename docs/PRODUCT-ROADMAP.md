# High Board role and feature plan — 8 October 2026

| Account | Daily experience | Publishing | Restricted controls |
| --- | --- | --- | --- |
| Student | Current student experience, class updates, calendar, polls, teacher chat, private suggestions | Suggestions to moderation | Own conversations and assigned class content |
| Teacher | Smaller teacher workspace, weekly sessions, breaks, current/next lesson, assigned students | Assigned-class announcements, events and trips | No school-wide publication or account management |
| High Board / council | Student experience plus workspace and moderation desk | Grade/class/all-school polls, announcement/event drafts for staff approval | No role changes, teacher private chats or security settings |
| Staff | Assigned classes, teacher workspace, reports, publication approval | School announcements and approvals | Moderation based on school safeguarding policy |
| Administrator | Operational workspace and roster | Full content review | Role assignment, configuration, security and audit |

Implemented in this update: role-aware workspace, private recurring teacher timetable, assigned-class publication, school poll creation with verified voting, council approval stages, large private media uploads, policy links and audience checks.

Next practical batches, proposed rather than implemented:
1. Manual collection confirmation, received-paper-permission tick box, interest closing date and trip packing checklist.
2. Timetable editing and duplicate-session controls.
3. Draft editing, previews and specific staff approval feedback.
4. Calendar search, trip filter and interested-events view.
5. Visible upload cancellation, clearer progress and file-limit guidance.
6. Mobile spacing, keyboard focus and clearer errors.

Keep questions, payments and permissions simple: designated contacts answer privately in the app; staff collect payment and existing school permission forms manually. No card gateways, paid integrations or complex external workflows are part of the current plan. See the revised [100 practical improvements](100-IMPROVEMENTS.md).

Launch order: restricted pilot with test data → permission and realistic upload checks → school/privacy operational approval → limited teacher/class pilot → school-wide rollout with measured quotas and support coverage.

Design: preserve existing approved homepage composition. Use the working workspace's timetable, audience controls, readable cards and clear role labels. No new design plugin is required. Figma can help with a later design-system pass; Canva is not currently available as a callable tool in this session. More plugins do not fix backend security or legal authorisation.

## Trip-interest update
Implemented reversible interest responses, homepage dismissal, calendar rejoining, verified-class checks and a protected staff collection list. See [Trip interest](TRIP-INTEREST.md) for behavior and limits and [100 recommendations](100-IMPROVEMENTS.md) for the prioritised backlog.

## Designated trip contacts
Staff/administrators and a trip’s currently assigned teacher organiser can choose up to four active teachers, staff members or High Board helpers in the collection view. Students select a contact on the trip page. Only that student and selected contact can read the private question and reply. Helpers gain no collection-list or general teacher-chat privileges. See [Trip questions](TRIP-QUESTIONS.md).

## Usability release
Applied a restrained school-workspace design, grouped desktop navigation, mobile navigation drawer, immediate student home and calendar search/category filtering. Editable Figma concepts cover desktop home/calendar and mobile trip details. See [usability update](USABILITY-UPDATE.md) for implemented work, practical next steps and verification limits.
