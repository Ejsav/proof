import type { Metadata } from "next";
import { MapPin, MessageSquare, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description: `Visit AutoMax Branford at ${fullAddress}, call ${site.phone.sales.display}, or send a message — a real person reads every one.`,
};

export default function ContactPage() {
  return (
    <Section as="header" size="sm">
      <p className="label-caps text-ink-faint">Contact</p>
      <h1 className="mt-2 text-h1">Visit AutoMax Branford</h1>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8">
          <Reveal>
            <div className="rounded-xl border border-neutral-200 bg-white p-8">
              <h2 className="label-caps text-ink-muted">Find us</h2>
              <p className="mt-4 flex items-start gap-3 text-body text-ink">
                <MapPin className="mt-1 size-5 shrink-0 text-ink" aria-hidden="true" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </span>
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${site.name}, ${fullAddress}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", "sm", "mt-6")}
              >
                Get directions
              </a>

              <h2 className="mt-8 label-caps text-ink-muted">Hours</h2>
              <table className="mt-4 w-full text-small">
                <caption className="sr-only">Sales hours</caption>
                <tbody>
                  {site.hours.map((row) => (
                    <tr key={row.days}>
                      <th scope="row" className="py-1 pr-4 text-left font-medium text-ink">
                        {row.days}
                      </th>
                      <td className="py-1 text-right text-ink-muted">
                        {row.open ? `${row.open} – ${row.close}` : "Closed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="mt-8 label-caps text-ink-muted">Reach us</h2>
              <p className="mt-4">
                <a
                  href={site.phone.sales.tel}
                  className="inline-flex items-center gap-2 text-body font-medium text-ink transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-accent-700"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {site.phone.sales.display}
                  <span className="text-small font-normal text-ink-muted">— sales</span>
                </a>
              </p>
              <p className="mt-2">
                <a
                  href={site.phone.text.sms}
                  className="inline-flex items-center gap-2 text-body font-medium text-ink transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-accent-700"
                >
                  <MessageSquare className="size-4" aria-hidden="true" />
                  {site.phone.text.display}
                  <span className="text-small font-normal text-ink-muted">— text us</span>
                </a>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-h3">Send a message</h2>
            <p className="mt-2 text-small text-ink-muted">
              A real person reads every message — no ticket numbers, no bots.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
