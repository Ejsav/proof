import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Used Car Inventory",
  description:
    "Browse quality used cars, trucks and SUVs at AutoMax Branford in Branford, CT.",
};

export default function InventoryPage() {
  return (
    <Section as="header">
      <h1 className="text-h1">Browse our inventory</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        Every vehicle inspected, priced to the market, and ready for a test drive.
      </p>
    </Section>
  );
}
