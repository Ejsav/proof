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
 * GSAP is permitted here only. Animates transform/opacity exclusively;
 * full prefers-reduced-motion fallback via gsap.matchMedia.
 */
export function Hero({ spotlight }: { spotlight: Vehicle | null }) {
  const scope = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-hero-line]", {
          y: 56,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
        })
          .from(
            "[data-hero-sub]",
            { y: 32, opacity: 0, duration: 0.9 },
            "-=0.7",
          )
          .from(
            "[data-hero-cta]",
            { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 },
            "-=0.6",
          )
          .from(
            "[data-hero-card]",
            { y: 40, opacity: 0, duration: 1.0 },
            "-=0.6",
          )
          .from(
            "[data-hero-trust]",
            { opacity: 0, y: 16, duration: 0.7 },
            "-=0.5",
          );

        // Slow ambient drift of the glow — transform only, decorative depth
        gsap.to("[data-hero-glow]", {
          xPercent: 12,
          yPercent: -8,
          duration: 14,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          "[data-hero-line], [data-hero-sub], [data-hero-cta], [data-hero-card], [data-hero-trust]",
          { clearProps: "all" },
        );
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
          <p data-hero-trust className="label-caps text-hero-text-muted">
            Independent used car dealer · Branford, CT
          </p>
          <h1 id="hero-heading" className="mt-6 text-display-xl font-semibold">
            <span data-hero-line className="block">The right car.</span>
            <span data-hero-line className="block">The right price.</span>
            <span data-hero-line className="block text-hero-text-muted">No runaround.</span>
          </h1>
          <p data-hero-sub className="mt-6 max-w-lg text-body-lg text-hero-text-muted">
            Inspected, market-priced vehicles on West Main Street. Get pre-qualified
            in minutes — with no impact to your credit score.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <span data-hero-cta>
              <Link href="/inventory" className={buttonClasses("primary", "lg")}>
                Browse inventory
              </Link>
            </span>
            <span data-hero-cta>
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
            </span>
          </div>
          <p data-hero-trust className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-hero-text-muted">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {fullAddress}
            </span>
            <span>Mon–Fri 9–6 · Sat 9–5</span>
          </p>
        </div>

        {spotlight && (
          <div data-hero-card>
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
