# Campus Book

Campus Book is a React and Vite marketplace for campus textbooks, with Supabase-backed authentication, listings, moderation, inquiries, and a safe project file viewer.

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

The app runs at `http://localhost:3000` by default.

## Environment variables

Copy `.env.example` to `.env.local` and provide only public client configuration:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

`VITE_*` values are bundled into the browser. Never put service-role keys, database passwords, private keys, GitHub tokens, or other credentials in them. Keep `.env.local` out of Git.

## Database

Apply the SQL migrations in `supabase/migrations/` to the intended Supabase project. Admin authentication uses Supabase Auth and the existing `profiles.role = 'admin'` policy.

## Production checks

```powershell
npm run lint
npm run build
```

Uploaded project files are displayed as text only. Protected names and directories such as `.env*`, credentials, private keys, `.git`, `.ssh`, and `node_modules` are filtered by the project viewer. Any server-side upload, ZIP processing, or download endpoint must apply the same filtering before exposing files.

## GitHub publishing

The repository should include source and configuration files such as `src/`, `public/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `README.md`, and `.gitignore`. It must not include `.env.local`, `node_modules/`, `dist/`, credentials, or private keys.
