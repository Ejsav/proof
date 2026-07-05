import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CarFront, KeyRound, MapPin, Phone } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getFeaturedVehicles } from "@/lib/inventory";
import { site, fullAddress } from "@/lib/site";

const steps = [
  {
    icon: CarFront,
    title: "Pick your car",
    body: "Browse online or walk the lot. Every vehicle is inspected and priced to the market — the number on the windshield is a real number.",
  },
  {
    icon: BadgeDollarSign,
    title: "Get pre-qualified",
    body: "Two minutes, basic info, no impact to your credit score. Know your buying power before you fall in love with anything.",
  },
  {
    icon: KeyRound,
    title: "Drive it home",
    body: "Test drive same day, paperwork handled in-house. Most customers drive home the day they decide.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedVehicles(4);
  const [spotlight, ...rail] = featured;

  return (
    <>
      <Hero spotlight={spotlight ?? null} />

      {/* Featured inventory rail */}
      <Section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-caps text-ink-faint">Fresh on the lot</p>
              <h2 className="mt-2 text-h2">Recently arrived</h2>
            </div>
            <Link
              href="/inventory"
              className="group inline-flex items-center gap-2 text-small font-medium text-ink transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-accent-700"
            >
              View all inventory
              <ArrowRight
                className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rail.map((vehicle, i) => (
            <Reveal as="li" key={vehicle.id} delay={i * 0.08}>
              <VehicleCard vehicle={vehicle} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* How buying works */}
      <Section className="border-y border-neutral-200 bg-white" size="base">
        <Reveal>
          <p className="label-caps text-ink-faint">No games, no pressure</p>
          <h2 className="mt-2 max-w-md text-h2">Three steps between you and the keys</h2>
        </Reveal>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.1}>
              <div className="flex size-12 items-center justify-center rounded-md bg-neutral-100">
                <step.icon className="size-6 text-ink" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-h3">
                <span className="text-ink-faint">{i + 1}. </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-sm text-body text-ink-muted">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Financing + trade-in conversion paths */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col items-start rounded-xl bg-neutral-900 p-10 text-neutral-50">
              <p className="label-caps text-neutral-400">Financing</p>
              <h2 className="mt-4 text-h2">Know your number before you shop</h2>
              <p className="mt-4 max-w-md text-body text-neutral-400">
                Get pre-qualified in about two minutes with no impact to your credit
                score. Good credit, bruised credit, first-time buyer — we work with a
                network of lenders that says yes.
              </p>
              <Link
                href="/financing"
                className={buttonClasses("primary", "md", "mt-8")}
              >
                Get pre-qualified
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col items-start rounded-xl border border-neutral-200 bg-white p-10">
              <p className="label-caps text-ink-faint">Trade-in</p>
              <h2 className="mt-4 text-h2">Your car is worth real money</h2>
              <p className="mt-4 max-w-md text-body text-ink-muted">
                Tell us what you drive and get a fast, fair trade number — often more
                than the big-box online offers once you&apos;re standing on our lot.
              </p>
              <Link
                href="/trade-in"
                className={buttonClasses("secondary", "md", "mt-8")}
              >
                Value my trade
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Visit */}
      <Section className="border-t border-neutral-200 bg-white">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="label-caps text-ink-faint">Visit the lot</p>
            <h2 className="mt-2 text-h2">On West Main Street, ready when you are</h2>
            <p className="mt-4 flex items-center gap-2 text-body text-ink-muted">
              <MapPin className="size-5 shrink-0 text-ink" aria-hidden="true" />
              {fullAddress}
            </p>
            <p className="mt-2 text-body text-ink-muted">
              Mon–Fri 9:00 AM – 6:00 PM · Sat 9:00 AM – 5:00 PM · Sun closed
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a href={site.phone.sales.tel} className={buttonClasses("primary", "lg")}>
                <Phone className="size-5" aria-hidden="true" />
                {site.phone.sales.display}
              </a>
              <Link href="/contact" className={buttonClasses("secondary", "lg")}>
                Directions &amp; contact
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
