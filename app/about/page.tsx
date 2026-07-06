import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `AutoMax Branford is an independent used car dealership at ${fullAddress}. Inspected vehicles, market pricing, no runaround.`,
};

const commitments = [
  {
    icon: ShieldCheck,
    title: "Every car inspected before it's listed",
    body: "If it doesn't pass, it doesn't hit the lot. [DEALER: fact needed — inspection point count / reconditioning process]",
  },
  {
    icon: Wrench,
    title: "Priced to the market, not to the haggle",
    body: "We price against live retail data for Connecticut. The number on the windshield is a real number — nobody needs a four-square worksheet.",
  },
  {
    icon: MapPin,
    title: "Branford's dealer, not a chain's outpost",
    body: "Independent and local. When something's not right, you talk to the person who can fix it — not a regional office. [DEALER: fact needed — owner name / years in business]",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section as="header" size="sm">
        <p className="label-caps text-ink-faint">About</p>
        <h1 className="mt-2 max-w-2xl text-h1">
          The dealership for people who hate dealerships
        </h1>
        <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
          AutoMax Branford is an independent used car dealer on West Main Street.
          The pitch is simple: inspected cars, honest numbers, and a buying
          process that respects your afternoon.
          [DEALER: fact needed — founding story, one paragraph.]
        </p>
      </Section>

      <Section className="border-y border-neutral-200 bg-white" size="sm">
        <ul className="grid gap-10 md:grid-cols-3">
          {commitments.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.08}>
              <c.icon className="size-6 text-ink" aria-hidden="true" />
              <h2 className="mt-4 text-h3">{c.title}</h2>
              <p className="mt-2 max-w-sm text-body text-ink-muted">{c.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section size="sm">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div>
            <h2 className="text-h2">Come kick the tires</h2>
            <p className="mt-2 max-w-md text-body text-ink-muted">
              {fullAddress} · Mon–Fri 9–6, Sat 9–5. Or start from the couch — the
              whole lot is online.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/inventory" className={buttonClasses("primary", "lg")}>
              Browse inventory
            </Link>
            <a href={site.phone.sales.tel} className={buttonClasses("secondary", "lg")}>
              <Phone className="size-5" aria-hidden="true" />
              {site.phone.sales.display}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
