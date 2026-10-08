# School app visual contract

The owner explicitly requires the existing warm orange/coral theme to remain unchanged unless they explicitly request a theme change. Preserve `app/light.css`, the warm identity, rounded styling and the navigation from before the Google Classroom-style redesign. Do not import `app/school-app.css` or replace the navigation with that redesign.

The desired presentation is the latest daily homepage and short GSAP entrance sequence from immediately before the redesign (`b9dc33a`), with subsequent functional and security fixes retained. Do not roll back to the early logo landing page, spotlight dashboard, glance cards or week strip from 5 October.

Add features and animations within this visual identity. Preserve reduced-motion handling, keyboard Escape dismissal without a visible skip button (owner request), a timeout if animation loading fails and no repeat entrance when switching pages. Keep roles and permissions enforced on the server.

Publish authorised updates and sync them to the existing GitHub repository, as requested by the owner.
