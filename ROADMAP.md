# Roadmap — From Demo to Multi-Million-Dollar Asset

The honest framing first: a website for one used car dealership is worth a
retainer, not millions. The multi-million-dollar version of this asset is the
**productized platform underneath it** — a conversion-first lead engine that
any independent dealership can run for a monthly fee. AutoMax Branford is
customer zero and the proof case. Everything below is sequenced so each track
pays for the next.

The market logic: independent dealers pay $1,500–$5,000/month to enterprise
platforms (Dealer.com, DealerOn, Dealer Inspire) for slow, template sites
built for franchise groups. The wedge is what this codebase already is —
faster, better designed, measurably conversion-focused, priced for
independents. 100 dealers × $2,000/month ≈ $2.4M ARR; niche SaaS at that
scale trades at a multiple of that.

---

## Track A — Win AutoMax (finish the demo) · Phases 4–6

**Goal: a signed dealership.** Everything here runs on the existing
architecture; no new infrastructure decisions.

### Phase 4 — Conversion pages
- Financing page: pre-qualification form (the #1 lead product) — soft-pull
  language, payment estimator, lender logos placeholder. Reuses the Phase 3
  form pipeline (Zod + Server Action + honeypot + time-on-page + TCPA).
- Trade-in page: valuation form (year/make/model/mileage/condition) with
  "get your number by text" follow-up path.
- Contact page: map embed, hours, department contacts, general inquiry form.
- GA4 events per lead type; every form → Resend notification.

### Phase 5 — Supabase + admin
- Provision Supabase: `leads` table (fills the existing `lib/leads/store.ts`
  seam), `vehicles` table mirroring the repository schema, Storage bucket
  for photos.
- Admin at `/admin` (magic-link auth): lead inbox with status workflow
  (new → contacted → appointment → sold/lost), basic vehicle CRUD.
- OG image Route Handler for VDPs (price + vehicle card for shared links).

### Phase 6 — Launch certification
- Real assets in: Fontshare fonts, brand red, logo, vehicle photos.
- SEO: JSON-LD (`Vehicle` + `AutoDealer`), inventory sitemap, robots,
  canonical rules.
- Performance pass to the CLAUDE.md budget: LCP < 2.0s on 4G, CLS < 0.05,
  Lighthouse 95+ mobile — measured and screenshotted for the pitch deck.
- Accessibility audit (keyboard, screen reader, contrast).
- Deploy to Vercel with env vars; demo walkthrough recorded.

**Exit criteria:** AutoMax signs. The demo itself is the sales deck.

---

## Track B — Production for AutoMax (post-signing) · Phases 7–9

**Goal: the reference customer with numbers worth quoting.** A case study
("X% more phone calls in 90 days") is the asset that sells dealer #2–#10.

### Phase 7 — Live inventory
- DMS/Homenet/vAuto feed ingestion → Supabase, entirely behind the
  `lib/inventory.ts` seam (this is why that rule exists). Nightly sync +
  on-demand revalidation; photo pipeline (download, optimize, Storage).
- Sold-vehicle handling: VDPs 301 to similar inventory, never 404 — keeps
  SEO equity and rescues the lead.

### Phase 8 — Lead operations
- ADF/XML email output (the auto-industry CRM standard) so leads flow into
  whatever CRM the dealer runs (VinSolutions, DealerSocket, DriveCentric).
- SMS autoresponder on lead submit (Twilio) — speed-to-lead is the single
  biggest conversion lever in this industry.
- Call tracking number (CallRail or Twilio) so phone leads are measured,
  not anecdotal.
- Dealer-facing weekly report: leads by source/type, response times,
  inventory views. This report is the retention product.

### Phase 9 — Local SEO dominance
- Programmatic landing pages ("used SUVs under $20k in Branford CT")
  generated from live inventory through the repository layer.
- Google Business Profile + inventory feed alignment, review widget.
- Core Web Vitals monitoring in production (real-user metrics, not lab).

**Exit criteria:** 90 days of measured lead lift. Case study written.

---

## Track C — Productize (the multi-million part) · Phases 10–12

**Goal: sell the same asset N times without N× the work.**

### Phase 10 — Multi-tenant re-architecture
- Tenant config: one `dealer.config.ts` per store (NAP, phones, hours,
  brand tokens, DMS credentials) — exactly the shape `lib/site.ts` already
  has. Design tokens per tenant; the token-only styling rule from CLAUDE.md
  is what makes white-labeling cheap.
- Per-dealer domains on Vercel, shared codebase, isolated Supabase rows
  (RLS by tenant).
- Onboarding runbook: new dealer live in < 1 week, then < 1 day.

### Phase 11 — Self-serve business layer
- Stripe billing, plan tiers (site + leads / + SMS / + call tracking).
- Admin becomes the product: dealers manage inventory overrides, specials,
  staff, and see their lead analytics without calling support.
- Contract-free monthly pricing as the wedge against enterprise lock-in.

### Phase 12 — The moat
- Cross-dealer benchmark data ("your close rate vs. CT median") — the data
  asset competitors can't copy.
- Lead scoring (which leads buy), instant trade-in estimates, after-hours
  AI SMS responder with hard TCPA guardrails.
- At 20+ dealers: regional sales motion through dealer 20-groups and
  auctions, where independents actually congregate.

---

## Sequencing and risk

| Risk | Mitigation |
|---|---|
| DMS feed access is gatekept | Homenet/vAuto resell feeds; start with CSV/SFTP ingestion — the repository seam doesn't care |
| TCPA liability at scale | Consent captured + timestamped per lead (already built); legal review before SMS automation ships |
| Single-founder support load | Phase 11 self-serve before dealer #10, not after |
| Enterprise platforms copy the pitch | They can't ship this fast or price this low without cannibalizing themselves — the wedge is structural |

**The dependency chain that matters:** signed dealer (A) → measured lead
lift (B) → case study → repeatable sales (C). Skipping B to build
multi-tenancy early is the classic failure mode — nothing sells dealer #2
except dealer #1's numbers.
