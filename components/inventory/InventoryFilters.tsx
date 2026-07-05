"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export function InventoryFilters({ makes }: { makes: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasFilters = ["bodyStyle", "make", "maxPrice", "sort"].some((k) => params.has(k));

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
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
        value={params.get("bodyStyle") ?? ""}
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
        value={params.get("make") ?? ""}
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
        value={params.get("maxPrice") ?? ""}
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
        value={params.get("sort") ?? "featured"}
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
