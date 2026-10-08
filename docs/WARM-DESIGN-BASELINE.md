# Restored warm visual baseline

8 October 2026: the owner requested restoration of the original warm orange/coral design. The blue workspace redesign is superseded.

The restored presentation comes from the 5 October source (`bf546d8`): the EAIS logo welcome section, original header and navigation, class greeting, glance cards, week strip, photo trip spotlight, event filters, rounded cards and sidebar. The original `app/light.css` remains the visual foundation. `app/school-app.css` is no longer imported.

Newer functional controls keep their behaviour and use small matching styles in `app/warm-utilities.css`. School roles, private chats, Google authentication hardening, large media uploads, calendar discovery, reversible trip participation and assigned trip contacts remain intact. Declined trips remain excluded from the home recommendations and week strip; the calendar still allows rejoining.

Future interface work should preserve this visual identity and layout. Do not replace it with the blue/grey workspace design. The earlier Figma workspace concept and usability redesign notes are historical, not the current design baseline.

Validation: TypeScript and the interaction suite verify the restored hero, spotlight, navigation, calendar controls, trip responses/questions and messaging. Production build also required before publication. No claim of browser screenshot comparison is made.
