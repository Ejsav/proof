import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { formatMiles, formatPrice } from "@/lib/format";
import { getVehicleBySlug, getVehicles, vehicleTitle } from "@/lib/inventory";
import { site } from "@/lib/site";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicleTitle(vehicle)} — ${formatPrice(vehicle.price)}`,
    description: `${vehicleTitle(vehicle)} with ${formatMiles(vehicle.mileage)} at AutoMax Branford. Call ${site.phone.sales.display} to schedule a test drive.`,
  };
}

/**
 * Minimal detail page — full VDP (gallery, specs table, test-drive form)
 * ships in the inventory phase. Exists now so vehicle cards never 404.
 */
export default async function VehiclePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);

  return (
    <Section as="header">
      <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-3/2 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
          <Image
            src={vehicle.photos[0]}
            alt={`${title} in ${vehicle.exteriorColor}`}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="label-caps text-ink-faint">
            Stock {vehicle.stockNumber} · {vehicle.bodyStyle}
          </p>
          <h1 className="mt-3 text-h1">{title}</h1>
          <p className="mt-2 text-body text-ink-muted">
            {formatMiles(vehicle.mileage)} · {vehicle.drivetrain} · {vehicle.transmission} ·{" "}
            {vehicle.mpgCity}/{vehicle.mpgHighway} mpg
          </p>
          <p className="mt-6 font-display text-display font-semibold text-accent-600">
            {formatPrice(vehicle.price)}
          </p>
          <p className="mt-1 text-caption text-ink-faint">{site.disclaimer}</p>
          {vehicle.status === "pending" && (
            <p className="mt-4">
              <Badge>Sale pending — call to check availability</Badge>
            </p>
          )}
          <ul className="mt-8 flex flex-wrap gap-2">
            {vehicle.features.map((feature) => (
              <li key={feature}>
                <Badge variant="outline">{feature}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={site.phone.sales.tel} className={buttonClasses("primary", "lg")}>
              <Phone className="size-5" aria-hidden="true" />
              Call about this car
            </a>
          </div>
          <p className="mt-4 text-small text-ink-muted">
            Test drive booking and photo gallery arrive with the full inventory build.
          </p>
        </div>
      </div>
    </Section>
  );
}
