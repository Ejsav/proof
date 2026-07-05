"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const bodyStyles = ["SUV", "Sedan", "Truck", "Wagon", "Coupe", "Van", "Hatchback"];
const priceCaps = [
  ["20000", "Under $20,000"],
  ["25000", "Under $25,000"],
  ["30000", "Under $30,000"],
] as const;
const sorts = [
  ["featured", "Featured first"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["year-desc", "Year: newest"],
  ["mileage-asc", "Mileage: lowest"],
] as const;

export type FilterValues = {
  bodyStyle: string;
  make: string;
  maxPrice: string;
  sort: string;
};

/**
 * Server-driven filter state (props from searchParams) — no
 * useSearchParams/Suspense, so the row renders in the first paint
 * with zero layout shift.
 */
export function InventoryFilters({ makes, values }: { makes: string[]; values: FilterValues }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const hasFilters = Boolean(values.bodyStyle || values.make || values.maxPrice || values.sort);

  function update(key: keyof FilterValues, value: string) {
    const next = new URLSearchParams();
    const merged = { ...values, [key]: value };
    for (const [k, v] of Object.entries(merged)) {
      if (v && !(k === "sort" && v === "featured")) next.set(k, v);
    }
    startTransition(() => {
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    });
  }

  return (
    <div
      className="flex flex-wrap items-end gap-4"
      data-pending={isPending || undefined}
      aria-label="Filter inventory"
    >
      <Select
        label="Body style"
        name="bodyStyle"
        value={values.bodyStyle}
        onChange={(e) => update("bodyStyle", e.target.value)}
        className="w-40"
      >
        <option value="">All</option>
        {bodyStyles.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </Select>
      <Select
        label="Make"
        name="make"
        value={values.make}
        onChange={(e) => update("make", e.target.value)}
        className="w-40"
      >
        <option value="">All</option>
        {makes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>
      <Select
        label="Max price"
        name="maxPrice"
        value={values.maxPrice}
        onChange={(e) => update("maxPrice", e.target.value)}
        className="w-44"
      >
        <option value="">Any</option>
        {priceCaps.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </Select>
      <Select
        label="Sort by"
        name="sort"
        value={values.sort || "featured"}
        onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)}
        className="w-48"
      >
        {sorts.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-0.5"
          onClick={() =>
            startTransition(() => {
              router.replace(pathname, { scroll: false });
            })
          }
        >
          Reset
        </Button>
      )}
    </div>
  );
}
