# Final UI and interaction polish — 12 October 2026

- Native and demo message inputs grow with the draft, cap at 128 px, shrink when cleared and preserve the latest-message position. Long attachment names wrap; audio previews sit on their own row.
- Success, warning and error notifications have distinct icons and accessible roles. Success/warning dismissal pauses during keyboard focus or while the tab is hidden. Errors remain until explicitly dismissed. Duplicate page-level dismissal timers were removed.
- Empty chat filters can reset to all chats. Contact search also matches class and role. Planner errors offer Retry; empty task searches offer Clear search. Completed tasks announce Reopen rather than Complete.
- Decoded audio supplies duration for voice notes whose browser metadata is infinite, enabling seeking. Replay starts at the beginning, playback speed resets for a different source, and waveform downloads have a timeout.
- The six-step guide follows the announcement-first Home and explains hold, upward lock and left cancellation. Its dialog contains keyboard focus, skips disabled controls and scrolls within short screens. Main page landmarks have meaningful labels; regular modal focus loops also skip disabled fields.
- All work preserves the warm theme, original navigation, server authorization and private publication audience.

Validation includes TypeScript, structural file checks, production packaging and the complete functional suite. Device-specific microphone permissions, codec support, appearance, keyboard positioning and gesture feel still need real-device testing; these automated checks do not establish complete production readiness.
