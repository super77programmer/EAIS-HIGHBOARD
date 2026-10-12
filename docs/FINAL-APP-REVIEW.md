# App file review

Reviewed 253 tracked and new files. Every file was read by the structural audit; the table records the applicable check. This is a static inventory and syntax review, supplemented by TypeScript, a production build, and functional tests. It is not a claim that every possible behavior has been verified.

## Functional review

- Teacher messaging: authorized recipient selection, private attachments, draft retention, keyboard layout, hold/release, upward lock, left cancellation, pause/resume, time limits and microphone cleanup.
- Voice playback: compact controls, measured waveform after first playback, seeking and three playback speeds. Decoding is bounded to 20 MB, aborts on unmount, and stores no private audio cache. Larger audio plays without waveform decoding.
- Backend: school identity, role/class authorization, CSRF, moderation, deduplicated sends, file signatures, multipart upload cancellation, trip interest and private questions, planner revisions, publishing and timetable conflicts.
- Messaging refresh improvement: older paginated chats are pruned when their authorized peer disappears; a removed selection returns to the inbox instead of leaving a blank mobile conversation.
- Board API improvement: streamed bodies are bounded to 16,000 bytes even without Content-Length.
- Existing theme, intro, announcement-first Home and navigation remain in use. Alternate design experiments and unused component primitives were inventoried and preserved.

## Verification limits

Real-device microphone permissions, codec decoding, visual appearance, mobile keyboard behavior and gesture feel still require a phone/browser check. Static analysis cannot establish complete security or production readiness. Existing school-launch requirements in SCHOOL-LAUNCH-READINESS.md still apply.

## File inventory

| File | Bytes | Check |
| --- | ---: | --- |
| `.gitignore` | 652 | Read / inventory |
| `.npmrc` | 45 | Read / inventory |
| `.openai/hosting.json` | 93 | JSON structure |
| `AGENTS.md` | 3468 | Read / inventory |
| `DOWNLOAD-AND-RUN.md` | 2947 | Read / inventory |
| `README.md` | 10120 | Read / inventory |
| `app/api/attachments/route.ts` | 4142 | Syntax / source scan |
| `app/api/board/route.ts` | 13587 | Syntax / source scan |
| `app/api/community/route.ts` | 22559 | Syntax / source scan |
| `app/api/media-upload/route.ts` | 5522 | Syntax / source scan |
| `app/api/planner/route.ts` | 4033 | Syntax / source scan |
| `app/api/school-auth/route.ts` | 4664 | Syntax / source scan |
| `app/api/trip-questions/route.ts` | 5536 | Syntax / source scan |
| `app/api/trips/route.ts` | 6996 | Syntax / source scan |
| `app/api/workspace/route.ts` | 10848 | Syntax / source scan |
| `app/calendar.css` | 11509 | CSS structure |
| `app/chatgpt-auth.ts` | 2550 | Syntax / source scan |
| `app/community.css` | 32998 | CSS structure |
| `app/completion.css` | 4270 | CSS structure |
| `app/cookies/page.tsx` | 2047 | Syntax / source scan |
| `app/core-release.css` | 9040 | CSS structure |
| `app/experience.css` | 9781 | CSS structure |
| `app/globals.css` | 23704 | CSS structure |
| `app/home.css` | 9719 | CSS structure |
| `app/layout.tsx` | 952 | Syntax / source scan |
| `app/light.css` | 67153 | CSS structure |
| `app/messaging.css` | 52875 | CSS structure |
| `app/motion.css` | 1811 | CSS structure |
| `app/page.tsx` | 45942 | Syntax / source scan |
| `app/privacy/page.tsx` | 6065 | Syntax / source scan |
| `app/redesign.css` | 53349 | CSS structure |
| `app/school-app.css` | 13593 | CSS structure |
| `app/school-life.css` | 25704 | CSS structure |
| `app/terms/page.tsx` | 2831 | Syntax / source scan |
| `app/trips.css` | 2957 | CSS structure |
| `app/usability.css` | 3383 | CSS structure |
| `app/warm-utilities.css` | 1510 | CSS structure |
| `app/workspace.css` | 1597 | CSS structure |
| `build/connector-preview-plugin.mjs` | 7211 | Read / inventory |
| `build/connector-preview-worker.mjs` | 594 | Read / inventory |
| `build/sites-vite-plugin.LICENSE` | 1063 | Read / inventory |
| `build/sites-vite-plugin.ts` | 7185 | Syntax / source scan |
| `build/sites-worker.ts` | 1279 | Syntax / source scan |
| `cloudflare-env.d.ts` | 99 | Syntax / source scan |
| `components.json` | 420 | JSON structure |
| `components/AppNavigation.tsx` | 3450 | Syntax / source scan |
| `components/AppTutorial.tsx` | 4854 | Syntax / source scan |
| `components/ChatComposer.tsx` | 5351 | Syntax / source scan |
| `components/ChatDemo.tsx` | 13681 | Syntax / source scan |
| `components/Community.tsx` | 42756 | Syntax / source scan |
| `components/ConnectionStatus.tsx` | 612 | Syntax / source scan |
| `components/FeedbackToast.tsx` | 1489 | Syntax / source scan |
| `components/FileAttachment.tsx` | 4584 | Syntax / source scan |
| `components/HomeFocusPicker.tsx` | 854 | Syntax / source scan |
| `components/HomeOverview.tsx` | 9431 | Syntax / source scan |
| `components/Motion.tsx` | 12997 | Syntax / source scan |
| `components/Planner.tsx` | 8049 | Syntax / source scan |
| `components/PublishingEditor.tsx` | 5454 | Syntax / source scan |
| `components/Reliability.tsx` | 7429 | Syntax / source scan |
| `components/SchoolCalendar.tsx` | 10996 | Syntax / source scan |
| `components/SchoolMessenger.tsx` | 11862 | Syntax / source scan |
| `components/SchoolUpdates.tsx` | 5699 | Syntax / source scan |
| `components/TripCollection.tsx` | 5772 | Syntax / source scan |
| `components/TripInterest.tsx` | 3316 | Syntax / source scan |
| `components/TripQuestions.tsx` | 7578 | Syntax / source scan |
| `components/VoiceMessage.tsx` | 5132 | Syntax / source scan |
| `components/VoiceRecorder.tsx` | 11591 | Syntax / source scan |
| `components/Workspace.tsx` | 12292 | Syntax / source scan |
| `components/connector-error.tsx` | 1082 | Syntax / source scan |
| `components/ui/accordion.tsx` | 2048 | Syntax / source scan |
| `components/ui/alert-dialog.tsx` | 5439 | Syntax / source scan |
| `components/ui/alert.tsx` | 1614 | Syntax / source scan |
| `components/ui/aspect-ratio.tsx` | 274 | Syntax / source scan |
| `components/ui/attachment.tsx` | 6002 | Syntax / source scan |
| `components/ui/avatar.tsx` | 2916 | Syntax / source scan |
| `components/ui/badge.tsx` | 1776 | Syntax / source scan |
| `components/ui/breadcrumb.tsx` | 2350 | Syntax / source scan |
| `components/ui/bubble.tsx` | 4699 | Syntax / source scan |
| `components/ui/button-group.tsx` | 2202 | Syntax / source scan |
| `components/ui/button.tsx` | 2392 | Syntax / source scan |
| `components/ui/calendar.tsx` | 7832 | Syntax / source scan |
| `components/ui/card.tsx` | 1987 | Syntax / source scan |
| `components/ui/carousel.tsx` | 5556 | Syntax / source scan |
| `components/ui/chart.tsx` | 10614 | Syntax / source scan |
| `components/ui/checkbox.tsx` | 1214 | Syntax / source scan |
| `components/ui/collapsible.tsx` | 795 | Syntax / source scan |
| `components/ui/combobox.tsx` | 9158 | Syntax / source scan |
| `components/ui/command.tsx` | 4818 | Syntax / source scan |
| `components/ui/context-menu.tsx` | 8268 | Syntax / source scan |
| `components/ui/dialog.tsx` | 4303 | Syntax / source scan |
| `components/ui/direction.tsx` | 506 | Syntax / source scan |
| `components/ui/drawer.tsx` | 4255 | Syntax / source scan |
| `components/ui/dropdown-menu.tsx` | 8418 | Syntax / source scan |
| `components/ui/empty.tsx` | 2396 | Syntax / source scan |
| `components/ui/field.tsx` | 6159 | Syntax / source scan |
| `components/ui/form.tsx` | 3757 | Syntax / source scan |
| `components/ui/hover-card.tsx` | 1526 | Syntax / source scan |
| `components/ui/input-group.tsx` | 5065 | Syntax / source scan |
| `components/ui/input-otp.tsx` | 2254 | Syntax / source scan |
| `components/ui/input.tsx` | 962 | Syntax / source scan |
| `components/ui/item.tsx` | 4486 | Syntax / source scan |
| `components/ui/kbd.tsx` | 862 | Syntax / source scan |
| `components/ui/label.tsx` | 606 | Syntax / source scan |
| `components/ui/marker.tsx` | 1864 | Syntax / source scan |
| `components/ui/menubar.tsx` | 8389 | Syntax / source scan |
| `components/ui/message-scroller.tsx` | 3992 | Syntax / source scan |
| `components/ui/message.tsx` | 2232 | Syntax / source scan |
| `components/ui/native-select.tsx` | 1995 | Syntax / source scan |
| `components/ui/navigation-menu.tsx` | 6658 | Syntax / source scan |
| `components/ui/pagination.tsx` | 2717 | Syntax / source scan |
| `components/ui/popover.tsx` | 2357 | Syntax / source scan |
| `components/ui/progress.tsx` | 755 | Syntax / source scan |
| `components/ui/radio-group.tsx` | 1460 | Syntax / source scan |
| `components/ui/resizable.tsx` | 1815 | Syntax / source scan |
| `components/ui/scroll-area.tsx` | 1639 | Syntax / source scan |
| `components/ui/select.tsx` | 6353 | Syntax / source scan |
| `components/ui/separator.tsx` | 694 | Syntax / source scan |
| `components/ui/sheet.tsx` | 4188 | Syntax / source scan |
| `components/ui/sidebar.tsx` | 21526 | Syntax / source scan |
| `components/ui/skeleton.tsx` | 276 | Syntax / source scan |
| `components/ui/slider.tsx` | 1991 | Syntax / source scan |
| `components/ui/sonner.tsx` | 1034 | Syntax / source scan |
| `components/ui/spinner.tsx` | 331 | Syntax / source scan |
| `components/ui/switch.tsx` | 1408 | Syntax / source scan |
| `components/ui/table.tsx` | 2478 | Syntax / source scan |
| `components/ui/tabs.tsx` | 3782 | Syntax / source scan |
| `components/ui/textarea.tsx` | 759 | Syntax / source scan |
| `components/ui/toggle-group.tsx` | 2308 | Syntax / source scan |
| `components/ui/toggle.tsx` | 1565 | Syntax / source scan |
| `components/ui/tooltip.tsx` | 1830 | Syntax / source scan |
| `db/index.ts` | 423 | Syntax / source scan |
| `db/schema.ts` | 6592 | Syntax / source scan |
| `design-lab/README.md` | 399 | Read / inventory |
| `design-lab/brand/eais-charcoal.svg` | 1066 | SVG structure / script scan |
| `design-lab/index.html` | 43780 | Read / inventory |
| `design/README.md` | 1523 | Read / inventory |
| `docs/100-IMPROVEMENTS.md` | 11271 | Read / inventory |
| `docs/AUTHENTICATION-AND-MOTION.md` | 5426 | Read / inventory |
| `docs/COMMUNICATIONS.md` | 6618 | Read / inventory |
| `docs/COMPLETION-UPDATE.md` | 3255 | Read / inventory |
| `docs/FINAL-APP-REVIEW.md` | 17105 | Read / inventory |
| `docs/FINAL-UI-POLISH.md` | 1681 | Read / inventory |
| `docs/MESSAGING-UPDATE.md` | 2902 | Read / inventory |
| `docs/ONBOARDING-HOME-WORKSPACE.md` | 2794 | Read / inventory |
| `docs/PRODUCT-ROADMAP.md` | 3826 | Read / inventory |
| `docs/SCHOOL-CALENDAR-IMPORT.md` | 3058 | Read / inventory |
| `docs/SCHOOL-LAUNCH-READINESS.md` | 5915 | Read / inventory |
| `docs/TRIP-INTEREST.md` | 2286 | Read / inventory |
| `docs/TRIP-QUESTIONS.md` | 2309 | Read / inventory |
| `docs/UI-REFRESH.md` | 2136 | Read / inventory |
| `docs/USABILITY-UPDATE.md` | 3394 | Read / inventory |
| `docs/WARM-DESIGN-BASELINE.md` | 1750 | Read / inventory |
| `drizzle.config.ts` | 148 | Syntax / source scan |
| `drizzle/0000_long_squadron_supreme.sql` | 436 | SQL read; execution covered by backend suites |
| `drizzle/0001_parallel_sentry.sql` | 1700 | SQL read; execution covered by backend suites |
| `drizzle/0002_useful_wasp.sql` | 436 | SQL read; execution covered by backend suites |
| `drizzle/0003_legal_boom_boom.sql` | 785 | SQL read; execution covered by backend suites |
| `drizzle/0004_rare_puck.sql` | 68 | SQL read; execution covered by backend suites |
| `drizzle/0005_little_firebrand.sql` | 578 | SQL read; execution covered by backend suites |
| `drizzle/0006_little_wilson_fisk.sql` | 283 | SQL read; execution covered by backend suites |
| `drizzle/0007_thin_hydra.sql` | 682 | SQL read; execution covered by backend suites |
| `drizzle/0008_lush_wind_dancer.sql` | 77 | SQL read; execution covered by backend suites |
| `drizzle/0009_tense_speed.sql` | 416 | SQL read; execution covered by backend suites |
| `drizzle/0010_pale_black_widow.sql` | 848 | SQL read; execution covered by backend suites |
| `drizzle/meta/0000_snapshot.json` | 2876 | JSON structure |
| `drizzle/meta/0001_snapshot.json` | 12577 | JSON structure |
| `drizzle/meta/0002_snapshot.json` | 13475 | JSON structure |
| `drizzle/meta/0003_snapshot.json` | 17047 | JSON structure |
| `drizzle/meta/0004_snapshot.json` | 17254 | JSON structure |
| `drizzle/meta/0005_snapshot.json` | 20744 | JSON structure |
| `drizzle/meta/0006_snapshot.json` | 22213 | JSON structure |
| `drizzle/meta/0007_snapshot.json` | 25168 | JSON structure |
| `drizzle/meta/0008_snapshot.json` | 25354 | JSON structure |
| `drizzle/meta/0009_snapshot.json` | 26880 | JSON structure |
| `drizzle/meta/0010_snapshot.json` | 31179 | JSON structure |
| `drizzle/meta/_journal.json` | 1629 | JSON structure |
| `eslint.config.mjs` | 846 | Read / inventory |
| `examples/d1/app/api/notes/route.ts` | 1700 | Syntax / source scan |
| `examples/d1/db/schema.ts` | 370 | Syntax / source scan |
| `hooks/use-mobile.ts` | 565 | Syntax / source scan |
| `lib/admin-auth.ts` | 1486 | Syntax / source scan |
| `lib/board.ts` | 4033 | Syntax / source scan |
| `lib/calendar.ts` | 1827 | Syntax / source scan |
| `lib/communications.ts` | 5439 | Syntax / source scan |
| `lib/community-client.ts` | 1862 | Syntax / source scan |
| `lib/connector-context.ts` | 612 | Syntax / source scan |
| `lib/connector-contract.mts` | 5362 | Syntax / source scan |
| `lib/connector-errors.mts` | 2717 | Syntax / source scan |
| `lib/connector-preview.d.ts` | 433 | Syntax / source scan |
| `lib/connectors.ts` | 416 | Syntax / source scan |
| `lib/db.ts` | 336 | Syntax / source scan |
| `lib/file-validation.ts` | 3263 | Syntax / source scan |
| `lib/home-focus.ts` | 839 | Syntax / source scan |
| `lib/logo-paths.ts` | 831 | Syntax / source scan |
| `lib/media-client.ts` | 1451 | Syntax / source scan |
| `lib/moderation.ts` | 1956 | Syntax / source scan |
| `lib/motion.ts` | 1975 | Syntax / source scan |
| `lib/school-calendar-data.json` | 153921 | JSON structure |
| `lib/school-time.ts` | 1183 | Syntax / source scan |
| `lib/trip-client.ts` | 163 | Syntax / source scan |
| `lib/trip-questions.ts` | 1991 | Syntax / source scan |
| `lib/trips.ts` | 665 | Syntax / source scan |
| `lib/utils.ts` | 177 | Syntax / source scan |
| `next.config.ts` | 133 | Syntax / source scan |
| `package.json` | 2276 | JSON structure |
| `pnpm-lock.yaml` | 356274 | Read / inventory |
| `pnpm-workspace.yaml` | 736 | Read / inventory |
| `postcss.config.mjs` | 94 | Read / inventory |
| `public/brand/eais-charcoal.svg` | 1066 | SVG structure / script scan |
| `public/brand/eais-white.svg` | 1057 | SVG structure / script scan |
| `public/brand/eais.svg` | 1066 | SVG structure / script scan |
| `public/chat-paper.svg` | 751 | SVG structure / script scan |
| `public/favicon.svg` | 1066 | SVG structure / script scan |
| `public/file.svg` | 392 | SVG structure / script scan |
| `public/globe.svg` | 1036 | SVG structure / script scan |
| `public/images/wadi-el-rayan.jpg` | 1083782 | Binary format |
| `public/vendor/ScrollTrigger.min.js` | 43380 | Syntax / source scan |
| `public/vendor/gsap.min.js` | 72214 | Syntax / source scan |
| `public/window.svg` | 386 | SVG structure / script scan |
| `scripts/audit-files.mjs` | 4305 | Read / inventory |
| `scripts/build-verified.sh` | 661 | Shell syntax |
| `scripts/connector-preview/connector-preview-session.mjs` | 6842 | Read / inventory |
| `scripts/connector-preview/host-binding.mjs` | 7793 | Read / inventory |
| `scripts/connector-preview/protocol.mjs` | 1781 | Read / inventory |
| `scripts/execution-profile.mjs` | 624 | Read / inventory |
| `scripts/install-ci.mjs` | 1685 | Read / inventory |
| `scripts/install-ci.sh` | 6783 | Shell syntax |
| `scripts/install-pnpm.sh` | 9015 | Shell syntax |
| `scripts/npm-install.mjs` | 7025 | Read / inventory |
| `scripts/pnpm-install.mjs` | 10633 | Read / inventory |
| `scripts/run-framework.mjs` | 993 | Read / inventory |
| `scripts/sites-env.mjs` | 906 | Read / inventory |
| `scripts/sites-env.sh` | 1530 | Shell syntax |
| `scripts/test.mjs` | 565 | Read / inventory |
| `tests/calendar.cjs` | 6124 | Read / inventory |
| `tests/chat-composer.cjs` | 6557 | Read / inventory |
| `tests/communications.cjs` | 27242 | Read / inventory |
| `tests/community-cache.cjs` | 1800 | Read / inventory |
| `tests/completion.cjs` | 14780 | Read / inventory |
| `tests/feedback-toast.cjs` | 4486 | Read / inventory |
| `tests/interface.cjs` | 41228 | Read / inventory |
| `tests/intro.cjs` | 4368 | Read / inventory |
| `tests/media-cancel.cjs` | 2134 | Read / inventory |
| `tests/school-ui.cjs` | 5375 | Read / inventory |
| `tests/trip-interest.cjs` | 8702 | Read / inventory |
| `tests/trip-questions.cjs` | 8780 | Read / inventory |
| `tests/voice-message.cjs` | 4155 | Read / inventory |
| `tests/voice-recorder.cjs` | 8133 | Read / inventory |
| `tests/workspace-media.cjs` | 10986 | Read / inventory |
| `tsconfig.json` | 800 | JSON structure |
| `vendor/shadcn-tailwind-4.13.0.LICENSE.md` | 1063 | Read / inventory |
| `vendor/shadcn-tailwind-4.13.0.css` | 16041 | CSS structure |
| `vite.config.ts` | 3115 | Syntax / source scan |

## Structural findings

No structural failures found.
