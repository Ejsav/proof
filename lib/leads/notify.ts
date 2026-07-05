import "server-only";
import { Resend } from "resend";
import type { LeadType } from "@/lib/leads/schema";
import { site } from "@/lib/site";

/**
 * Lead notification via Resend (CLAUDE.md: every submission notifies).
 * Demo mode: without RESEND_API_KEY the lead is logged server-side so
 * the flow stays testable end-to-end before env vars are provisioned.
 */
export async function notifyLead(opts: {
  type: LeadType;
  subject: string;
  lines: string[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const body = opts.lines.join("\n");

  if (!apiKey || !to) {
    console.info(`[lead:demo-mode] ${opts.type} lead (Resend not configured):\n${body}`);
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `${site.name} Leads <onboarding@resend.dev>`,
    to,
    subject: opts.subject,
    text: body,
  });

  if (error) {
    // Never lose a lead to a mail failure — surface loudly in logs.
    console.error(`[lead:notify-failed] ${opts.type}`, error, "\n" + body);
  }
}

/**
 * Deliver ADF/XML to the dealer CRM's lead inbox (VinSolutions et al.
 * ingest leads from a designated email address). No-op until
 * LEAD_ADF_EMAIL is configured.
 */
export async function notifyAdf(type: LeadType, subject: string, adfXml: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_ADF_EMAIL;
  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `${site.name} Leads <onboarding@resend.dev>`,
    to,
    subject,
    text: adfXml,
  });
  if (error) console.error(`[lead:adf-failed] ${type}`, error);
}
