# High Board — 100 improvement recommendations

Prepared 8 October 2026. These are proposals and refinements, not a claim that all 100 features have been implemented. The current update separately implements reversible trip interest and a protected staff collection view.

Priorities: **P0** = address before broad real-student rollout; **P1** = next practical product work; **P2** = validate demand and budget first. Priority is an implementation judgment, not a legal determination.

The app was reviewed alongside 15 Exa search results across three research workstreams (access control, accessibility, and browser performance/storage). Six selected primary-source pages were read. Recommendations below combine those baseline practices with the school’s actual workflows; they are not a claim that research proves all 100 features are necessary.

Build order: payment/permission clarity and collection operations; launch privacy/security controls; notifications and timetable imports; then larger integrations and optional features.

## Trips, registration and collection

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 1 | P1 | Payment confirmation | Let authorised collectors mark payment received, with collector identity and timestamp. |
| 2 | P1 | Separate trip statuses | Show Interested, Payment pending, Permission pending and Confirmed as separate states. |
| 3 | P1 | Registration closing dates | Give staff a configurable interest deadline separate from the payment deadline. |
| 4 | P1 | Trip capacity | Set the number of available places and enforce it atomically when confirming students. |
| 5 | P1 | Waiting lists | Keep an ordered waiting list and offer released places without double booking. |
| 6 | P1 | Guardian permission workflow | Connect trip-specific permission to the school-approved consent process rather than treating interest as permission. |
| 7 | P1 | Collection rounds | Assign a collector and collection time to each class so staff do not visit twice. |
| 8 | P1 | Restricted collection export | Provide a time-stamped staff-only print or CSV list, with access checks and spreadsheet-formula protection. |
| 9 | P1 | Trip-change notices | Tell interested students when the price, deadline, meeting point or cancellation changes. |
| 10 | P2 | Departure and return check-in | Give designated trip staff an attendance checklist for boarding and return; require a safeguarding review first. |

## Student home and discovery

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 11 | P1 | Unified task inbox | Bring pending trip actions, unread replies and relevant deadlines into one concise list. |
| 12 | P1 | My events view | Add a calendar filter showing trips and events the student has chosen to participate in. |
| 13 | P1 | Calendar search | Search events by title, category, date and location without stepping through each month. |
| 14 | P1 | Clear announcement targeting | Display the receiving class or grade beside every announcement. |
| 15 | P1 | Event bookmarks | Let students save an event privately without indicating participation or joining a collection list. |
| 16 | P1 | Deadline ordering | Prioritise approaching actionable deadlines over distant events and expired reminders. |
| 17 | P1 | Expired-content handling | Remove expired announcements from the main feed while keeping a searchable history. |
| 18 | P1 | Personal shortcut choices | Let students reorder a small set of homepage shortcuts without changing the school-wide navigation. |
| 19 | P2 | Useful empty states | Explain whether a list is empty because no content exists, filters hide it or access needs verification. |
| 20 | P2 | School activity directory | List approved clubs and activities with clear contact and joining information. |

## Teacher work and scheduling

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 21 | P1 | Canonical timetable imports | Import a school-approved timetable instead of requiring each teacher to type every session. |
| 22 | P1 | Substitution handling | Display temporary cover assignments with start/end dates and matching access changes. |
| 23 | P1 | Holiday-aware sessions | Skip recurring lessons on official closures and show the reason. |
| 24 | P1 | Timetable editing | Allow teachers to edit a saved session directly instead of deleting and recreating it. |
| 25 | P1 | Schedule exception dates | Support one-off room changes or rescheduled sessions without altering the entire weekly pattern. |
| 26 | P1 | Teacher publication templates | Provide reusable templates for trips, class parties and routine reminders. |
| 27 | P1 | Teacher message availability | Show school-approved response hours so students know when to expect a reply. |
| 28 | P1 | Class resource shelves | Organise approved documents by class and topic rather than leaving all resources inside chat history. |
| 29 | P2 | School calendar subscriptions | Offer revocable per-user calendar feeds for timetable updates; never expose a public student schedule. |
| 30 | P2 | Session reminders | Offer teacher-controlled reminders before lessons and breaks, with quiet hours. |

## High Board and publication

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 31 | P1 | Editable publication drafts | Add direct draft editing for workspace events and polls before submitting for approval. |
| 32 | P1 | Approval feedback | Let staff return a draft with a specific explanation and requested revisions. |
| 33 | P1 | Version history | Record content revisions and show who changed the publication and when. |
| 34 | P1 | Scheduled publishing | Release an approved announcement at a chosen time and expire it automatically. |
| 35 | P1 | Grade representative assignments | Define which grades each council member represents instead of relying on an undifferentiated council role. |
| 36 | P1 | Poll turnout reporting | Show participation totals against eligible audiences without publishing individual voter choices. |
| 37 | P1 | Poll result release controls | Let staff decide whether results are visible during voting or only after closure. |
| 38 | P1 | Critical announcement acknowledgement | Track receipt of essential instructions privately without turning every announcement into a compulsory action. |
| 39 | P2 | Council handover workflow | Transfer approved responsibilities between school years and revoke former members promptly. |
| 40 | P2 | School-year content archives | Separate past-year events and polls from current operations while applying retention rules. |

## Messaging and moderation

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 41 | P1 | Server push for new replies | Replace frequent polling with an authenticated real-time channel when measured traffic justifies it. |
| 42 | P1 | Notification preferences | Let users choose which classes, topics and message types can notify them. |
| 43 | P1 | Notification quiet hours | Suppress routine alerts outside chosen hours while defining any exceptional school alerts clearly. |
| 44 | P1 | Delivery state clarity | Distinguish sending, server accepted, failed and read so retries do not create confusion. |
| 45 | P1 | Cross-conversation search | Search only authorised conversations, with message snippets and direct navigation to the result. |
| 46 | P1 | Conversation organisation | Add private archive and pin controls without deleting the other participant’s messages. |
| 47 | P1 | Report case tracking | Give a report a private case number and status so the reporter can see that it was received. |
| 48 | P0 | Safeguarding escalation ownership | Assign responsible staff and response procedures for threatening or harmful messages. |
| 49 | P1 | Moderation decision review | Record reasons for removals and provide an appropriate school appeal channel. |
| 50 | P2 | Announcement-linked questions | Allow questions about an announcement to reach the assigned teacher privately rather than a public comment thread. |

## Mobile usability and accessibility

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 51 | P1 | Arabic and English interface | Translate navigation, errors and policies consistently and support right-to-left layout. |
| 52 | P1 | Keyboard-complete workflows | Verify trip responses, filters, dialogs and staff tables without a mouse. |
| 53 | P1 | Visible focus across layouts | Keep focused controls visible above sticky bars and restore focus after dialogs close. |
| 54 | P1 | Larger touch controls | Review frequently used controls for comfortable touch targets and adequate spacing. |
| 55 | P1 | Screen-reader response feedback | Announce saved responses, loading states and errors without moving focus unnecessarily. |
| 56 | P1 | Status text alongside colour | Use readable labels for pending, confirmed, cancelled and failed states, not colour alone. |
| 57 | P1 | Zoom and text scaling review | Ensure pages remain usable at 200 percent text scaling and narrow mobile widths. |
| 58 | P1 | Captioned video resources | Support captions or transcripts for teacher videos, with clear accessibility expectations. |
| 59 | P2 | Reduced-motion consistency | Make every animation respect reduced-motion preferences and avoid delaying core tasks. |
| 60 | P2 | Shared design tokens | Document spacing, typography, colours and controls in a reusable design system; Figma can mirror the implementation. |

## Privacy and responsible school operation

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 61 | P0 | Named responsible operator | Publish the actual operator and privacy contact once approved, replacing the pilot’s generic contact wording. |
| 62 | P0 | Consent evidence | Store school-approved consent records with scope, policy version and withdrawal handling. |
| 63 | P0 | Verified privacy requests | Provide authenticated access, correction and deletion requests with staff review and completion records. |
| 64 | P0 | Complete retention rules | Define and implement retention separately for chat, uploads, trip interest, schedules, reports and logs. |
| 65 | P0 | Minimal student identifiers | Use the least identifying data needed for collection; consider a school identifier only where names collide. |
| 66 | P0 | Provider and location register | Document actual storage providers, data regions and the school’s approved transfer arrangements. |
| 67 | P0 | Policy change history | Keep dated policy versions and communicate meaningful changes before they affect users. |
| 68 | P0 | Media permission records | Verify permission to publish identifiable student images or voices before any public release. |
| 69 | P0 | Optional analytics consent controls | If optional tracking is added, implement genuine consent before loading it where required. |
| 70 | P0 | Account closure workflow | Disable leavers, remove access promptly and handle retained records under the approved schedule. |

## Access control and security hardening

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 71 | P0 | Central permission definitions | Consolidate scattered role checks into a documented policy that denies unspecified operations. |
| 72 | P0 | Class revocation testing | Test every private feature after a student or teacher changes class, including downloads and old links. |
| 73 | P0 | Administrator multi-factor policy | Use the school identity provider’s MFA and security controls for privileged accounts. |
| 74 | P0 | Secure bootstrap retirement | Ensure bootstrap PIN access is permanently closed after verified administrators are established. |
| 75 | P0 | Session visibility and revocation | Let authorised users inspect and revoke their active school sessions. |
| 76 | P0 | Security header review | Deploy and test suitable content security, framing, referrer and browser-permission policies. |
| 77 | P0 | Dependency vulnerability checks | Add routine dependency checks and a defined update process for critical findings. |
| 78 | P0 | Abuse-focused rate limits | Separate limits for sign-in, messages, voting, exports and uploads to protect both usability and resources. |
| 79 | P0 | Protected operational audit trail | Record privileged changes with restricted access, retention and tamper-detection controls. |
| 80 | P0 | Secret and repository hygiene | Scan source/history for secrets and review public repository visibility and licensed assets. |

## Files, videos and storage costs

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 81 | P0 | Upload quarantine and scanning | Keep incoming files unavailable until a school-approved malware scan or equivalent review completes. |
| 82 | P1 | Upload cancellation control | Give users a visible cancel button that removes unfinished multipart data. |
| 83 | P1 | Resume after reload | Support resumable upload sessions after a browser closes, with identity checks and expiry. |
| 84 | P1 | Upload queue | Show queued files and limit parallel uploads so slow school connections stay usable. |
| 85 | P1 | Storage budget dashboard | Show stored bytes, transfer usage and estimated quota pressure to administrators. |
| 86 | P1 | Atomic quota reservations | Reserve upload allowance transactionally so concurrent requests cannot exceed account or school limits. |
| 87 | P1 | Automatic abandoned-upload cleanup | Run a scheduled cleanup for expired sessions even if the user never uploads again. |
| 88 | P1 | Optional video compression | Offer a quality/size choice before upload, keeping the original when required. |
| 89 | P2 | Private adaptive playback | Serve authorised video in suitable quality levels without publishing original student-media links. |
| 90 | P2 | Duplicate file handling | Detect duplicate uploads within an authorised scope without revealing another user’s files. |

## Performance, reliability and rollout

| # | Priority | Recommendation | Intended outcome |
|---|---|---|---|
| 91 | P1 | Measure actual loading and interaction | Track Core Web Vitals using a school-approved privacy approach before deciding where to optimise. |
| 92 | P1 | Low-bandwidth testing | Test the entire trip, chat and upload flows on throttled mobile networks and older devices. |
| 93 | P1 | Account-scoped response caching | Deduplicate reads while ensuring cached content cannot cross account boundaries. |
| 94 | P1 | Paginated collection lists | Move filtering and pagination server-side as trip and student counts grow. |
| 95 | P0 | Restore-tested backups | Create a recovery process and prove that database/file backups can restore a working service. |
| 96 | P0 | Deployment rollback drills | Verify that releases and compatible migrations can recover safely after a faulty update. |
| 97 | P1 | Error monitoring without private content | Capture technical failure context while excluding message bodies, student lists and credentials. |
| 98 | P1 | Safe offline shell | Offer installable app navigation and an explicit offline state without caching private rosters on shared devices. |
| 99 | P1 | Real-user pilot checks | Test with designated student, teacher and staff accounts before expanding to more classes. |
| 100 | P2 | Feedback and usage review | Review completion rates and recurring support issues to prioritise the next release rather than building all 100 ideas at once. |

## Research basis and limits

Access-control proposals follow OWASP’s recommendation to apply appropriate authorisation independently of sign-in and to validate permissions on requests. Upload recommendations use OWASP’s layered controls; file-header checks alone do not constitute malware scanning.

Accessibility proposals use W3C target-size and status-message guidance. The new trip buttons use a 44-pixel minimum height as a design choice; this is not a claim of complete WCAG conformance.

Performance proposals use browser performance and storage guidance. Offline storage can outlive a session or share origin storage, so a school app needs explicit account separation and safe treatment of private data. These are design inferences for High Board.

Primary sources reviewed:

- [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP: File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [W3C: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [W3C: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [web.dev: Web Vitals](https://web.dev/articles/vitals)
- [web.dev: Offline Data](https://web.dev/learn/pwa/offline-data)

School consent, permissions, account policy, staffing and hosting budgets remain decisions for the responsible school/operator. Avoid adding public class chats, public attendee names, location tracking, face recognition or behavioural rankings as default “engagement” features.
