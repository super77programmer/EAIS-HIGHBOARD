# EAIS High Board — source download

This package contains the website's source code, images, fonts/icons supplied in the project, local GSAP fallback files, configuration, dependency lockfile, database schema/migrations, documentation, and interface tests. It is the source for the release accompanying this download.

Live database contents (accounts, chat messages, votes and suggestions), live uploaded attachments, hosting access permissions, and runtime secrets are not included. The package does not automatically copy those services to another host. Installed dependencies and generated build files are recreated from the source.

## Open and edit

1. Extract the ZIP to a folder on your computer.
2. Open that folder in VS Code, Cursor, or your preferred editor.
3. Start with `app/page.tsx` for the main app, `components/Community.tsx` for real messaging, `components/ChatDemo.tsx` for the local demo, and `app/community.css` / `app/light.css` for styling.

## Run locally

Use Node.js 22.13 or later and the pnpm version specified in `package.json` (11.25.0 for this release).

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm build
```

The build generates `dist/server/wrangler.json`. Initialize a new local database by applying each SQL file in `drizzle/` in filename order, once. For each file, replace `MIGRATION.sql` in this command with that filename:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/MIGRATION.sql
```

Then run:

```sh
pnpm dev
```

Open the local address printed in the terminal. The portable development server normally uses port 5173. The teacher–student demo runs locally without Google sign-in. It does not upload files or send real messages.

For a preview of the built Worker, use `pnpm start`. See `README.md` for runtime details and `docs/COMMUNICATIONS.md` for Google school sign-in, roles, roster setup, and permissions. Real messaging requires server-side D1/R2 bindings and school account configuration; opening an HTML file directly is insufficient.

## Hosting and secrets

The `.openai/hosting.json` file identifies the current hosted Site and declares its logical DB/FILES bindings. It is not a credential. Publishing to a different account or hosting provider requires configuring that provider's database, object storage, migrations, and runtime environment.

Never reuse a shared example secret for production. Configure a random `SESSION_SECRET` and your own setup `ADMIN_PIN` through the hosting environment. School Google sign-in uses a web client ID and authorized origin configured by the school; no Google password belongs in the source.

## Checks

```sh
pnpm exec tsc --noEmit
node tests/interface.cjs
```

The ZIP is a downloadable snapshot. Later changes to the hosted website will require a new source download.
