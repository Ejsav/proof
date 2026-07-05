import type { InventoryFilters } from "@/lib/inventory";
import { site } from "@/lib/site";

/**
 * Programmatic SEO segments (Phase 9): high-intent local searches, each
 * backed by a live repository query so pages never show stale stock.
 * Add a segment = add a row. Generated statically, listed in the sitemap,
 * cross-linked from /inventory.
 */
export type Segment = {
  slug: string;
  /** H1 + title tag base */
  title: string;
  intro: string;
  filters: InventoryFilters;
};

const city = `${site.address.city}, ${site.address.state}`;

export const segments: Segment[] = [
  {
    slug: "used-suvs-under-20000",
    title: `Used SUVs under $20,000 in ${city}`,
    intro:
      "AWD-heavy, Connecticut-ready SUVs that clear our inspection and stay under twenty grand. These move fast — if one fits, call before the weekend.",
    filters: { bodyStyle: "SUV", maxPrice: 20000 },
  },
  {
    slug: "used-suvs-under-25000",
    title: `Used SUVs under $25,000 in ${city}`,
    intro:
      "The sweet spot of the used SUV market: late-model compact SUVs with verified service history, priced to the live market.",
    filters: { bodyStyle: "SUV", maxPrice: 25000 },
  },
  {
    slug: "used-sedans-under-25000",
    title: `Used Sedans under $25,000 in ${city}`,
    intro:
      "Commuter-proof sedans — Camrys, Civics and their kind — inspected, market-priced, and ready for I-95 duty.",
    filters: { bodyStyle: "Sedan", maxPrice: 25000 },
  },
  {
    slug: "used-trucks",
    title: `Used Trucks for Sale in ${city}`,
    intro:
      "Work-ready pickups with the tow packages and service records to prove it. Every truck inspected before it hits the lot.",
    filters: { bodyStyle: "Truck" },
  },
  {
    slug: "used-hondas",
    title: `Used Hondas for Sale in ${city}`,
    intro:
      "CR-Vs, Civics and Accords — the cars that hold their value for a reason. One-owner examples flagged on every listing.",
    filters: { make: "Honda" },
  },
  {
    slug: "used-toyotas",
    title: `Used Toyotas for Sale in ${city}`,
    intro:
      "RAV4s and Camrys with the reliability record Connecticut winters demand, inspected and priced to move.",
    filters: { make: "Toyota" },
  },
];

export function getSegment(slug: string): Segment | undefined {
  return segments.find((s) => s.slug === slug);
}

export function relatedSegments(current: Segment, limit = 3): Segment[] {
  return segments.filter((s) => s.slug !== current.slug).slice(0, limit);
}
