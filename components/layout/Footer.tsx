import Link from "next/link";
import { Phone } from "lucide-react";
import { site, fullAddress } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-100">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* NAP block — schema.org AutoDealer microdata */}
        <div itemScope itemType="https://schema.org/AutoDealer">
          <p className="flex items-baseline gap-1.5 font-display">
            <span className="text-xl font-semibold tracking-tight text-ink" itemProp="name">
              AutoMax Branford
            </span>
          </p>
          <address
            className="mt-4 text-small not-italic text-ink-muted"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <span itemProp="streetAddress">{site.address.street}</span>
            <br />
            <span itemProp="addressLocality">{site.address.city}</span>,{" "}
            <span itemProp="addressRegion">{site.address.state}</span>{" "}
            <span itemProp="postalCode">{site.address.zip}</span>
          </address>
          <p className="mt-4">
            <a
              href={site.phone.sales.tel}
              className="inline-flex items-center gap-2 text-small font-medium text-ink transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-accent-700"
            >
              <Phone className="size-4" aria-hidden="true" />
              <span itemProp="telephone" content={site.phone.sales.e164}>
                {site.phone.sales.display}
              </span>
            </a>
          </p>
          <p className="mt-2 text-small text-ink-muted">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${site.name}, ${fullAddress}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-400 underline-offset-4 transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink"
            >
              Get directions
            </a>
          </p>
        </div>

        {/* Hours */}
        <div>
          <h2 className="label-caps text-ink-muted">Hours</h2>
          <table className="mt-4 w-full text-small">
            <caption className="sr-only">Sales hours for {site.name}</caption>
            <tbody>
              {site.hours.map((row) => (
                <tr key={row.days} className="align-baseline">
                  <th scope="row" className="py-1 pr-4 text-left font-medium text-ink">
                    {row.days}
                  </th>
                  <td className="py-1 text-right text-ink-muted">
                    {row.open ? (
                      <time dateTime={row.schema ?? undefined}>
                        {row.open} – {row.close}
                      </time>
                    ) : (
                      "Closed"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick links / sitemap */}
        <nav aria-label="Footer">
          <h2 className="label-caps text-ink-muted">Explore</h2>
          <ul className="mt-4 space-y-2 text-small">
            {[{ label: "Home", href: "/" }, ...site.nav].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-muted transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-neutral-200">
        <div className="container-site flex flex-col gap-2 py-6 text-caption text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>{site.disclaimer}</p>
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
