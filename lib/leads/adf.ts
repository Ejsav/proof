import "server-only";
import { formatPhoneForHumans, type LeadType } from "@/lib/leads/schema";
import { site } from "@/lib/site";

/**
 * ADF/XML — the auto industry's universal lead format (Phase 8 seam).
 * Every dealer CRM (VinSolutions, DealerSocket, DriveCentric, eLead)
 * ingests ADF from a designated email address. Attach this to the lead
 * notification (or send to the CRM's ADF inbox via LEAD_ADF_EMAIL) and
 * leads flow into whatever the dealer already uses — zero migration.
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export type AdfLead = {
  type: LeadType;
  name: string;
  phone: string;
  email?: string;
  comments?: string;
  vehicle?: { year: number; make: string; model: string; trim?: string; stock?: string };
};

export function buildAdfXml(lead: AdfLead, requestDate = new Date()): string {
  const [first, ...rest] = lead.name.trim().split(/\s+/);
  const last = rest.join(" ") || first;

  const vehicleBlock = lead.vehicle
    ? `
    <vehicle interest="buy" status="used">
      <year>${lead.vehicle.year}</year>
      <make>${esc(lead.vehicle.make)}</make>
      <model>${esc(lead.vehicle.model)}</model>${
        lead.vehicle.trim ? `\n      <trim>${esc(lead.vehicle.trim)}</trim>` : ""
      }${lead.vehicle.stock ? `\n      <stock>${esc(lead.vehicle.stock)}</stock>` : ""}
    </vehicle>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<?adf version="1.0"?>
<adf>
  <prospect status="new">
    <requestdate>${requestDate.toISOString()}</requestdate>${vehicleBlock}
    <customer>
      <contact>
        <name part="first">${esc(first)}</name>
        <name part="last">${esc(last)}</name>
        <phone type="cellphone">${formatPhoneForHumans(lead.phone)}</phone>${
          lead.email ? `\n        <email>${esc(lead.email)}</email>` : ""
        }
      </contact>${lead.comments ? `\n      <comments>${esc(lead.comments)}</comments>` : ""}
    </customer>
    <vendor>
      <vendorname>${esc(site.name)}</vendorname>
      <contact>
        <name part="full">${esc(site.name)}</name>
        <phone type="voice">${site.phone.sales.display}</phone>
      </contact>
    </vendor>
    <provider>
      <name part="full">${esc(site.name)} Website</name>
      <service>Lead Engine</service>
    </provider>
  </prospect>
</adf>`;
}
