import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatMiles, formatPrice } from "@/lib/format";
import { vehicleTitle, type Vehicle } from "@/lib/inventory";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const title = vehicleTitle(vehicle);

  return (
    <Card as="article" interactive className="group overflow-hidden">
      <Link href={`/inventory/${vehicle.slug}`} className="block focus-visible:outline-none">
        <div className="relative aspect-3/2 overflow-hidden bg-neutral-100">
          <Image
            src={vehicle.photos[0]}
            alt={`${title} in ${vehicle.exteriorColor}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.03]"
          />
          {vehicle.status === "pending" && (
            <span className="absolute left-4 top-4">
              <Badge variant="neutral" className="bg-white/90">Sale pending</Badge>
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="label-caps text-ink-faint">
            {vehicle.bodyStyle} · Stock {vehicle.stockNumber}
          </p>
          <h3 className="mt-2 text-h3 text-ink">{title}</h3>
          <p className="mt-1 text-small text-ink-muted">
            {formatMiles(vehicle.mileage)} · {vehicle.drivetrain} · {vehicle.mpgCity}/{vehicle.mpgHighway} mpg
          </p>
          <p className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-h3 font-semibold text-accent-600">
              {formatPrice(vehicle.price)}
            </span>
            <span className="text-small font-medium text-ink-muted transition-colors duration-(--duration-fast) ease-(--ease-out) group-hover:text-ink">
              View details →
            </span>
          </p>
        </div>
      </Link>
    </Card>
  );
}
