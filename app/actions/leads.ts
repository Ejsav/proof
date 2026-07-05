"use server";

import { getVehicleBySlug, vehicleTitle } from "@/lib/inventory";
import { notifyTestDriveLead } from "@/lib/leads/notify";
import {
  MIN_TIME_ON_PAGE_MS,
  testDriveSchema,
  type LeadFormState,
} from "@/lib/leads/schema";
import { saveTestDriveLead } from "@/lib/leads/store";

/**
 * Test drive lead — all mutations via Server Actions (CLAUDE.md).
 * Anti-spam order: honeypot → time-on-page → Zod. The honeypot returns
 * a fake success so bots learn nothing.
 */
export async function submitTestDriveLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: real users never see or fill "company"
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success" };
  }

  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    window: String(formData.get("window") ?? ""),
    tcpaConsent: formData.get("tcpaConsent") === "on",
  };

  // Time-on-page: reject sub-3-second submissions
  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_TIME_ON_PAGE_MS) {
    return {
      status: "error",
      message: "That went through a little too fast — please try again.",
      values,
    };
  }

  const parsed = testDriveSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    window: formData.get("window"),
    tcpaConsent: formData.get("tcpaConsent") === "on",
    vehicleSlug: formData.get("vehicleSlug"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  const vehicle = await getVehicleBySlug(parsed.data.vehicleSlug);
  if (!vehicle) {
    return {
      status: "error",
      message: "This vehicle is no longer available — call us and we'll find you its twin.",
      values,
    };
  }

  await saveTestDriveLead(parsed.data);
  await notifyTestDriveLead(parsed.data, vehicleTitle(vehicle));

  return { status: "success" };
}
