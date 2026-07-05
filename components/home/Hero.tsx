"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MapPin, Phone } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { formatMiles, formatPrice } from "@/lib/format";
import { vehicleTitle, type Vehicle } from "@/lib/inventory";
import { site, fullAddress } from "@/lib/site";

/**
 * Homepage hero — the one dark, cinematic moment (CLAUDE.md).
 * Entrance is CSS-driven (hero-rise) so the LCP headline renders
 * immediately with HTML — never gated on hydration. GSAP (permitted in
 * the hero only) handles the ambient glow drift, a purely decorative
 * transform loop, behind a prefers-reduced-motion media query.
 */
export function Hero({ spotlight }: { spotlight: Vehicle | null }) {
  const scope = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-glow]", {
          xPercent: 12,
          yPercent: -8,
          duration: 14,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-hero text-hero-text"
      aria-labelledby="hero-heading"
    >
      {/* Ambient glow — pure decoration */}
      <div
        aria-hidden="true"
        data-hero-glow
        className="pointer-events-none absolute -top-1/3 right-[-20%] size-[52rem] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgb(210 38 48 / 0.28), transparent 70%)",
        }}
      />
      <div className="container-site relative grid items-center gap-16 py-section lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="hero-rise label-caps text-hero-text-muted">
            Independent used car dealer · Branford, CT
          </p>
          <h1 id="hero-heading" className="mt-6 text-display-xl font-semibold">
            <span className="hero-rise-move block">The right car.</span>
            <span className="hero-rise block [--rise-delay:90ms]">The right price.</span>
            <span className="hero-rise block text-hero-text-muted [--rise-delay:180ms]">
              No runaround.
            </span>
          </h1>
          <p className="hero-rise mt-6 max-w-lg text-body-lg text-hero-text-muted [--rise-delay:260ms]">
            Inspected, market-priced vehicles on West Main Street. Get pre-qualified
            in minutes — with no impact to your credit score.
          </p>
          <div className="hero-rise mt-10 flex flex-wrap gap-4 [--rise-delay:340ms]">
            <Link href="/inventory" className={buttonClasses("primary", "lg")}>
              Browse inventory
            </Link>
            <a
              href={site.phone.sales.tel}
              className={buttonClasses(
                "secondary",
                "lg",
                "border-hero-line bg-transparent text-hero-text hover:border-hero-text hover:bg-transparent",
              )}
            >
              <Phone className="size-5" aria-hidden="true" />
              {site.phone.sales.display}
            </a>
          </div>
          <p className="hero-rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-hero-text-muted [--rise-delay:420ms]">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {fullAddress}
            </span>
            <span>Mon–Fri 9–6 · Sat 9–5</span>
          </p>
        </div>

        {spotlight && (
          <div className="hero-rise [--rise-delay:300ms]">
            <Link
              href={`/inventory/${spotlight.slug}`}
              className="group block overflow-hidden rounded-xl border border-hero-line bg-hero-surface shadow-lg transition-transform duration-(--duration-base) ease-(--ease-out) hover:-translate-y-1"
            >
              <div className="relative aspect-3/2 overflow-hidden">
                <Image
                  src={spotlight.photos[0]}
                  alt={`${vehicleTitle(spotlight)} in ${spotlight.exteriorColor}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-baseline justify-between gap-4 p-6">
                <div>
                  <p className="label-caps text-hero-text-muted">Just arrived</p>
                  <p className="mt-2 font-display text-h3 font-semibold">
                    {vehicleTitle(spotlight)}
                  </p>
                  <p className="mt-1 text-small text-hero-text-muted">
                    {formatMiles(spotlight.mileage)} · {spotlight.drivetrain}
                  </p>
                </div>
                <p className="font-display text-h2 font-semibold text-accent-600">
                  {formatPrice(spotlight.price)}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
