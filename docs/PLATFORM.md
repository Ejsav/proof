# Platform Build-Out — Phases 10–12 Implementation Spec

What Track C looks like in this codebase specifically. Phases 10–12 need
live accounts (Stripe, Twilio, DMS feeds, real dealers), so this is the
implementation-ready spec rather than shipped code. The seams it references
already exist and are noted per section.

## Phase 10 — Multi-tenant (seams already in place)

| Concern | Today | Multi-tenant move |
|---|---|---|
| Dealer facts | `lib/site.ts` exports one `DealerConfig` | Resolve config per hostname in root layout (`headers().get("host")` → config row); components unchanged — nothing reads NAP outside `lib/site.ts` |
| Branding | Token block in `app/globals.css` | Per-tenant token file emitted from onboarding (accent, neutrals stay); token-only styling rule means zero component edits |
| Inventory | `lib/inventory.ts` seam over sample data / Supabase | Add `dealer_id` column to `vehicles`; repository scopes every query; RLS by `dealer_id` |
| Leads | `lib/leads/store.ts` → `leads` table | Add `dealer_id`; per-dealer `LEAD_NOTIFY_EMAIL` / `LEAD_ADF_EMAIL` move into config row |
| Domains | Single Vercel project | Vercel wildcard + per-dealer custom domains; middleware maps host → tenant |
| Admin | Magic-link allowlist via `ADMIN_EMAILS` | `admins(dealer_id, email)` table replaces the env var |

Onboarding runbook target: new dealer live in under a week (first ten), then under a day (config + tokens + feed credentials + domain).

## Phase 11 — Business layer

- **Billing**: Stripe subscriptions, three tiers —
  1. *Site + Leads* (site, forms, notifications, admin inbox)
  2. *+ Speed-to-lead* (SMS autoresponder — seam: `lib/leads/sms.ts`; ADF CRM handoff — seam: `lib/leads/adf.ts`)
  3. *+ Attribution* (call tracking numbers, weekly report, GA4 rollup)
  Webhook → `subscriptions` table → feature flags read server-side per tenant.
- **Self-serve admin**: extend `/admin` with inventory overrides (price/feature/photo), specials banner, staff seats. Every admin mutation is already a Server Action — the pattern scales as-is.
- **Weekly dealer report**: cron → aggregate `leads` by type/source/response-time → Resend template. This report is the retention product; build it before dealer #5.

## Phase 12 — The moat

- **Benchmarks**: nightly rollup into `metrics(dealer_id, week, leads, close_rate, avg_response_minutes)`; the dealer report gains "you vs. CT median" once n ≥ 10 dealers. This data compounds and cannot be copied by an entrant.
- **Lead scoring**: logistic model over lead payload + outcome (`status = sold`); surfaces "call these first" ordering in the admin inbox.
- **After-hours AI SMS**: answers inventory questions from the repository layer only (no hallucinated stock), hard TCPA guardrails (consent already stamped per lead in `leads.tcpa_consent_at`), human handoff at 9 AM. Legal review before this ships.

## Sequencing guard

Do not start Phase 10 before one dealer has 90 days of measured lead lift
(ROADMAP.md, Track B). The case study sells dealer #2; multi-tenancy
without it is infrastructure with no pipeline.
