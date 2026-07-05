import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { segments } from "@/lib/segments";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import {
  INVENTORY_SORTS,
  getMakes,
  getVehicles,
  type InventorySort,
  type Vehicle,
} from "@/lib/inventory";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Used Car Inventory",
  description:
    "Browse quality used cars, trucks and SUVs at AutoMax Branford in Branford, CT. Every vehicle inspected and market-priced.",
};

const BODY_STYLES = ["SUV", "Sedan", "Truck", "Wagon", "Coupe", "Van", "Hatchback"] as const;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const bodyStyleParam = first(params.bodyStyle);
  const sortParam = first(params.sort);
  const maxPriceParam = Number(first(params.maxPrice));

  const [vehicles, makes] = await Promise.all([
    getVehicles({
      bodyStyle: (BODY_STYLES as readonly string[]).includes(bodyStyleParam ?? "")
        ? (bodyStyleParam as Vehicle["bodyStyle"])
        : undefined,
      make: first(params.make),
      maxPrice: Number.isFinite(maxPriceParam) && maxPriceParam > 0 ? maxPriceParam : undefined,
      sort: (INVENTORY_SORTS as readonly string[]).includes(sortParam ?? "")
        ? (sortParam as InventorySort)
        : undefined,
    }),
    getMakes(),
  ]);

  return (
    <Section as="header" size="sm">
      <p className="label-caps text-ink-faint">Inspected · Market-priced · Ready today</p>
      <h1 className="mt-2 text-h1">Browse our inventory</h1>

      <div className="mt-10 border-y border-neutral-200 py-6">
        <InventoryFilters
          makes={makes}
          values={{
            bodyStyle: first(params.bodyStyle) ?? "",
            make: first(params.make) ?? "",
            maxPrice: first(params.maxPrice) ?? "",
            sort: first(params.sort) ?? "",
          }}
        />
      </div>

      <p className="mt-6 text-small text-ink-muted" role="status">
        {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"}
      </p>

      <h2 className="sr-only">Available vehicles</h2>
      {vehicles.length > 0 ? (
        <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, i) => (
            <li key={vehicle.id}>
              <VehicleCard vehicle={vehicle} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <h2 className="text-h3">Nothing matches those filters — yet.</h2>
          <p className="mx-auto mt-3 max-w-md text-body text-ink-muted">
            Inventory turns fast here. Tell us what you&apos;re after and we&apos;ll
            call you the moment it rolls in.
          </p>
          <a href={site.phone.sales.tel} className={buttonClasses("primary", "md", "mt-8")}>
            <Phone className="size-4" aria-hidden="true" />
            {site.phone.sales.display}
          </a>
        </div>
      )}

      <nav aria-label="Popular searches" className="mt-16 border-t border-neutral-200 pt-8">
        <h2 className="label-caps text-ink-muted">Popular searches</h2>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-small">
          {segments.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/used-cars/${s.slug}`}
                className="text-ink-muted underline decoration-neutral-300 underline-offset-4 transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-12 text-caption text-ink-faint">{site.disclaimer}</p>
    </Section>
  );
}
