# P3 Billing — Build Notes

Stripe subscription billing (steps 3–8). No DB migrations, no Stripe-dashboard
changes, no secrets printed. Branch `feat/p3-billing`.

## Files created

- `lib/stripe.ts` — server-only Stripe singleton, apiVersion pinned to `2026-04-22.dahlia`, null on missing key.
- `lib/billing.ts` — `grantAcademy`/`revokeAcademy` (products), `resolvePlanByPrice`, `subscriptionPeriodEndISO`, `firstPriceId`.
- `lib/access.ts` — `requireAcademyAccess()` gating contract + lazy 72h past-due guard.
- `app/api/checkout/route.ts` — POST, authenticated checkout session creation.
- `app/api/webhooks/stripe/route.ts` — POST, raw-body verify, idempotency, 8 handlers.
- `app/subscribe/page.tsx` + `components/marketing/SubscribeForm.tsx` — authenticated paywall.
- `app/dashboard/billing-actions.ts` — `manageBilling` Billing Portal server action.
- `BUILD-NOTES.md` — this file.

## Files changed

- `lib/auth.ts` — `Profile` type extended with billing columns (selected via `*`).
- `app/dashboard/page.tsx` — `?welcome=1` banner; Manage billing / Subscribe; subscription status row.
- `app/dashboard/layout.tsx` — no-access card now points to `/subscribe`.
- `app/robots.ts` — `/subscribe` added to disallow.
- `package.json` / `package-lock.json` — added `stripe`.

## Assumptions (verify against the live, hand-built schema)

Migrations were done by hand and the live DDL was not visible to this build, so
the code targets the column names implied by the task spec. **If any differ, the
webhook writes will fail at runtime — reconcile these before end-to-end testing.**

- **plans**: `id`, `slug`, `stripe_monthly_price_id`, `stripe_annual_price_id`, `price_monthly_cents`, `price_annual_cents`. Slugs `all-access`, `all-access-founding`. `price_*_cents` display-only.
- **profiles** (billing): `stripe_customer_id`, `subscription_status`, `subscription_plan_id` (assumed uuid FK → `plans.id`), `current_period_end`, `products text[]`.
- **subscriptions** — upsert keyed on **`stripe_subscription_id`** (assumed unique). Columns: `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `plan_id`, `status`, `is_founder`, `interval`, `cancel_at_period_end`, `current_period_end`, `past_due_since`, `canceled_at`, `updated_at`.
- **payments** — `user_id`, `stripe_invoice_id`, `stripe_subscription_id`, `amount_cents`, `currency`, `status` (`paid`/`failed`), `paid_at`, `failure_reason`, `invoice_pdf_url`.
- **stripe_events** — `event_id` (unique), `event_type`. Idempotency relies on `23505` on re-insert.
- **site_state** — single row `id = 1`, `founders_individual_remaining`.
- **RPC `claim_founder_seat()`** — no args, returns boolean (true = seat secured). Called via `service.rpc('claim_founder_seat')`.

### products[] mutation — deviation to flag
The spec asks for `array_append` / `array_remove`. supabase-js can't express those in `.update()` and adding an RPC is out of scope here, so `grantAcademy`/`revokeAcademy` do an equivalent read-modify-write that **preserves every other element** and only toggles `'academy'` (idempotent, never overwrites the whole array). If `grant_product`/`revoke_product` RPCs exist or are added, swap to them for atomicity.

## Other notes

- **API version pin** `2026-04-22.dahlia`: `current_period_end` lives on the subscription *item*; read item first, fall back to subscription level.
- **Invoice → user**: invoices don't carry our metadata — resolved via `profiles.stripe_customer_id = invoice.customer`. Subscription id read from `invoice.subscription` with a fallback to `invoice.parent.subscription_details.subscription`.
- **Metadata threading**: `supabase_user_id` set on `client_reference_id` AND `subscription_data.metadata`; subscription handlers read `subscription.metadata`, falling back to customer lookup.
- **Grace**: `invoice.payment_failed` sets `past_due` + `past_due_since=now()` once and keeps access ON. Revocation via pg_cron and, lazily, via `requireAcademyAccess` after 72h.
- **Graceful degradation**: every route returns 503 (not a crash) if Stripe/service client unconfigured.
- **Runtimes**: `/api/checkout` and `/api/webhooks/stripe` are `runtime='nodejs'`; `/subscribe` and `/dashboard` are `force-dynamic`.
- **package-lock.json**: the git push proxy 503'd, so source was pushed via the GitHub API. The lockfile (288 KB) was not pushed via the API; the only delta is the `stripe` addition. Vercel uses `npm install` so the build resolves it fine, but run `git pull && npm install` locally and commit the lockfile to keep it in sync.

## Verification done in this build
- `npx tsc --noEmit` — 0 errors.
- `npm run build` — green; `/api/checkout`, `/api/webhooks/stripe`, `/subscribe` present and dynamic; marketing pages still prerendered.
- Banned-phrase prebuild check — passes.

End-to-end Stripe flow (real Checkout, webhook delivery, founder claim, dunning) must be run against the test-mode catalog on a preview deploy with the live schema — not possible from this build environment.
