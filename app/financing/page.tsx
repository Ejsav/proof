import type { Metadata } from "next";
import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { PaymentEstimator } from "@/components/financing/PaymentEstimator";
import { PrequalForm } from "@/components/forms/PrequalForm";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Financing & Pre-Qualification",
  description:
    "Get pre-qualified for auto financing at AutoMax Branford in minutes — soft check only, no impact to your credit score. All credit situations welcome.",
};

const promises = [
  {
    icon: ShieldCheck,
    title: "No impact to your credit score",
    body: "Pre-qualification is a soft check. We never ask for your Social Security number or date of birth online.",
  },
  {
    icon: BadgeCheck,
    title: "All credit welcome",
    body: "Strong credit, bruised credit, first-time buyer — we work with a network of lenders that competes for your loan. [DEALER: fact needed — lender names]",
  },
  {
    icon: Clock3,
    title: "Answers fast",
    body: "Submit during business hours and our finance team typically calls or texts back within the hour.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <Section as="header" size="sm">
        <p className="label-caps text-ink-faint">Financing</p>
        <h1 className="mt-2 max-w-2xl text-h1">
          Know your number before you shop
        </h1>
        <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
          Two minutes, a few basics, and you&apos;ll know your buying power — with no
          impact to your credit score.
        </p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div id="prequalify" className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="text-h3">Get pre-qualified</h2>
              <div className="mt-6">
                <PrequalForm />
              </div>
            </div>
          </Reveal>
          <div className="space-y-8">
            <Reveal delay={0.08}>
              <PaymentEstimator />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="border-t border-neutral-200 bg-white" size="sm">
        <ul className="grid gap-10 md:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08}>
              <p.icon className="size-6 text-ink" aria-hidden="true" />
              <h2 className="mt-4 text-h3">{p.title}</h2>
              <p className="mt-2 max-w-sm text-body text-ink-muted">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
