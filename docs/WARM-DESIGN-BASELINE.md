# Latest functionality with the protected warm theme

Clarified by the owner on 8 October 2026: keep the existing warm orange/coral theme unless the owner explicitly requests a theme change. Restore the latest functionality and presentation from immediately before the Google Classroom-style redesign, rather than returning the entire interface to its earliest version.

The corrected baseline is `b9dc33a`: the modern daily homepage, today's/next event, four shortcuts, reminders, upcoming events, school updates, short GSAP entrance sequence and original navigation. The older full-page logo landing section, spotlight dashboard, glance cards and week strip are superseded. `app/light.css` remains the visual foundation. `app/school-app.css` stays unimported.

The entrance runs once on initial app entry and does not replay when changing pages. It completes automatically, can be skipped with its button or Escape, honours reduced motion and has a five-second fallback. It does not pin the home page during scrolling.

Later functionality is retained: server-assigned roles, teacher workspaces/timetables, private messages, Google sign-in hardening, large private uploads, searchable/filterable calendar, reversible trip participation, protected collection lists and assigned trip contacts/private replies. Front-end restoration does not downgrade backend security.

Animation feedback remains short and consistent, using locally hosted GSAP assets and reduced-motion handling. New controls use small matching styles in `app/warm-utilities.css`.

The earlier Figma blue workspace concept and the 5 October layout restoration are historical, not future design guidance. See the root `AGENTS.md` for the owner's theme constraint.
