"use server";

import type { z } from "zod";
import { getVehicleBySlug, vehicleTitle } from "@/lib/inventory";
import { notifyLead } from "@/lib/leads/notify";
import {
  MIN_TIME_ON_PAGE_MS,
  contactSchema,
  formatPhoneForHumans,
  leadPayloadFromFormData,
  prequalSchema,
  testDriveSchema,
  tradeInSchema,
  type LeadFormState,
  type LeadType,
} from "@/lib/leads/schema";
import { saveLead } from "@/lib/leads/store";

/**
 * All lead mutations via Server Actions (CLAUDE.md).
 * Shared pipeline, anti-spam order: honeypot → time-on-page → Zod.
 * The honeypot returns a fake success so bots learn nothing.
 */
async function processLead<S extends z.ZodType>(
  formData: FormData,
  schema: S,
  onValid: (data: z.infer<S>) => Promise<LeadFormState | void>,
): Promise<LeadFormState> {
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success" };
  }

  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_TIME_ON_PAGE_MS) {
    return {
      status: "error",
      message: "That went through a little too fast — please try again.",
    };
  }

  const parsed = schema.safeParse(leadPayloadFromFormData(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  return (await onValid(parsed.data)) ?? { status: "success" };
}

function contactLines(lead: { name: string; phone: string; email?: string }): string[] {
  return [
    `Name: ${lead.name}`,
    `Phone: ${formatPhoneForHumans(lead.phone)}`,
    `Email: ${lead.email || "—"}`,
    `TCPA consent: yes`,
  ];
}

async function record(type: LeadType, subject: string, lead: Record<string, unknown>, lines: string[]) {
  await saveLead(type, lead);
  await notifyLead({ type, subject, lines });
}

export async function submitTestDriveLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, testDriveSchema, async (lead) => {
    const vehicle = await getVehicleBySlug(lead.vehicleSlug);
    if (!vehicle) {
      return {
        status: "error",
        message: "This vehicle is no longer available — call us and we'll find you its twin.",
      };
    }
    const title = vehicleTitle(vehicle);
    await record("test_drive", `Test drive lead: ${title} — ${lead.name}`, lead, [
      `Vehicle: ${title} (${lead.vehicleSlug})`,
      ...contactLines(lead),
      `Preferred time: ${lead.window}`,
    ]);
  });
}

export async function submitPrequalLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, prequalSchema, async (lead) => {
    await record("prequal", `Financing pre-qual lead — ${lead.name}`, lead, [
      ...contactLines(lead),
      `Employment: ${lead.employment}`,
      `Income range: ${lead.income}`,
      `Down payment: ${lead.downPayment}`,
      `Credit (self-reported): ${lead.creditTier}`,
    ]);
  });
}

export async function submitTradeInLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, tradeInSchema, async (lead) => {
    await record("trade_in", `Trade-in lead: ${lead.year} ${lead.make} ${lead.model} — ${lead.name}`, lead, [
      `Vehicle: ${lead.year} ${lead.make} ${lead.model}`,
      `Mileage: ${lead.mileage.toLocaleString("en-US")} mi`,
      `Condition: ${lead.condition}`,
      ...contactLines(lead),
    ]);
  });
}

export async function submitContactLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, contactSchema, async (lead) => {
    await record("contact", `Website inquiry — ${lead.name}`, lead, [
      ...contactLines(lead),
      `Message:`,
      lead.message,
    ]);
  });
}
