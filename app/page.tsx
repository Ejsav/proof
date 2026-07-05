import { Section } from "@/components/ui/Section";

export default function HomePage() {
  return (
    <Section as="header">
      <h1 className="text-display-xl">
        Quality used cars in Branford, priced to move.
      </h1>
      <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
        The cinematic dark hero lands here in Phase 2 — inventory highlights,
        financing pre-qualification, and trade-in paths all one tap away.
      </p>
    </Section>
  );
}
