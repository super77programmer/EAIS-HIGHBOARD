# School messaging and Home refinement

Messages now opens on assigned school contacts, with a separate recent-chat inbox, unread filter, search, and class filtering for teacher accounts. Desktop keeps inbox and conversation side by side; mobile opens one pane at a time with a back control and a persistent exit to Home.

Conversation headers, search, bubbles, file cards, voice recording, and the composer share a warm coral design. Drafts survive switching conversations and returning to Home. Voice notes can be discarded or previewed before sending. The composer follows the visual viewport for mobile keyboard resizing. Empty history is shown only after a successful load, and revoked account access clears the visible inbox. Existing authorization, private attachments, moderation, read receipts, and request deduplication remain in the server paths.

Home reminders contain actual replies, upcoming payment dates, and open polls. Generic shortcuts are no longer repeated there. The compact signed-out planner uses a single sentence and sign-in action. Home remains announcement-first without layout controls.

Verification: automated backend and interface suites, TypeScript, CSS parsing, and the production build. Real-device visual and keyboard verification is still required; no browser preview was available in this environment.

The next refinement uses familiar WhatsApp chat ergonomics in the existing High Board theme: one mobile conversation header, circular avatars, subtle school doodles on warm paper, compact message bubbles with inline receipts, and a single composer row. The microphone switches to Send when text or an attachment is present. Attachment choices include documents, photos/videos, and a device camera capture. Native message actions offer Reply, Copy, and Report through a menu or long press. Keyboard resizing preserves the latest message when the user is at the bottom, while leaving older reading positions intact.

Teacher selection now groups assigned contacts alphabetically, shows their school email, highlights recent conversations and unread replies, and opens an existing conversation directly using its authorized counterpart email. Recent chats show saved drafts. Directory search covers names and email; inbox search also covers message previews. The demo supports teacher/recents views and subject search.

Voice notes share one recorder across native messages and the demo. Hold and release sends, swipe up locks, and slide left cancels. Locked capture supports pause/resume, playback preview, manual Stop & preview, discard and send. Permission prompts, interrupted pointers, page exit, empty/short audio, size and time limits are handled without unintended sends. Capture and object URLs are cleaned up on completion or exit. Automated gesture tests use mocked media devices; physical-device swipe and microphone verification remains outstanding.
