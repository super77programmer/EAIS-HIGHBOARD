# Authentication and motion update — 8 October 2026

## Implemented protection

Google Identity Services credentials are verified on the server against Google's signing keys. Signature, issuer, audience, expiry, issuance time, subject, verified email and the `els-egypt.info` hosted domain are checked. The browser's account hints and locally saved profile never assign authority.

Sign-in challenges last ten minutes, are stored only as SHA-256 hashes, and are consumed with an atomic database deletion. Expired, reused and concurrently replayed challenges fail. Beginning sign-in again invalidates the previous challenge for that browser.

The school roster remains the source of roles and class assignments. Google subjects are bound to roster email addresses on their first verified login. Another Google account subsequently using that email cannot inherit access. New verified school accounts receive the student role and no class assignment. An administrator must assign the class. If the school deliberately recreates or renames a Google account, an administrator must review the identity and migrate its binding; changing the address must not automatically transfer historical messages or privileges.

Sessions use random 256-bit tokens; only hashes are stored in the private database. Cookies have HttpOnly, Secure and SameSite=Lax attributes and a one-day lifetime. Tokens are not stored in localStorage. Signing in replaces and revokes that browser's prior school session. Signing out revokes the current school session and clears the school, bootstrap administrator and sign-in challenge cookies. Existing sign-out also forgets the anonymous guest identity when requested. Other devices retain their own sessions until expiry or school revocation.

Google sign-in allows at most 20 requests per client IP per minute, including malformed bodies. Excess attempts return HTTP 429 with Retry-After: 60. Shared school networks share that allowance; monitor before rollout and adjust conservatively if it blocks legitimate classes. The temporary bootstrap PIN has a separate five-attempt, fifteen-minute limit. It is disabled after the first roster-approved administrator signs in with Google; the school can also close bootstrap access in configuration.

All changes require the correct same-origin request. Privileged endpoints verify server-side sessions and current roster permissions. Front-end controls only reflect those permissions. Existing private file downloads and trip collection lists retain their access checks.

## School-owned Google setup still required

1. In the school's Google Cloud project, create or reuse an OAuth web client. Authorize the exact origin `https://high-board-student-life.ahmedramy-713.chatgpt.site` and any separately approved custom origin.
2. Configure the app branding, audience and support contact. The school should review Google Workspace app-access and under-18 restrictions before pupils use it. This integration requests identity, not access to Drive, Classroom or Gmail.
3. Enter the public OAuth client ID in the app's administrator Google configuration. A Google client secret is not required for this GIS callback flow. Do not put secrets or real school rosters in GitHub.
4. Approve the administrator roster entry and test sign-in with actual administrator, teacher and pupil accounts on the deployed origin. A local test signing key verifies our handling; it does not establish the school's live Google configuration.
5. The Workspace administrator must allow and enforce Google's two-step verification policy for the intended school groups, with suitable enrolment/recovery arrangements. Google sign-in alone does not prove that a second factor was used. The app does not display an unverified “2FA enabled” badge. Signed-in users can open Google's account security page from the chat account menu.

Sources:
- https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
- https://support.google.com/a/answer/175197

## Motion and usability

Pages and dialogs enter in 240 ms; controls respond in 120 ms. Announcement expansion, menus, progress bars and feedback use the same short motion rhythm. Polls and ratings use smooth easing rather than elastic overshoot. Card reveals do not replay on every refresh. Button presses use CSS instead of a document-wide animation listener.

GSAP and ScrollTrigger load from this app's own assets; there is no third-party CDN fallback. Reduced-motion users do not load these animation scripts and CSS animations are disabled. If animation assets fail, the interface remains visible and functional. Google sign-in still necessarily uses Google's script and public signing keys.

## Validation and limits

TypeScript, real route handlers against in-memory SQLite, interface interactions, trip privacy tests and the simulated 80 MB multipart upload flow pass. Authentication checks include expired/replayed/concurrent challenges, account binding, session rotation, logout revocation, malformed-request throttling, cookie attributes and cross-origin rejection.

These checks do not substitute for live school Google sign-in, browser visual review, penetration testing, restore-tested backups or school legal approval. Existing launch-readiness requirements still apply. The deployment remains private to its current audience.
