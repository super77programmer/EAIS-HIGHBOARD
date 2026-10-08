# Onboarding, Home and Workspace update — 8 October 2026

The warm orange/coral theme and existing navigation stay in place.

Onboarding is one short form: optional first name and two class selectors. Browsing no longer requires a typed email, and profiles without an email no longer trigger repeated onboarding. A verified school account pre-fills the school class where available. Browsing preferences do not grant private access. The Google route remains separate, uses the existing verified sign-in flow, and no longer asks for a second typed name. If school Google configuration is missing, onboarding says so and still allows browsing.

The entrance retains its GSAP logo sequence. Its visible skip button has been removed at the owner's request. Automatic completion, Escape, reduced-motion handling and the five-second failure fallback remain. Navigation does not repeat the entrance.

Home now includes real event/poll/announcement counts, class-visible announcements, up to two interactive open polls and a canteen preview. Announcement dates, pinned state and descriptions are displayed. Empty states use honest copy. The existing current/next event, upcoming assessment, trip participation and private-reply notices remain.

Workspace now distinguishes verified school accounts from browsing profiles and the outer website session. It shows the school role, assigned class(es), waiting-for-assignment instructions, useful navigation and a substantive empty state. Network errors have a retry action and timeout; session changes refresh the view, and older responses cannot overwrite newer account state.

A server-side filtering issue prevented accounts without assigned classes from seeing any all-school posts. Unassigned accounts can now read unrestricted global posts. Class-targeted or exclusion-scoped posts still require assigned audience membership. Verified account status never supplies publishing permission by itself.

Validation covers the single-screen onboarding, entrance dismissal/automatic completion/reduced motion, Home controls and poll rendering, student Workspace empty state, unassigned global access, class/exclusion privacy, existing trip/message flows and the 80 MB multipart upload simulation. Real school OAuth configuration and roster assignment remain school-admin responsibilities. This update does not certify browser visual quality or complete production legal readiness.

The signed-in student/council board now uses the roster class instead of an older local browsing selection. This prevents a stale preference from hiding authorised class posts; the verified class is also shown in the account header. Tests confirm that changing local class parameters neither hides the pupil's own published class update nor reveals another class's update.
