import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: `Visit AutoMax Branford at ${fullAddress} or call ${site.phone.sales.display}.`,
};

export default function ContactPage() {
  return (
    <Section as="header">
      <h1 className="text-h1">Visit AutoMax Branford</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        {fullAddress} — or call{" "}
        <a href={site.phone.sales.tel} className="font-medium text-ink underline decoration-neutral-400 underline-offset-4">
          {site.phone.sales.display}
        </a>
        .
      </p>
    </Section>
  );
}
