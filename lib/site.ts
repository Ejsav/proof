/**
 * Single source of truth for dealership facts.
 * Every component reads from here — never hardcode NAP data in markup.
 *
 * PLATFORM SEAM (Phase 10): this object IS the tenant config. The
 * multi-tenant build resolves a DealerConfig per hostname (one config
 * row per store) and injects it here; components don't change. Brand
 * theming rides the same seam via the token block in globals.css.
 */
export type DealerConfig = {
  name: string;
  legalName: string;
  tagline: string;
  address: { street: string; city: string; state: string; zip: string };
  phone: {
    sales: { display: string; tel: string; e164: string };
    text: { display: string; sms: string; e164: string };
  };
  hours: ReadonlyArray<{
    days: string;
    open: string | null;
    close: string | null;
    schema: string | null;
  }>;
  disclaimer: string;
  nav: ReadonlyArray<{ label: string; href: string }>;
};

export const site = {
  name: "AutoMax Branford",
  legalName: "AutoMax Branford",
  tagline: "Quality used cars in Branford, CT",
  address: {
    street: "544 West Main St",
    city: "Branford",
    state: "CT",
    zip: "06405",
  },
  phone: {
    /** Sales line — all tap-to-call actions */
    sales: {
      display: "(203) 433-4212",
      tel: "tel:+12034334212",
      e164: "+12034334212",
    },
    /** Text line — sticky bar "Text" button only */
    text: {
      display: "(475) 260-5157",
      sms: "sms:+14752605157",
      e164: "+14752605157",
    },
  },
  hours: [
    { days: "Monday – Friday", open: "9:00 AM", close: "6:00 PM", schema: "Mo-Fr 09:00-18:00" },
    { days: "Saturday", open: "9:00 AM", close: "5:00 PM", schema: "Sa 09:00-17:00" },
    { days: "Sunday", open: null, close: null, schema: null },
  ],
  disclaimer: "Prices exclude tax, title, registration and dealer fees.",
  nav: [
    { label: "Inventory", href: "/inventory" },
    { label: "Financing", href: "/financing" },
    { label: "Trade-In", href: "/trade-in" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const satisfies DealerConfig;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
