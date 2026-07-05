import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AutoMax Branford is an independent used car dealership at 544 West Main St, Branford, CT.",
};

export default function AboutPage() {
  return (
    <Section as="header">
      <h1 className="text-h1">About AutoMax Branford</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        An independent dealership on West Main Street. [DEALER: fact needed —
        years in business, team, and story for this page.]
      </p>
    </Section>
  );
}
