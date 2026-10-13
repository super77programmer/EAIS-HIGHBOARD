# Desktop layout and agenda — 13 October 2026

Desktop work surfaces now use consistent rail/header geometry and a wider main canvas. Large screens retain an announcement-first reading column and a separate agenda/support column. Calendar dates and their agenda sit alongside each other, canteen browsing and request tools use separate columns, and messaging keeps a usable contact sidebar with bounded message widths. Pointer hover and keyboard focus expose message options; touch controls remain available. Compact desktop windows at 960–1024 px use the rail when a fine pointer is present, while touch layouts retain mobile navigation. Short-screen navigation can scroll without colliding with rail footer content.

Today’s agenda is now a dedicated component with tested ordering: in-progress timed events, later timed events, date-only periods, then finished events. A completed day remains today’s agenda; future dates are identified separately. Ongoing date ranges use today’s date badge and show the actual period. Cancelled events are excluded, overflow is counted, and an ongoing assessment cannot appear as the next assessment.

The bottom is a composed assessment preview followed by a full-width Google Classroom resource area with supporting text and a new-tab label. It no longer looks like loose links appended to the card. Desktop card padding and footer insets share breakpoints; long titles wrap without displacing dates or icons. Mobile uses the same clear agenda ending within its existing layout.

Validation: TypeScript, structural CSS/source checks, agenda behavior tests, existing UI/backend suites and the production build. Browser-based visual checks are unavailable in this environment, so final pixel appearance on Windows/Opera and physical devices remains unverified.
