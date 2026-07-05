import "server-only";
import { formatPhoneForHumans, type LeadType } from "@/lib/leads/schema";
import { site } from "@/lib/site";

/**
 * Speed-to-lead SMS autoresponder — Phase 8 seam (Twilio).
 * Responding within 5 minutes is the single biggest close-rate lever in
 * auto retail; this fires the instant a lead lands. Demo mode logs.
 *
 * TCPA: only ever called AFTER the lead checked the consent box (the Zod
 * schema makes consent a hard requirement — this function cannot run
 * without it). Every message includes opt-out language.
 */
const RESPONSES: Record<LeadType, string> = {
  test_drive: `Thanks for booking a test drive with ${site.name}! We're confirming your slot now and will text you shortly. Need it sooner? Call ${site.phone.sales.display}. Reply STOP to opt out.`,
  prequal: `Got your pre-qualification request at ${site.name} — our finance team is on it (soft check only, no credit impact). Questions? ${site.phone.sales.display}. Reply STOP to opt out.`,
  trade_in: `We're pricing your trade now at ${site.name} — expect your number within the hour during business hours. ${site.phone.sales.display}. Reply STOP to opt out.`,
  contact: `Thanks for reaching out to ${site.name} — a real person is reading your message now. ${site.phone.sales.display}. Reply STOP to opt out.`,
};

export async function sendLeadAutoresponse(type: LeadType, phoneDigits: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const body = RESPONSES[type];

  if (!sid || !token || !from) {
    console.info(
      `[sms:demo-mode] Would text ${formatPhoneForHumans(phoneDigits)}: "${body.slice(0, 80)}…"`,
    );
    return;
  }

  // Twilio REST API via fetch — no SDK dependency for one endpoint.
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: `+1${phoneDigits}`, From: from, Body: body }),
  });

  if (!res.ok) {
    console.error("[sms:send-failed]", res.status, await res.text().catch(() => ""));
  }
}
