import { site, fullAddress } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { vehicleTitle, type Vehicle } from "@/lib/inventory";

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function siteUrl(path: string): string {
  return `${SITE_ORIGIN}${path === "/" ? "" : path}` || SITE_ORIGIN;
}

/** schema.org AutoDealer — rendered once, sitewide (layout). */
export function autoDealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    url: SITE_ORIGIN,
    telephone: site.phone.sales.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
      },
    ],
    description: `Independent used car dealership at ${fullAddress}.`,
  };
}

/** schema.org Vehicle + Offer for a VDP. */
export function vehicleJsonLd(vehicle: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicleTitle(vehicle),
    url: siteUrl(`/inventory/${vehicle.slug}`),
    vehicleModelDate: vehicle.year,
    manufacturer: { "@type": "Organization", name: vehicle.make },
    model: vehicle.model,
    vehicleConfiguration: vehicle.trim,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    bodyType: vehicle.bodyStyle,
    color: vehicle.exteriorColor,
    vehicleInteriorColor: vehicle.interiorColor,
    driveWheelConfiguration: vehicle.drivetrain,
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuel,
    sku: vehicle.stockNumber,
    image: vehicle.photos.map((p) => siteUrl(p)),
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "USD",
      availability:
        vehicle.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: vehicle.price,
        priceCurrency: "USD",
        description: site.disclaimer,
      },
      seller: { "@type": "AutoDealer", name: site.name, telephone: site.phone.sales.e164 },
    },
  };
}

export function jsonLdScript(data: object): string {
  // < escaped to prevent script-context breakout if any field ever carries markup
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function formatVehicleOgDescription(vehicle: Vehicle): string {
  return `${formatPrice(vehicle.price)} · ${vehicle.mileage.toLocaleString("en-US")} mi · ${vehicle.drivetrain}. ${site.name}, ${site.address.city}, ${site.address.state}. Call ${site.phone.sales.display}.`;
}
