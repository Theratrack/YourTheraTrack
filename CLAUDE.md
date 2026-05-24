# GuestPulse

AI-powered guest feedback & hotel service-recovery SaaS. Catch unhappy guests
privately before they post public reviews; guide happy guests to Google/TripAdvisor.
It is **not** a review filter — all guests see review links, but messaging is
personalised by score.

## Stack

- Vite + React 18 + TypeScript
- react-router-dom for routing
- Supabase (Postgres + Edge Functions) for persistence, AI, and email
- Anthropic API for feedback classification & summaries (via Edge Function)
- Resend for manager email alerts (via Edge Function)
- Plain `style.css` (no UI framework) — teal `#0D9488` primary

## Commands

- `npm run dev` — local dev server (Vite, default http://localhost:5173)
- `npm run build` — production build (also the type/compile check we run as "tests")
- `npm run lint` — eslint
- `npx tsc --noEmit -p tsconfig.app.json` — typecheck

There is no unit-test runner configured; "run tests" in this repo means
`tsc --noEmit` + `vite build` + `lint` must all pass.

## Architecture

- `src/lib/types.ts` — shared domain types
- `src/lib/supabase.ts` — Supabase client; **null when env vars absent**
- `src/lib/feedbackApi.ts` — data layer: uses Supabase when configured, else
  falls back to in-memory demo data. The app must always run locally with no keys.
- `src/lib/classify.ts` — heuristic classifier; AI fallback when no Anthropic key
- `src/lib/store.tsx` — React context holding feedback list + actions
- `src/pages/*` — one component per route
- `src/components/*` — shared UI (Stars, UrgencyBadge, Nav)
- `supabase/migrations/*.sql` — schema
- `supabase/functions/*` — Edge Functions (analyze-feedback, send-alert, weekly-report)

## Conventions

- Graceful degradation is a hard requirement: every external dependency
  (Supabase, Anthropic, Resend) must have a local fallback so the demo works
  with zero configuration.
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (client);
  `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `ALERT_EMAIL_TO` (Edge Function secrets).
- Colours: teal `#0D9488`, red `#DC2626` (high), amber `#D97706` (medium),
  green `#16A34A` (low/positive).
