import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { formatMiles, formatPrice } from "@/lib/format";
import { getVehicleBySlug, vehicleTitle } from "@/lib/inventory";
import { site, fullAddress } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vehicle at AutoMax Branford";

/**
 * OG card for shared VDP links (texts, Facebook Marketplace chats — where
 * used-car shoppers actually share). Uses subset TTFs from assets/og
 * because satori cannot consume the site's woff2 files.
 * [DEALER: swap to Clash Display TTF subset when brand fonts arrive.]
 */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  const [bold, regular] = await Promise.all([
    readFile(path.join(process.cwd(), "assets/og/og-bold.ttf")),
    readFile(path.join(process.cwd(), "assets/og/og-regular.ttf")),
  ]);

  const title = vehicle ? vehicleTitle(vehicle) : site.name;
  const meta = vehicle
    ? `${formatMiles(vehicle.mileage)} · ${vehicle.drivetrain} · ${vehicle.transmission}`
    : fullAddress;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#12100d",
          backgroundImage: "radial-gradient(900px 500px at 85% 0%, rgba(210,38,48,0.25), transparent)",
          color: "#f5f3ef",
          fontFamily: "OGRegular",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "OGBold", fontSize: 34, letterSpacing: -0.5 }}>AUTOMAX</span>
          <span style={{ fontSize: 22, letterSpacing: 4, color: "#a49c8f" }}>BRANFORD</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 96, height: 8, backgroundColor: "#d22630", display: "flex" }} />
          <div style={{ fontFamily: "OGBold", fontSize: 68, lineHeight: 1.08, letterSpacing: -1 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: "#a49c8f" }}>{meta}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 26, color: "#a49c8f" }}>
            {`${site.address.city}, ${site.address.state} · ${site.phone.sales.display}`}
          </div>
          {vehicle && (
            <div style={{ fontFamily: "OGBold", fontSize: 60, color: "#d22630" }}>
              {formatPrice(vehicle.price)}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "OGBold", data: bold, weight: 700 },
        { name: "OGRegular", data: regular, weight: 400 },
      ],
    },
  );
}
