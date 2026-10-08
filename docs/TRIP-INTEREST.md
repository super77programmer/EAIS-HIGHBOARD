# Trip interest and collection

Students open a published trip from the homepage or calendar and choose **I want to go** or **I do not want to go**. A verified school student/council account with a school-assigned eligible class is required. The server uses the signed-in identity; it ignores client-supplied student names, classes or other account IDs.

One current response is stored per trip/account. Choosing again replaces that response rather than creating a duplicate registration. A declined trip is omitted from homepage recommendations and payment reminders but remains in the calendar, where a student can change their mind. Responses close when the trip starts. Cancelled, archived, unpublished and sample trips cannot receive responses.

Teachers, staff and administrators open **Workspace → Trip interest & collection**. The view shows the current interested students' names and verified classes, with trip/class/name filters and response timestamps. Teachers are restricted to assigned classes. Staff/administrators have the wider collection view. Council membership alone cannot access collection lists. Declined students are removed from the list; disabled or no-longer-eligible accounts are excluded. Email addresses and internal account identifiers are not sent to this list.

Lists refresh every 20 seconds while the page is visible, and have a manual Refresh button. Saving interest is not payment, a guaranteed reservation or guardian permission. The interface says so explicitly. Cancelled/archived trip lists are labelled not to collect payment.

Records are private in the app database and are not saved to GitHub. Trip-interest retention must be included in the school-approved retention/deletion process before broad rollout. This update does not implement a financial ledger, capacity, waiting lists, external notification delivery, guardian consent or scheduled record deletion.

Verification: real API handlers with isolated SQLite fixtures test identity, CSRF, audience exclusions, teacher scope, list privacy, repeated responses, decline/rejoin, cancelled/past/sample trips and class/account changes. UI tests cover the student journey from homepage to decline to calendar to rejoin. Browser/device QA and school-account pilot checks remain necessary.
