# CLAUDE.md — AutoMax Branford Lead Engine

## Project

AutoMax Branford Lead Engine. Purpose: generate phone calls, financing pre-qualifications, trade-in leads, and test drive bookings for a used car dealership in Branford, CT. Every design and code decision is measured against one question: **does this produce more qualified leads?**

This build is a spec/demo asset intended to win the dealership's business. It ships with sample inventory data, but the architecture must be production-grade so a live inventory feed can replace the sample data later without a rewrite.

## Stack (non-negotiable)

- Next.js 15, App Router, TypeScript strict mode
- Tailwind CSS with a custom design token system (no default palette usage in components)
- Supabase: Postgres, Auth (magic link for admin), Storage (vehicle photos)
- Server Actions for all mutations. Route Handlers only for webhooks/OG images.
- Zod validation on every input, client and server
- Resend for transactional email
- Framer Motion for UI micro-interactions; GSAP permitted in the homepage hero only
- Deployed on Vercel

## Design standard

Tier: product/SaaS precision (Linear, Stripe, Apple product pages) with one cinematic dark hero.

- Light, clean, scannable UI for inventory and forms. Dark confident hero on the homepage only.
- Typography: Clash Display (display/headings) + General Sans (body), self-hosted via `next/font/local`, fluid type scale with `clamp()`. Letter-spacing minimum 0.08em on uppercase. Line-height 1.1–1.2 display, 1.5–1.6 body.
- Color: define full token system before any component. Neutrals built on warm gray. ONE accent pulled from AutoMax's brand red. Accent used for CTAs and price emphasis only. Three colors maximum in any view.
- Spacing: 8px base grid, consistent scale, generous white space. Asymmetry where it signals craft.
- Motion: subtle fade-up reveals with spatial movement (never opacity-only), custom easing (no browser defaults), `prefers-reduced-motion` fallback on everything. Motion communicates confidence, never decoration.
- Banned: Inter/Roboto/system-ui as display font, purple gradients, generic card-grid-with-drop-shadows as primary layout, stock-photo-hero-with-white-text, buttons without designed hover states, any mobile experience that feels degraded rather than designed.

## Conversion rules (non-negotiable)

- Click-to-call phone number visible in the header at every breakpoint.
- Sticky mobile action bar on all pages: Call | Text | Get Pre-Qualified.
- Every lead form: minimum fields, honeypot field, time-on-page check (reject submissions under 3 seconds), clear TCPA consent checkbox (unchecked by default) wherever phone/SMS contact is collected.
- NEVER collect SSN or full date of birth anywhere. Pre-qualification uses soft language: "no impact to your credit score."
- Every form submission fires a GA4 event and sends a Resend notification.

## Performance budget

LCP < 2.0s on simulated 4G, CLS < 0.05, Lighthouse 95+ all categories on mobile. Images via `next/image` with explicit sizes, WebP/AVIF, lazy below fold. Fonts preloaded, `font-display: swap`. Animate transform/opacity only.

## Data architecture rule

All vehicle data flows through a single typed repository layer (`lib/inventory.ts`). Components never query Supabase directly for vehicles. This is the seam where a live DMS/Homenet feed replaces sample data post-signing.

## Response protocol

At the end of EVERY phase, end the response with exactly three sections:

1. **FILES CHANGED** — bullet list of created/modified files
2. **HOW TO VERIFY** — exact commands to run and URLs to open, with what the reviewer should see
3. **NEEDED FROM ME** — env vars, assets, decisions, or approvals blocking the next phase

Never start the next phase without explicit go.

## Conventions

- Git commit after each approved phase.
- No placeholder lorem ipsum: write real dealership copy, or mark `[DEALER: fact needed]` where a real business fact is required.
- Semantic HTML everywhere. Real focus states. Keyboard navigable.
