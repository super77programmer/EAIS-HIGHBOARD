# High Board — 100 practical improvements

Updated 8 October 2026. This replaces the earlier broad wishlist. These are small, scoped recommendations, not a claim that 100 new features have been implemented. Each can use the existing app, database, private file storage or browser capabilities; none requires a new paid integration. Existing hosting/storage quotas still apply.

Already implemented: role-aware workspaces, class-targeted posts, private teacher timetable, large private media uploads, reversible trip interest, protected collection lists, designated trip contacts and private trip questions/replies. The list below proposes refinements rather than repeating those features as unfinished work.

Start with: manual collection ticks, interest deadline, meeting-point/checklist fields, draft editing and timetable editing. Implement a small batch at a time and verify it with the school.

Excluded from this plan: Visa/card gateways, online wallets, paid SMS, paid notification or analytics providers, AI assistants, GPS tracking, biometric attendance, automated guardian accounts, live video calls, multi-system timetable sync, adaptive video streaming and complex capacity/waitlist automation. Payment and guardian permission remain school-managed.

Effort is intentionally scoped: a field, filter, small form, existing API extension or UI refinement. This is not a delivery-time guarantee. Core access checks, security, backups and school privacy obligations remain necessary operational work; see [launch readiness](SCHOOL-LAUNCH-READINESS.md).

## Trips and manual collection

| # | Improvement | Small implementation scope |
|---|---|---|
| 1 | Manual payment tick box | Let authorised collectors mark cash received; keep collector and time. |
| 2 | Paper permission tick box | Record that staff received the school’s existing permission form. |
| 3 | Interest closing date | Let organisers close responses before departure. |
| 4 | Meeting point field | Show the gate, room or assembly location clearly. |
| 5 | What to bring checklist | Use a short reusable list of clothing, water and supplies. |
| 6 | Included and extra costs | Separate the trip fee from optional spending money. |
| 7 | Collection time per class | Add a simple note about when staff will visit. |
| 8 | Print collection view | Print the existing restricted list by class; no payment gateway. |
| 9 | Trip contact response hours | Show when assigned question contacts usually reply. |
| 10 | Common trip answers | Let organisers publish generic answers without student names. |

## Student home

| # | Improvement | Small implementation scope |
|---|---|---|
| 11 | My interested trips | Add a filter for trips the student currently wants to join. |
| 12 | Saved events | Save an event privately without registering interest. |
| 13 | Nearest deadline first | Order reminders by the next relevant deadline. |
| 14 | Unread update badge | Show a small count on the announcements tab. |
| 15 | Read announcement toggle | Let students mark a routine update as read. |
| 16 | Short daily summary | Show today’s events, next exam and open actions together. |
| 17 | Clear audience labels | Display the class or grade beside each update. |
| 18 | Useful empty messages | Explain why a feed or filtered list is empty. |
| 19 | School contact card | Show approved office hours and a generic school contact. |
| 20 | Simple club directory | List approved clubs, meeting times and joining instructions. |

## Calendar and events

| # | Improvement | Small implementation scope |
|---|---|---|
| 21 | Search event titles | Find a visible event by its name. |
| 22 | Trip-only calendar filter | Hide unrelated categories when looking for trips. |
| 23 | Upcoming list view | Offer a simple chronological view for small screens. |
| 24 | Jump to today | Use an obvious button to return to the current date. |
| 25 | Remember calendar view | Keep the chosen month or list view on this device. |
| 26 | Duration display | Show how long a session or event lasts. |
| 27 | Cancellation label | Make cancelled events unmistakable in every view. |
| 28 | Event details copy button | Copy public event instructions without attendee names. |
| 29 | Add event to personal calendar | Download a single .ics event; no ongoing external sync. |
| 30 | Clear Cairo time label | Label times consistently instead of relying on device timezone. |

## Teacher workspace

| # | Improvement | Small implementation scope |
|---|---|---|
| 31 | Edit saved session | Change a timetable entry without deleting and retyping it. |
| 32 | Duplicate session | Copy a lesson to another weekday. |
| 33 | Copy weekly timetable | Reuse a teacher’s own weekly entries. |
| 34 | Room shortcuts | Offer the teacher’s recently used room names. |
| 35 | Subject labels | Add a short subject tag to lessons. |
| 36 | Tomorrow preview | Show the next school day with one click. |
| 37 | Break totals | Show total break time for the selected day. |
| 38 | Print personal timetable | Print only the signed-in teacher’s timetable. |
| 39 | Routine update templates | Prefill reminders, class parties and trip instructions. |
| 40 | Teacher response hours | Add an optional school-approved availability note. |

## High Board and publishing

| # | Improvement | Small implementation scope |
|---|---|---|
| 41 | Edit draft | Change an unpublished announcement, event or poll. |
| 42 | Preview before posting | Show the title, audience and dates before submission. |
| 43 | Duplicate own draft | Reuse an organiser’s previous post as a draft. |
| 44 | Return draft with feedback | Let staff explain what needs changing before approval. |
| 45 | Approval status labels | Show Draft, Pending approval and Published plainly. |
| 46 | Pinned important update | Allow staff to pin a small number of urgent notices. |
| 47 | Announcement expiry date | Hide a notice from the main feed after its useful date. |
| 48 | Poll closing countdown | Show the remaining voting time in plain language. |
| 49 | Aggregate poll turnout | Show totals without individual student choices. |
| 50 | Owner filter | Let organisers quickly find their own posts. |

## Private messaging and suggestions

| # | Improvement | Small implementation scope |
|---|---|---|
| 51 | Search current conversation | Find text in the loaded authorised conversation. |
| 52 | Unread chats filter | Make unanswered conversations easier to find. |
| 53 | Pin own conversation | Keep a frequent contact near the top. |
| 54 | Remember draft | Keep unsent text for the current conversation during navigation. |
| 55 | Clear send failure message | Explain when a message was not accepted and offer retry. |
| 56 | Long-message line breaks | Preserve paragraphs and prevent overflowing words. |
| 57 | Attachment size before send | Show the selected file size prominently. |
| 58 | Staff reply templates | Offer editable answers for recurring routine questions. |
| 59 | Suggestion category filter | Help moderators sort the existing suggestion categories. |
| 60 | Suggestion status explanation | Explain what each moderation status means. |

## Uploads and resources

| # | Improvement | Small implementation scope |
|---|---|---|
| 61 | Visible cancel upload | Stop an unfinished upload using the existing cancellation API. |
| 62 | Friendly upload progress | Show percentage and current stage in ordinary language. |
| 63 | File type guidance | List the formats the current server accepts before selection. |
| 64 | File limit explanation | Show the existing 500 MB media and 20 MB document/image limits. |
| 65 | Low connection hint | Recommend keeping the page open when an upload is slow. |
| 66 | Download button labels | Include the document name in the accessible button label. |
| 67 | Video description field | Let teachers add a short text summary of a video. |
| 68 | Text alternative for audio | Allow the sender to include a typed summary. |
| 69 | Retry failed upload | Retry the same selected file without making the user select it again. |
| 70 | Simple storage totals | Show used file bytes from existing records to administrators. |

## Mobile and accessibility

| # | Improvement | Small implementation scope |
|---|---|---|
| 71 | Consistent button labels | Use the same wording for save, cancel and back. |
| 72 | Comfortable touch spacing | Separate frequently tapped controls on mobile. |
| 73 | Visible keyboard focus | Keep a clear focus outline on every interactive control. |
| 74 | Dialog focus return | Return keyboard focus to the button that opened a dialog. |
| 75 | Form error beside field | Place a clear validation message next to the relevant input. |
| 76 | Loading feedback | Explain when a list is still loading. |
| 77 | Screen-reader saved status | Announce successful saves without moving focus. |
| 78 | Text labels beside colours | Make statuses understandable without colour perception. |
| 79 | Text zoom review | Check all important views at 200 percent text size. |
| 80 | Reduced motion polish | Respect device motion preferences on remaining transitions. |

## Privacy and account clarity

| # | Improvement | Small implementation scope |
|---|---|---|
| 81 | Verified class badge | Distinguish the school-assigned class from a browsing preference. |
| 82 | Role explanation card | Explain the tools available to each account type. |
| 83 | Shared-device sign-out reminder | Encourage signing out after using a school/shared computer. |
| 84 | Clear local preferences | Let users remove device preferences through an explicit control. |
| 85 | Real privacy contact | Replace generic pilot wording with the approved operator contact. |
| 86 | Policy dates | Show the last update date consistently on policy pages. |
| 87 | Private question recipient label | Keep the chosen recipient obvious before sending. |
| 88 | Inactive roster filter | Help administrators find accounts already disabled. |
| 89 | Class-change confirmation | Show an administrator what access changes before saving a roster edit. |
| 90 | Permission summary | Document which roles can see each existing private record type. |

## Reliability and school rollout

| # | Improvement | Small implementation scope |
|---|---|---|
| 91 | Retry failed list loading | Add a retry button wherever a list can fail to load. |
| 92 | Offline explanation | Explain that saving requires a connection; do not cache private rosters. |
| 93 | Prevent repeat submissions | Disable submit while a request is already in progress. |
| 94 | Preserve form on failure | Keep entered text when saving fails. |
| 95 | Last refreshed time | Show when a staff collection or question list was updated. |
| 96 | Sample data labels | Keep demo trips and other examples visibly marked. |
| 97 | Short role guides | Add student, teacher and High Board help cards. |
| 98 | School pilot checklist | Try the main tasks with authorised test accounts before expansion. |
| 99 | Broken link review | Check navigation and policy links after each release. |
| 100 | Monthly feedback review | Use existing private suggestions to choose a small next batch. |
