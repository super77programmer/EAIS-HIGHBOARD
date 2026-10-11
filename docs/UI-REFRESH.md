# School-life UI refresh — 11 October 2026

Home now starts with a combined school/class announcement feed. New updates have a preview and read indicator; pinned and unread notices are prioritized. Opening a notice keeps its position stable, while the next visit prioritizes unread notices. Search, expansion and retry are available. Read markers stay in this browser, are separate for each browsing profile/class, and become new again when content changes.

Removed the Home layout selector, repeated statistics and oversized introductory copy. Interest preferences remain in the profile/onboarding; announcements always come first. Home places the agenda and reminders before secondary school-life content on mobile. The desktop layout separates the main announcement/task feed from the agenda, deadlines, trips and canteen. Existing trip photography and warm icon treatments provide visual context. Home tasks show four entries with an option to expand.

Student Voice has one heading and one primary submission action. Share an idea opens the form immediately. Tabs support keyboard navigation and labelled panels; suggestions display their statuses. Calendar, Canteen, assessments, staff surfaces and full-screen messaging share tighter typography, spacing and warm colors. Notifications are compact, dismissible and temporary, with a neutral icon rather than a false success indicator.

The opening animation, publication permissions, class scoping and backend privacy rules remain in place. All data comes from the existing endpoints; no invented timetable or school announcement was added. Sample content remains labelled, with explanatory banners reduced to expandable notes.

Validation: ten automated suites, including actual UI actions for suggestion composition, keyboard tabs, compact task expansion, announcement aggregation, read persistence, profile separation, edits and retry. TypeScript and production build checks apply. Browser visual verification is unavailable in this environment; responsive CSS has been inspected and parsed, but actual device rendering and real school-account testing remain to be checked.
