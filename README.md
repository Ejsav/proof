# AutoMax Branford — Lead Engine

Conversion-first website for AutoMax Branford (544 West Main St, Branford, CT):
phone calls, financing pre-qualifications, trade-in leads, and test drive
bookings. Built as a production-grade spec asset; sample inventory swaps for a
live DMS feed without a rewrite. Project rules live in `CLAUDE.md`; the growth
plan in `ROADMAP.md`; the platform build-out spec in `docs/PLATFORM.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (/style = design-system QA, dev only)
npm run build && npm start
```

Zero env vars required — the site runs fully in **demo mode**: leads are
validated, logged server-side (`[lead:demo-mode]`), and the admin area shows a
setup notice.

## Architecture in one minute

- **Inventory seam** — all vehicle data flows through `lib/inventory.ts`
  (Zod-validated repository). Sample data: `lib/sample-data/vehicles.ts`.
  Live feed: `scripts/ingest-inventory.ts` upserts into Supabase through the
  same schema.
- **Lead pipeline** — every form (test drive, pre-qual, trade-in, contact)
  shares one engine: client+server Zod, Server Action, honeypot,
  time-on-page ≥ 3s, TCPA consent (never SSN/DOB), then fan-out: Supabase
  insert → Resend notification → ADF/XML CRM handoff → SMS autoresponse
  (each stage no-ops without its env vars, and none can lose a lead).
- **Design tokens** — `app/globals.css` `@theme` block is the entire design
  system (Tailwind v4). Components never use default palette values.
- **Tenant seam** — `lib/site.ts` (`DealerConfig`) holds every dealer fact;
  nothing else hardcodes NAP data.

## Launch checklist

1. Copy `.env.example` → configure Supabase (run `supabase/migrations/`),
   Resend, `ADMIN_EMAILS`, `NEXT_PUBLIC_SITE_URL`, GA4. Twilio + ADF optional.
2. Replace placeholder fonts (`public/fonts/README.md`) and vehicle photos
   (`public/vehicles/`); confirm brand red in `app/globals.css`
   (`--color-accent-600`).
3. Resolve `[DEALER: fact needed]` markers (`grep -r "DEALER:" app components`).
4. Deploy to Vercel; verify Lighthouse 95+ mobile on `/`, `/inventory`, a VDP.

## Verified quality bar

Production build, mobile Lighthouse: Perf 96–97, A11y 100, Best Practices 100,
SEO 100, CLS 0 on every route. Every form path exercised end-to-end in a real
browser (fast-submit rejection, validation errors, success + notification).
