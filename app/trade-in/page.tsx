import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Value Your Trade-In",
  description:
    "Find out what your car is worth at AutoMax Branford. Fast, fair trade-in offers in Branford, CT.",
};

export default function TradeInPage() {
  return (
    <Section as="header">
      <h1 className="text-h1">What&apos;s your car worth?</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        Get a fast, fair number for your trade — drive in or start online.
      </p>
    </Section>
  );
}
