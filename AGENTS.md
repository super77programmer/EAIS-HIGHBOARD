# School app visual contract

The owner explicitly requires the existing warm orange/coral theme to remain unchanged unless they explicitly request a theme change. Preserve `app/light.css`, the warm identity, rounded styling and the navigation from before the Google Classroom-style redesign. Do not import `app/school-app.css` or replace the navigation with that redesign.

The desired presentation is the latest daily homepage and short GSAP entrance sequence from immediately before the redesign (`b9dc33a`), with subsequent functional and security fixes retained. Do not roll back to the early logo landing page, spotlight dashboard, glance cards or week strip from 5 October.

Add features and animations within this visual identity. Preserve reduced-motion handling, keyboard Escape dismissal without a visible skip button (owner request), a timeout if animation loading fails and no repeat entrance when switching pages. Keep roles and permissions enforced on the server.

Publish authorised updates and sync them to the existing GitHub repository, as requested by the owner.

The owner requested full guided onboarding and removal of the standalone Workspace navigation page on 8 October. Keep announcements on Home and staff publishing/timetable tools on the staff Home. Messages must always offer an exit to Home and open to a recipient chooser.

On 11 October the owner requested an announcement-first, more visual daily experience and removal of layout choices from Home. Keep `app/school-life.css` and the combined `SchoolUpdates` feed. New announcements always lead Home; interest choices belong in profile/onboarding. Preserve the compact page headings and direct Share an idea form action rather than restoring duplicated slogans or Home statistic blocks.

The owner requested WhatsApp-style messaging ergonomics on 11 October: one compact conversation header on mobile, a rounded input with emoji/attachment/camera controls, a separate circular mic that becomes Send with content, compact bubbles and date markers. Keep the High Board warm coral theme, school privacy controls and recipient chooser. Always expose Back and Home in a mobile conversation. Do not add extra composer toolbars or duplicate headers.

The owner requested WhatsApp voice gestures and clearer teacher selection on 12 October: hold/release records and sends, swipe up locks, slide left cancels, locked recording supports pause/resume and preview. Preserve keyboard-accessible recording, pending-permission cancellation, microphone cleanup and no unintended sends. Use the shared VoiceRecorder in native and demo chats. Recipient selection must use authorized peer emails for direct reopening, never ambiguous display-name matching.

Preserve the shared VoiceMessage player and measured microphone waveform: volume bars come from actual microphone/audio data, never random animation. Keep adaptive draft height, explicit error feedback, filter recovery and keyboard-contained guidance. Do not restore duplicate toast timers or replace voice playback with oversized browser controls.

The owner supplied the 2026–27 parent calendar on 13 October. Preserve `SchoolCalendar`, `app/calendar.css`, the 231 source-backed records and the one-time database initialization. Keep grade scopes, date-only events, source pages, tentative dates, exclusive-end ICS exports, multi-day display and opt-in samples. Never invent exam times, trip costs or return dates from the parent calendar.

The owner requested PC-specific layout and a finished agenda ending on 13 October. Preserve `app/desktop.css`, the original navigation with desktop rail behavior, and `DayAgenda` / `dayAgenda`. Keep active/later/date-only/finished event ordering, a separate next-assessment preview, and the integrated Classroom resource ending. Do not mix tomorrow’s dates into today’s completed events or label ongoing assessment periods as next assessments.
