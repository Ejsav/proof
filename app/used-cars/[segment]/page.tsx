import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getVehicles } from "@/lib/inventory";
import { getSegment, relatedSegments, segments } from "@/lib/segments";
import { site } from "@/lib/site";

type Params = { segment: string };

export function generateStaticParams(): Params[] {
  return segments.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { segment: slug } = await params;
  const segment = getSegment(slug);
  if (!segment) return {};
  return {
    title: segment.title,
    description: `${segment.intro} Browse live inventory at ${site.name} or call ${site.phone.sales.display}.`,
  };
}

export default async function SegmentPage({ params }: { params: Promise<Params> }) {
  const { segment: slug } = await params;
  const segment = getSegment(slug);
  if (!segment) notFound();

  const vehicles = await getVehicles(segment.filters);
  const related = relatedSegments(segment);

  return (
    <Section as="header" size="sm">
      <p className="label-caps text-ink-faint">Live inventory · Updated daily</p>
      <h1 className="mt-2 max-w-3xl text-h1">{segment.title}</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">{segment.intro}</p>

      {vehicles.length > 0 ? (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, i) => (
            <li key={vehicle.id}>
              <VehicleCard vehicle={vehicle} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <h2 className="text-h3">Just sold out of these.</h2>
          <p className="mx-auto mt-3 max-w-md text-body text-ink-muted">
            Inventory turns fast. Tell us what you&apos;re after and we&apos;ll call you
            the moment the next one rolls in.
          </p>
          <a href={site.phone.sales.tel} className={buttonClasses("primary", "md", "mt-8")}>
            <Phone className="size-4" aria-hidden="true" />
            {site.phone.sales.display}
          </a>
        </div>
      )}

      <nav aria-label="Related searches" className="mt-16 border-t border-neutral-200 pt-8">
        <h2 className="label-caps text-ink-muted">Popular searches</h2>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-small">
          {related.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/used-cars/${s.slug}`}
                className="text-ink-muted underline decoration-neutral-300 underline-offset-4 transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink"
              >
                {s.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/inventory"
              className="font-medium text-ink underline decoration-neutral-400 underline-offset-4"
            >
              All inventory
            </Link>
          </li>
        </ul>
      </nav>

      <p className="mt-10 text-caption text-ink-faint">{site.disclaimer}</p>
    </Section>
  );
}
