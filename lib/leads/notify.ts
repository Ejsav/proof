import "server-only";
import { Resend } from "resend";
import type { TestDriveLead } from "@/lib/leads/schema";
import { site } from "@/lib/site";

/**
 * Lead notification via Resend (CLAUDE.md: every submission notifies).
 * Demo mode: without RESEND_API_KEY the lead is logged server-side so
 * the flow stays testable end-to-end before env vars are provisioned.
 */
export async function notifyTestDriveLead(lead: TestDriveLead, vehicleTitle: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  const formattedPhone = `(${lead.phone.slice(0, 3)}) ${lead.phone.slice(3, 6)}-${lead.phone.slice(6)}`;
  const lines = [
    `Vehicle: ${vehicleTitle} (${lead.vehicleSlug})`,
    `Name: ${lead.name}`,
    `Phone: ${formattedPhone}`,
    `Email: ${lead.email || "—"}`,
    `Preferred time: ${lead.window}`,
    `TCPA consent: yes`,
  ];

  if (!apiKey || !to) {
    console.info("[lead:demo-mode] Test drive lead (Resend not configured):\n" + lines.join("\n"));
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `${site.name} Leads <onboarding@resend.dev>`,
    to,
    subject: `Test drive lead: ${vehicleTitle} — ${lead.name}`,
    text: lines.join("\n"),
  });

  if (error) {
    // Never lose a lead to a mail failure — surface loudly in logs.
    console.error("[lead:notify-failed]", error, "\n" + lines.join("\n"));
  }
}
