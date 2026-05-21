# DeskPilot Academy

The marketing site for DeskPilot Academy — operator-built automotive dealership training. Built with Next.js 15 App Router. Phase 1 of a 7-phase build.

## Local development

```bash
# Install dependencies (this also bootstraps the husky pre-commit hook)
npm install

# Install the secret scanner that the pre-commit hook depends on
brew install gitleaks       # macOS
# other systems: https://github.com/gitleaks/gitleaks/releases

# Copy env template and fill in values (NEVER commit real keys)
cp .env.example .env.local

# Run dev server
npm run dev
```

Open <http://localhost:3000>.

## Secret-scanning pre-commit hook

`.husky/pre-commit` runs `gitleaks protect --staged` against the gitleaks
rules in `.gitleaks.toml` on every `git commit`. The hook **blocks** the
commit if it sees:

- Supabase JWTs (anon or service_role)
- PostHog API keys (`phx_` / `phc_` / `phs_`)
- Generic three-segment JWTs
- Anything in gitleaks' built-in pack (AWS, GCP, Stripe, Slack, etc.)

If you're certain a commit is clean and you must bypass once, use
`git commit --no-verify` — but log the reason in the commit message.

Run a full-repo scan manually any time:

```bash
npm run secrets:scan
# or: gitleaks detect --config .gitleaks.toml --redact --verbose
```

> If `npm install` doesn't bootstrap the hook (no `.husky/_` directory
> appears), run `npx husky` once to set it up.

## Before first deploy

1. **Apply the Supabase schema.** Open the Supabase SQL editor for the
   project and run `db/p1_schema.sql`. The file is idempotent — re-running
   is safe. It creates the five tables (`waitlist`, `b2b_inquiries`,
   `lead_magnet_downloads`, `campus_interest`, `site_state`), seeds the
   `site_state` single row, and enables row-level security with the
   correct policies.

2. **Populate Vercel env vars.** Add the values from `.env.example` to the
   Vercel project (Production scope). The two most important are:
   - `SUPABASE_SERVICE_ROLE_KEY` — server-side only, **never expose to
     the browser**. Used by the API routes to write to Supabase, bypassing
     RLS.
   - `NEXT_PUBLIC_POSTHOG_KEY` — optional but recommended; without it
     analytics is a no-op.

3. **Verify locally first.** `npm run build && npm run start`, then run
   the Phase 12 acceptance checks below.

## P2 — Authentication setup

P2 ships **Google OAuth as the only login path** (no email/password, no magic
link). `/login` and `/signup` exist but are intentionally **not linked from
public navigation** — founders are provisioned manually until course delivery
(P5).

Why Google-only: magic-link auth was removed because Gmail's link-prefetch
security scanner consumes the one-time OTP token before the user can click it,
so Supabase returns `otp_expired` (a well-known Supabase + Gmail friction
point, not a code bug). The fallback for operators who don't use Google is
admin provisioning via Supabase "Invite user" — acceptable because all
founders-phase access is admin-provisioned anyway. A typed **OTP code** flow
(immune to link prefetch) is the right answer for public signup in P5+.

1. **Apply `db/p2_schema.sql`** in the Supabase SQL editor (after the P1
   schema). Idempotent. Creates `profiles` (with `products[]` and
   column-level RLS), the `handle_new_user()` trigger, and policies.
2. **Google OAuth:** in Google Cloud Console create an OAuth 2.0 Web client;
   set the authorized redirect URI to
   `https://<project-ref>.supabase.co/auth/v1/callback`. In Supabase →
   Auth → Providers → Google, paste the client ID + secret and enable.
3. **Supabase Auth URL config:** Site URL `https://www.deskpilot.academy`;
   add redirect URLs for `https://www.deskpilot.academy/auth/callback`, the
   apex, `http://localhost:3000/auth/callback`, and
   `https://*.vercel.app/auth/callback`. (No SaaS-domain entries — the future
   SaaS domain is not locked.)
4. **Provision a founder:** Supabase → Auth → Users → "Invite user". The
   trigger auto-creates the profile row; then grant access via SQL editor:
   ```sql
   update public.profiles
     set products = '{academy}', founders_member = true
     where email = 'founder@example.com';
   ```
   `products`/`founders_member` are service-role-only, so this must run in the
   SQL editor (service-role context), not from the app.

Invite emails use Supabase's built-in email in P2 (rate-limited — fine for
manual provisioning volume). Custom SMTP/Resend is deferred.

## Monitoring & ops

- **Vercel deploy notifications** (operator task): Vercel → Account Settings →
  Notifications → enable deployment failure/error emails routed to
  `will@deskpilot.academy`.
- **Supabase project alerts** (operator task): Supabase → Project Settings →
  enable alerts for high error rate, downtime, and billing/usage threshold,
  routed to `will@deskpilot.academy`.
- **Sentry / Slack:** intentionally NOT installed in P2 — deferred to a
  post-P3 monitoring sprint when real users and revenue are flowing.

### Weekly Supabase health-check ritual

Run this in the Supabase SQL editor once a week. Verify the row counts track
real activity and scan for garbage (malformed emails, suspicious bursts).
(Table-name note: the "dealer inquiries" table is `b2b_inquiries`; the
"founders counter" lives in `site_state`.)

```sql
-- row counts across the demand-capture tables
select 'waitlist' as t, count(*) from public.waitlist
union all select 'b2b_inquiries', count(*) from public.b2b_inquiries
union all select 'lead_magnet_downloads', count(*) from public.lead_magnet_downloads
union all select 'campus_interest', count(*) from public.campus_interest;

-- founders counters (expect individual <= 100, b2b <= 10)
select * from public.site_state;

-- garbage scan: malformed waitlist emails, newest first
select email, source, created_at from public.waitlist
  where email !~ '^[^@]+@[^@]+\.[^@]+$'
  order by created_at desc;

-- auth garbage: profiles with no product access created a while ago
select id, email, products, created_at from public.profiles
  where products = '{}' and created_at < now() - interval '7 days'
  order by created_at desc;
```

## Repository layout

```
app/                    Next.js App Router pages and API routes
components/
  analytics/            PostHogProvider (client component)
  layout/               Header, Footer, Container, Wordmark, MobileMenu
  marketing/            Marketing-specific UI (Hero, CampusGrid, etc.)
  seo/                  JsonLd component
  ui/                   shadcn-style primitives
lib/
  site.ts               Site constants, brand strings, magic numbers
  copy.ts               LOCKED_H1 + meta/OG description (single source)
  pricing.ts            Pricing tiers (single source for UI + JSON-LD)
  campuses.ts           Campus data (async fetchers — P2 swap to Supabase
                        is body-only)
  faculty.ts            Faculty data (async fetchers, TBD placeholders)
  faqs.ts               FAQ data with categories
  seo.ts                Typed JSON-LD builders
  supabase.ts           Server clients (service role + anon)
  supabase-browser.ts   Browser client
  validators.ts         zod schemas for all forms
  analytics.ts          Client-side PostHog wrapper + event const
  analytics-server.ts   Server-side PostHog wrapper
  utils.ts              cn() helper
db/p1_schema.sql        Run this in Supabase before first deploy
scripts/
  check-banned-phrases.mjs    Prebuild: rejects marketing-cliché copy
  generate-placeholders.mjs   One-shot: generates placeholder PNG/PDF
public/                 Static assets (icons, placeholder PDFs)
legacy/                 Archived Vite SPA — do not import from
```

## Analytics event taxonomy

Server-side events are fired from the API routes via `lib/analytics-server.ts`. Client-side events are fired alongside form success via `lib/analytics.ts`. All event names are exported as constants from `lib/analytics.ts`.

| Event | When | Properties |
| --- | --- | --- |
| `waitlist_signup` | Successful POST to `/api/waitlist` | `source`, `founders_tier_interest` |
| `dealer_inquiry_submitted` | Successful POST to `/api/inquiry` | `rooftops`, `estimated_seats`, `role` |
| `lead_magnet_requested` | Successful POST to `/api/resource` | `resource_slug` |
| `campus_interest_submitted` | Successful POST to `/api/campus-interest` | `campus_slug` |
| `pricing_cta_clicked` | (Reserved for Phase 2 instrumentation) | `tier`, `location` |

Add new events by extending `ANALYTICS_EVENTS` in `lib/analytics.ts`. The const ensures typo-safety.

## Acceptance checks (Phase 12)

Run after `npm run build && npm run start`:

```bash
# Locked H1 renders server-side
curl -s http://localhost:3000/ | grep -c "Operator-level automotive sales training"  # >= 1

# Pricing tiers render with literal dollar amounts
curl -s http://localhost:3000/pricing | grep '\$199'
curl -s http://localhost:3000/pricing | grep '\$349'   # Bundle

# Campus pages
curl -s http://localhost:3000/campuses/f-i | grep -i 'module'
curl -s http://localhost:3000/campuses/desking | grep -i 'coming soon'

# FAQ count
curl -s http://localhost:3000/faq | grep -c 'question'   # >= 28

# Sitemap / robots
curl -s http://localhost:3000/sitemap.xml | head -50
curl -s http://localhost:3000/robots.txt

# OG image
curl -s -o /tmp/og.png -w '%{http_code} %{content_type} %{size_download}\n' \
  http://localhost:3000/opengraph-image

# API endpoints — without Supabase configured, these log to console and return 200
curl -X POST -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","source":"homepage","founders_tier_interest":true}' \
  http://localhost:3000/api/waitlist

curl -X POST -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","campus_slug":"desking"}' \
  http://localhost:3000/api/campus-interest

curl http://localhost:3000/api/counters   # 100/10 fallback when Supabase not configured

# Security headers
curl -sI http://localhost:3000/ | grep -i 'X-Frame-Options\|X-Content-Type-Options'
curl -sI -H 'Host: preview.vercel.app' http://localhost:3000/ | grep -i X-Robots-Tag

# Banned-phrase guardrail
node scripts/check-banned-phrases.mjs   # exit 0

# Type check
npx tsc --noEmit
```

## Deployment (Phase 13 — operator step, not part of P1 codebase)

After the local acceptance checks pass:

1. Push `claude/deskpilot-academy-p1-cn863` to GitHub.
2. Import the repo in Vercel. Framework preset = Next.js.
3. Set environment variables (Production scope) from `.env.example`.
4. Configure custom domain `deskpilot.academy` and `www.deskpilot.academy` in Vercel.
5. Submit `https://deskpilot.academy/sitemap.xml` to Google Search Console.
6. Submit the site to Bing Webmaster Tools.

## Legacy code

The previous Vite + Wouter SPA lives in `legacy/`. It is excluded from
the TypeScript and ESLint configs and from Next.js bundling. Do not
import from it. It is retained for reference while P2 wires authenticated
product surfaces back in.
