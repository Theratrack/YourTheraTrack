# Deploying GuestPulse

The app runs with **zero configuration** in demo mode (mock data, no login).
Adding a Supabase backend turns on real persistence, AI summaries, email
alerts, and staff-only authentication.

## Run locally

Requires Node 18+.

```bash
git clone https://github.com/Theratrack/YourTheraTrack.git
cd YourTheraTrack
git checkout claude/great-hamilton-K9qvi
npm install
```

### Quickest: open demo (no login)

The committed `.env` points at Supabase, which gates the dashboard behind a
staff login. To preview everything with no backend and no login, override the
vars to empty in a (gitignored) `.env.local`:

```bash
printf 'VITE_SUPABASE_URL=\nVITE_SUPABASE_ANON_KEY=\n' > .env.local
npm run dev
# → http://localhost:5173  (dashboard, /report, /qr all open; "DEMO MODE" badge)
```

### Verify the build

```bash
npm run build      # production build / compile check
npm test           # Vitest: guest page public + dashboard gated when configured
npm run lint
```

## Deploy to Vercel (public URL)

1. **vercel.com → Add New → Project → Import Git Repository** → `Theratrack/YourTheraTrack`.
2. Framework auto-detects as **Vite**. Confirm **Build = `npm run build`**,
   **Output = `dist`**. (`vercel.json` already adds SPA rewrites so deep links
   like `/dashboard` and `/feedback?dept=Spa` resolve.)
3. **Environment variables:**
   - Leave **empty** → public **demo mode** (dashboard open, no login). Easiest first look.
   - Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` → real backend, staff login required.
4. Deploy. With the GitHub integration connected, each push to a branch gets an
   automatic **preview URL** (shown as a check on the PR).

## Enable the real backend

1. **Apply the schema** (creates tables, RLS, and the staff model):
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push        # runs 0001_init.sql + 0002_auth_staff.sql
   ```
2. **Deploy the Edge Functions:**
   ```bash
   supabase functions deploy analyze-feedback send-alert
   ```
3. **Set secrets** (server-side only — never prefixed with `VITE_`):
   ```bash
   supabase secrets set \
     ANTHROPIC_API_KEY=sk-ant-... \
     RESEND_API_KEY=re_... \
     ALERT_EMAIL_TO=manager@yourhotel.com \
     ALERT_EMAIL_FROM="GuestPulse <alerts@yourhotel.com>"
   ```
   - Without `ANTHROPIC_API_KEY`, feedback still gets a heuristic classification.
   - Without `RESEND_API_KEY`/`ALERT_EMAIL_TO`, alerts are skipped silently.
   - Resend also requires a verified sending domain.
4. **Create a staff user** (no public signup grants access):
   - Supabase **Dashboard → Authentication → Users → Add user** (email + password).
   - Link them to the hotel:
     ```sql
     insert into public.staff (user_id, hotel_id, full_name)
     values (
       '<auth-user-uuid>',
       (select id from public.hotels where slug = 'grand-hotel'),
       'Front Desk Manager'
     );
     ```
5. Update the seeded hotel's real review URLs:
   ```sql
   update public.hotels
   set google_review_url = '...', tripadvisor_review_url = '...'
   where slug = 'grand-hotel';
   ```

Now sign in at `/login`; the dashboard loads live data and negative feedback
triggers an AI-summarised email alert.

## Security note

`hotels` is publicly readable (guests need branding). `feedback` is **insert-only
for guests** and **read/update for authenticated staff** (`public.is_staff()`).
Keep service-role keys and the Edge Function secrets server-side only.
