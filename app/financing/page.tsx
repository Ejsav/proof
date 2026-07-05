import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Financing & Pre-Qualification",
  description:
    "Get pre-qualified for auto financing at AutoMax Branford in minutes — no impact to your credit score.",
};

export default function FinancingPage() {
  return (
    <Section as="header">
      <h1 className="text-h1">Get pre-qualified in minutes</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        See what you can afford before you shop — with no impact to your credit score.
      </p>
    </Section>
  );
}
