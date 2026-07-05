/**
 * Inventory feed ingestion — Phase 7 seam.
 *
 * Maps a DMS feed export (CSV or JSON; Homenet/vAuto column names below)
 * through the SAME Zod schema the site uses (lib/inventory.ts), then
 * upserts into Supabase. Bad rows are reported and skipped — one corrupt
 * feed line never takes the site down.
 *
 * Usage:
 *   npx tsx scripts/ingest-inventory.ts path/to/feed.json
 *   npx tsx scripts/ingest-inventory.ts path/to/feed.csv
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 * Schedule nightly (Vercel cron / GitHub Action) + on-demand after
 * trade-ins land. Photos: upload to the `vehicle-photos` bucket and
 * emit public URLs into the photos column (TODO when feed access lands).
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { vehicleSchema, type VehicleRecord } from "../lib/inventory";

/** Homenet/vAuto-style row → repository shape. Adjust once the real feed sample arrives. */
function mapFeedRow(row: Record<string, string>): VehicleRecord {
  const slug = [row.ModelYear, row.Make, row.Model, row.Trim, row.StockNumber]
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: `v-${row.StockNumber}`,
    slug,
    stockNumber: row.StockNumber,
    year: Number(row.ModelYear),
    make: row.Make,
    model: row.Model,
    trim: row.Trim || "Base",
    price: Math.round(Number(row.SellingPrice)),
    mileage: Math.round(Number(row.Miles)),
    bodyStyle: (row.BodyStyle as VehicleRecord["bodyStyle"]) ?? "Sedan",
    exteriorColor: row.ExteriorColor,
    interiorColor: row.InteriorColor,
    drivetrain: (row.Drivetrain as VehicleRecord["drivetrain"]) ?? "FWD",
    transmission: row.Transmission,
    fuel: (row.FuelType as VehicleRecord["fuel"]) ?? "Gasoline",
    mpgCity: Number(row.CityMPG) || 20,
    mpgHighway: Number(row.HighwayMPG) || 28,
    features: (row.Options ?? "").split("|").filter(Boolean),
    photos: (row.PhotoURLs ?? "").split("|").filter(Boolean),
    status: "available",
    featured: row.SpecialFlag === "Y",
  };
}

function parseCsv(text: string): Record<string, string>[] {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());
  return lines.map((line) => {
    // Naive CSV split — replace with a real parser (csv-parse) if the
    // production feed quotes commas.
    const cells = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? "").trim()]));
  });
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/ingest-inventory.ts <feed.csv|feed.json>");
    process.exit(1);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const raw = readFileSync(file, "utf8");
  const rows: Record<string, string>[] = file.endsWith(".json")
    ? JSON.parse(raw)
    : parseCsv(raw);

  const valid: VehicleRecord[] = [];
  const failures: { row: number; error: string }[] = [];
  rows.forEach((row, i) => {
    const parsed = vehicleSchema.safeParse(mapFeedRow(row));
    if (parsed.success) valid.push(parsed.data);
    else failures.push({ row: i + 2, error: parsed.error.issues[0]?.message ?? "invalid" });
  });

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const dbRows = valid.map((v) => ({
    id: v.id,
    slug: v.slug,
    stock_number: v.stockNumber,
    year: v.year,
    make: v.make,
    model: v.model,
    trim: v.trim,
    price: v.price,
    mileage: v.mileage,
    body_style: v.bodyStyle,
    exterior_color: v.exteriorColor,
    interior_color: v.interiorColor,
    drivetrain: v.drivetrain,
    transmission: v.transmission,
    fuel: v.fuel,
    mpg_city: v.mpgCity,
    mpg_highway: v.mpgHighway,
    features: v.features,
    photos: v.photos,
    status: v.status,
    featured: v.featured,
    highlight: v.highlight ?? null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("vehicles").upsert(dbRows, { onConflict: "id" });
  if (error) {
    console.error("Upsert failed:", error.message);
    process.exit(1);
  }

  // Vehicles absent from the feed are sold — mark, don't delete (VDPs 301
  // to similar inventory instead of 404ing; preserves SEO equity).
  const feedIds = valid.map((v) => v.id);
  if (feedIds.length > 0) {
    await supabase
      .from("vehicles")
      .update({ status: "sold" })
      .not("id", "in", `(${feedIds.map((x) => `"${x}"`).join(",")})`);
  }

  console.log(`Ingested ${valid.length}/${rows.length} vehicles.`);
  failures.forEach((f) => console.warn(`  row ${f.row}: ${f.error}`));
}

main();
