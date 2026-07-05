import { z } from "zod";

/**
 * Vehicle repository — the single seam for inventory data (CLAUDE.md).
 *
 * Today: validates and serves sample data from lib/sample-data/vehicles.ts.
 * Post-signing: swap the `loadVehicles` implementation for the live
 * DMS/Homenet-fed Supabase query. Nothing outside this module may read
 * vehicle data from any other source, and components never touch
 * Supabase for vehicles directly.
 */

export const vehicleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  stockNumber: z.string().min(1),
  year: z.number().int().gte(1990).lte(2027),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().min(1),
  /** USD, whole dollars */
  price: z.number().int().positive(),
  mileage: z.number().int().nonnegative(),
  bodyStyle: z.enum(["SUV", "Sedan", "Truck", "Wagon", "Coupe", "Van", "Hatchback"]),
  exteriorColor: z.string().min(1),
  interiorColor: z.string().min(1),
  drivetrain: z.enum(["FWD", "RWD", "AWD", "4WD"]),
  transmission: z.string().min(1),
  fuel: z.enum(["Gasoline", "Hybrid", "Diesel", "Electric"]),
  mpgCity: z.number().int().positive(),
  mpgHighway: z.number().int().positive(),
  features: z.array(z.string()),
  /** Public paths or absolute URLs; first photo is the primary image */
  photos: z.array(z.string()).min(1),
  status: z.enum(["available", "pending", "sold"]),
  featured: z.boolean(),
  /** One-line merchandising hook shown on cards/hero */
  highlight: z.string().optional(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
/** Raw shape accepted from a data source, pre-validation */
export type VehicleRecord = z.input<typeof vehicleSchema>;

export const INVENTORY_SORTS = ["featured", "price-asc", "price-desc", "year-desc", "mileage-asc"] as const;
export type InventorySort = (typeof INVENTORY_SORTS)[number];

export type InventoryFilters = {
  bodyStyle?: Vehicle["bodyStyle"];
  make?: string;
  maxPrice?: number;
  sort?: InventorySort;
};

async function loadVehicles(): Promise<Vehicle[]> {
  // SEAM: replace with Supabase/DMS query post-signing.
  const { sampleVehicles } = await import("@/lib/sample-data/vehicles");
  return z.array(vehicleSchema).parse(sampleVehicles);
}

const sorters: Record<InventorySort, (a: Vehicle, b: Vehicle) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "year-desc": (a, b) => b.year - a.year,
  "mileage-asc": (a, b) => a.mileage - b.mileage,
};

export async function getVehicles(filters: InventoryFilters = {}): Promise<Vehicle[]> {
  const vehicles = await loadVehicles();
  return vehicles
    .filter((v) => v.status !== "sold")
    .filter((v) => (filters.bodyStyle ? v.bodyStyle === filters.bodyStyle : true))
    .filter((v) => (filters.make ? v.make.toLowerCase() === filters.make.toLowerCase() : true))
    .filter((v) => (filters.maxPrice ? v.price <= filters.maxPrice : true))
    .sort(sorters[filters.sort ?? "featured"]);
}

export async function getMakes(): Promise<string[]> {
  const vehicles = await loadVehicles();
  return [...new Set(vehicles.filter((v) => v.status !== "sold").map((v) => v.make))].sort();
}

export async function getSimilarVehicles(vehicle: Vehicle, limit = 3): Promise<Vehicle[]> {
  const vehicles = await loadVehicles();
  return vehicles
    .filter((v) => v.id !== vehicle.id && v.status === "available")
    .sort(
      (a, b) =>
        Number(b.bodyStyle === vehicle.bodyStyle) - Number(a.bodyStyle === vehicle.bodyStyle) ||
        Math.abs(a.price - vehicle.price) - Math.abs(b.price - vehicle.price),
    )
    .slice(0, limit);
}

export async function getFeaturedVehicles(limit = 4): Promise<Vehicle[]> {
  const vehicles = await loadVehicles();
  return vehicles.filter((v) => v.featured && v.status === "available").slice(0, limit);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await loadVehicles();
  return vehicles.find((v) => v.slug === slug) ?? null;
}

export function vehicleTitle(v: Vehicle): string {
  return `${v.year} ${v.make} ${v.model} ${v.trim}`;
}
