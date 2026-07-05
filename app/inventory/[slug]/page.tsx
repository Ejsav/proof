import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { TestDriveForm } from "@/components/forms/TestDriveForm";
import { VehicleCard } from "@/components/inventory/VehicleCard";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { formatMiles, formatPrice } from "@/lib/format";
import {
  getSimilarVehicles,
  getVehicleBySlug,
  getVehicles,
  vehicleTitle,
} from "@/lib/inventory";
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
    description: `${vehicleTitle(vehicle)} with ${formatMiles(vehicle.mileage)} at AutoMax Branford. Book a test drive or call ${site.phone.sales.display}.`,
  };
}

export default async function VehiclePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const similar = await getSimilarVehicles(vehicle);

  const specs: [string, string][] = [
    ["Mileage", formatMiles(vehicle.mileage)],
    ["Body style", vehicle.bodyStyle],
    ["Drivetrain", vehicle.drivetrain],
    ["Transmission", vehicle.transmission],
    ["Fuel", vehicle.fuel],
    ["Fuel economy", `${vehicle.mpgCity} city / ${vehicle.mpgHighway} hwy mpg`],
    ["Exterior", vehicle.exteriorColor],
    ["Interior", vehicle.interiorColor],
    ["Stock #", vehicle.stockNumber],
  ];

  return (
    <>
      <Section as="header" size="sm">
        <Link
          href="/inventory"
          className="group inline-flex items-center gap-2 text-small font-medium text-ink-muted transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:-translate-x-1"
            aria-hidden="true"
          />
          All inventory
        </Link>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
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

            <h2 className="mt-12 label-caps text-ink-faint">Specifications</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
              {specs.map(([label, value]) => (
                <div key={label} className="border-t border-neutral-200 py-4">
                  <dt className="text-caption text-ink-faint">{label}</dt>
                  <dd className="mt-1 text-small font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:sticky lg:top-28">
            <p className="label-caps text-ink-faint">
              {vehicle.bodyStyle} · Stock {vehicle.stockNumber}
            </p>
            <h1 className="mt-3 text-h1">{title}</h1>
            {vehicle.highlight && (
              <p className="mt-3 text-body text-ink-muted">{vehicle.highlight}</p>
            )}
            <p className="mt-6 font-display text-display font-semibold text-accent-600">
              {formatPrice(vehicle.price)}
            </p>
            <p className="mt-1 text-caption text-ink-faint">{site.disclaimer}</p>
            {vehicle.status === "pending" && (
              <p className="mt-4">
                <Badge>Sale pending — call to check availability</Badge>
              </p>
            )}
            <ul className="mt-6 flex flex-wrap gap-2">
              {vehicle.features.map((feature) => (
                <li key={feature}>
                  <Badge variant="outline">{feature}</Badge>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#test-drive" className={buttonClasses("primary", "lg")}>
                Book a test drive
              </a>
              <a href={site.phone.sales.tel} className={buttonClasses("secondary", "lg")}>
                <Phone className="size-5" aria-hidden="true" />
                {site.phone.sales.display}
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section id="test-drive" className="border-t border-neutral-200 bg-white" size="sm">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="label-caps text-ink-faint">No obligation</p>
            <h2 className="mt-2 text-h2">Drive it before you decide</h2>
            <p className="mt-4 max-w-sm text-body text-ink-muted">
              Fifteen minutes behind the wheel beats an hour of reading reviews. Pick a
              window and we&apos;ll have the {vehicle.model} warmed up and out front.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <TestDriveForm vehicleSlug={vehicle.slug} vehicleName={title} />
          </Reveal>
        </div>
      </Section>

      {similar.length > 0 && (
        <Section size="sm">
          <h2 className="text-h2">Worth a look next to it</h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((v) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
