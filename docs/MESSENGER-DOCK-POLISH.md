# Messenger dock and appearance polish — 13 October 2026

The mobile pill is visible above the Messages inbox. Selecting a conversation slides it below the viewport; closing the conversation restores it. Hidden navigation is inert and removed from accessibility navigation. Inbox space clears the dock and phone safe area. Presence tracking handles nested demo and native messenger frames without one frame incorrectly restoring navigation while another conversation remains open. Desktop messaging behavior remains intact.

Appearance uses a compact System / Light / Dark preview panel with native radio semantics and a selected check. It supports keyboard selection, Escape, outside dismissal and focus restoration. The setting is also available in the inbox header. Same-tab controls stay synchronized; device-following, browser persistence, cross-tab updates and pre-paint theme restoration remain intact. Home now shares the dock's active accent and surface treatment instead of adding a second filled color.

Validation includes appearance selection/persistence, panel dismissal, focus, nested chat presence, hidden-dock accessibility, restoration and listener cleanup. Messaging, voice gestures, calendar, reports, planner and permission regression suites are retained. Phone/browser pixel and gesture verification remains unavailable in this managed environment.

Further visual priorities for owner feedback:
- Make search, filters and reset actions visually consistent across calendar, inbox and reports.
- Refine empty and loading states with useful next actions and quiet, consistent illustrations.
- Reduce repeated secondary labels and align page heading/action spacing.
- Use one hierarchy for selected, unread, urgent and completed states across widgets.
- Verify contrast, blur and keyboard transitions on the owner's actual phone before stronger glass effects or additional motion.
