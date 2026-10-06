# Communications rollout

The live domain remains owner-private for review. No school-wide access change has been made. Site sharing must be configured separately before students or teachers can visit.

Teacher chat, private suggestions and council polls are together under Student voice (Small voices. Big changes.). Onboarding collects a local name and school email; this is not a verified identity.

## Activate school Google sign-in

1. Ask the school's Google Workspace/Cloud administrator to create a **Web application** OAuth client for High Board, with the school's consent configuration.
2. Add `https://high-board-student-life.astrecsehd.chatgpt.site` as an **Authorized JavaScript origin**. This implementation uses Google Identity Services' popup credential callback; it does not need an OAuth client secret.
3. Open High Board → Admin login → council desk → **Google sign-in & language filter**. Paste the client ID ending in `.apps.googleusercontent.com` and save.
4. In **School roster & teacher assignments**, enter each teacher's email, display name and classes taught (e.g. `8A, 8B`). Enter student school email/name/class, and grant council/staff roles only to authorized people. New verified accounts default to student with no assigned class and cannot start conversations until assigned.
5. Test with actual school student and teacher accounts. The server verifies Google's JWT signature, issuer, audience, expiry, nonce, email verification and exact hosted domain `els-egypt.info`.

Google reference: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

## Administrator activation

The setup PIN uses a separate random SESSION_SECRET for signed sessions. Add an `administrator` school account individually in the roster, configure Google sign-in, then sign in successfully with that administrator account. Successful verification disables the shared setup PIN. At least one enabled administrator must remain. The settings and account changes are recorded in the activity log.

## Roles and privacy

- Students/council members can initiate chats only with teachers/staff assigned to their roster class. Self-selected dashboard grade/class does not grant message access.
- Teachers see their own conversations. Disabling an account or removing an assignment prevents further access, including attachments.
- Council/staff can handle suggestions. Only staff/administrators can publish announcements and review reported teacher-chat text and attachments. Council publication requests are saved as Pending approval. No moderator can browse an entire unrelated teacher conversation.
- Suggestions can be anonymous or carry a self-supplied name. Names on suggestions are not verified identities.
- Suggestions live in D1. A private HttpOnly cookie grants access to the submitter's inbox on that browser for up to one year. Anonymous inboxes have optional secret recovery codes. Codes grant access to the whole anonymous inbox and must be saved privately. Named suggestions submitted while signed in also link to that verified school account. Signing out offers to forget anonymous browser access; recovery codes still restore it. Google sessions last one day.
- Private decisions are not public announcements. Staff explicitly compose a separate announcement addressed to all grades.
- Canteen requests also become private suggestions, with replies in Student voice.

## Media and moderation

Messages support 20 MB image, video, audio, PDF and Office-document uploads. A microphone recording stops after two minutes and can be previewed/discarded before sending. Files use private R2 storage, signature/type checks, and permission-checked delivery. Office documents are decompressed within limits and checked for required structure, macros, embedded programs and external relationships. PDFs with recognized active-content markers are rejected. These structural checks are not antivirus; no external malware scanner is connected.

English, Arabic and Franco-Arabic text checks normalize common variations and block sending while preserving drafts. Additional terms and allowed exceptions are configurable. Filtering is best-effort, not a guarantee of detecting every insult or contextual meaning. Audio/video/image/document contents are not language-filtered. Reports provide a human review path.

Admins can choose retention for closed suggestions (disabled by default, or 90/180/365 days), preview eligible records and explicitly confirm cleanup. Open suggestions and teacher-chat histories are preserved. Cleanup also removes abandoned uploads older than 24 hours; expired sessions are cleaned as new sessions are created. No email/push notifications are sent; unread reply cards and open inboxes refresh periodically and pause in background tabs.

## Validation

`node tests/communications.cjs` exercises real API handlers against temporary SQLite/R2 stand-ins, including cross-user privacy, roster authorization, status replies, announcements, moderation, private files, reports and signed Google JWT validation with test keys. Test accounts and keys never seed production.

`node node_modules/typescript/bin/tsc --noEmit` checks types. Build with the Sites build workflow.

## Reliability features

- Message text drafts use sessionStorage; selected attachments remain in memory across conversation navigation on the same page. Reloading loses unsent file selections. Stable request IDs make text/file message retries idempotent.
- Verified polls use the school account and roster class; informal polls remain explicitly device-based. Poll choices cannot change after votes exist.
- Events, polls and dated menus support drafts, editing, archiving; events also support cancellation. Canteen availability can be marked `sold out` in the fourth menu column.
- Announcements support drafts, staff approval, publishing, editing, pins, expiry, and search. Recovery does not automatically publish private suggestions.
- School rosters can be imported from spreadsheet cells with a preview. Administrator accounts must be edited individually.
- Suggestion categories, assignments and internal notes support council follow-up. Internal notes are not shown in the student's thread.
- Home can be switched to a compact view while keeping the EAIS animation available.

`node tests/interface.cjs` covers navigation, GSAP cleanup, drafts, suggestion submission, recovery controls, admin tools and onboarding in a DOM environment. Real school Google sign-in and microphone/camera/upload playback on school devices still need a pilot. No production test accounts were seeded.
