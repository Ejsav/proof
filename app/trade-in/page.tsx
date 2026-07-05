import type { Metadata } from "next";
import { TradeInForm } from "@/components/forms/TradeInForm";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Value Your Trade-In",
  description:
    "Find out what your car is worth at AutoMax Branford. Tell us what you drive and get a fast, fair trade number by call or text.",
};

const steps = [
  {
    title: "Tell us what you drive",
    body: "Year, make, model, mileage, and your honest read on condition. Thirty seconds, no photos required to start.",
  },
  {
    title: "We price it against the live market",
    body: "Real auction and retail data for your exact vehicle in Connecticut — not a lowball formula.",
  },
  {
    title: "Get your number by call or text",
    body: "Usually within the hour during business hours. Bring the car in and we'll confirm it on the spot.",
  },
];

export default function TradeInPage() {
  return (
    <Section as="header" size="sm">
      <p className="label-caps text-ink-faint">Trade-in</p>
      <h1 className="mt-2 max-w-2xl text-h1">What&apos;s your car worth?</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        Often more than the big-box online offers — and you skip the drop-off
        appointment and the haggle.
      </p>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          {/* CSS entrance, not Reveal: above the fold on mobile — must not
              gate LCP on hydration */}
          <ol className="space-y-8">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="hero-rise"
                style={{ "--rise-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <h2 className="text-h3">
                  <span className="text-ink-faint">{i + 1}. </span>
                  {s.title}
                </h2>
                <p className="mt-2 max-w-sm text-body text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <Reveal delay={0.1}>
          <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-h3">Start your valuation</h2>
            <div className="mt-6">
              <TradeInForm />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
