"use server";

import type { z } from "zod";
import { getVehicleBySlug, vehicleTitle } from "@/lib/inventory";
import { buildAdfXml, type AdfLead } from "@/lib/leads/adf";
import { notifyAdf, notifyLead } from "@/lib/leads/notify";
import { sendLeadAutoresponse } from "@/lib/leads/sms";
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

async function record(
  type: LeadType,
  subject: string,
  lead: Record<string, unknown>,
  lines: string[],
  adf: AdfLead,
) {
  await saveLead(type, lead);
  await notifyLead({ type, subject, lines });
  // CRM handoff + speed-to-lead SMS: both no-op until their env vars land,
  // and neither can block or lose the primary notification above.
  await Promise.allSettled([
    notifyAdf(type, subject, buildAdfXml(adf)),
    sendLeadAutoresponse(type, adf.phone),
  ]);
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
    await record(
      "test_drive",
      `Test drive lead: ${title} — ${lead.name}`,
      lead,
      [`Vehicle: ${title} (${lead.vehicleSlug})`, ...contactLines(lead), `Preferred time: ${lead.window}`],
      {
        type: "test_drive",
        name: lead.name,
        phone: lead.phone,
        email: lead.email || undefined,
        comments: `Test drive request — preferred time: ${lead.window}`,
        vehicle: {
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          trim: vehicle.trim,
          stock: vehicle.stockNumber,
        },
      },
    );
  });
}

export async function submitPrequalLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, prequalSchema, async (lead) => {
    await record(
      "prequal",
      `Financing pre-qual lead — ${lead.name}`,
      lead,
      [
        ...contactLines(lead),
        `Employment: ${lead.employment}`,
        `Income range: ${lead.income}`,
        `Down payment: ${lead.downPayment}`,
        `Credit (self-reported): ${lead.creditTier}`,
      ],
      {
        type: "prequal",
        name: lead.name,
        phone: lead.phone,
        email: lead.email || undefined,
        comments: `Pre-qualification: ${lead.employment}, income ${lead.income}, down ${lead.downPayment}, credit ${lead.creditTier}`,
      },
    );
  });
}

export async function submitTradeInLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, tradeInSchema, async (lead) => {
    await record(
      "trade_in",
      `Trade-in lead: ${lead.year} ${lead.make} ${lead.model} — ${lead.name}`,
      lead,
      [
        `Vehicle: ${lead.year} ${lead.make} ${lead.model}`,
        `Mileage: ${lead.mileage.toLocaleString("en-US")} mi`,
        `Condition: ${lead.condition}`,
        ...contactLines(lead),
      ],
      {
        type: "trade_in",
        name: lead.name,
        phone: lead.phone,
        email: lead.email || undefined,
        comments: `Trade-in: ${lead.year} ${lead.make} ${lead.model}, ${lead.mileage} mi, ${lead.condition}`,
      },
    );
  });
}

export async function submitContactLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return processLead(formData, contactSchema, async (lead) => {
    await record(
      "contact",
      `Website inquiry — ${lead.name}`,
      lead,
      [...contactLines(lead), `Message:`, lead.message],
      {
        type: "contact",
        name: lead.name,
        phone: lead.phone,
        email: lead.email || undefined,
        comments: lead.message,
      },
    );
  });
}
