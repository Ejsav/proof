import { z } from "zod";

/**
 * Lead validation — shared by client (instant feedback) and server
 * (authoritative). CLAUDE.md rules enforced here: minimum fields,
 * honeypot, time-on-page >= 3s, TCPA consent, never SSN/DOB.
 */

export const MIN_TIME_ON_PAGE_MS = 3000;

export type LeadType = "test_drive" | "prequal" | "trade_in" | "contact";

/* ---------- shared option lists (selects render from these) ---------- */

export const TEST_DRIVE_WINDOWS = [
  "Weekday morning",
  "Weekday afternoon",
  "Weekday evening (before 6 PM)",
  "Saturday",
] as const;

export const EMPLOYMENT_STATUSES = [
  "Employed full-time",
  "Employed part-time",
  "Self-employed",
  "Retired",
  "Other",
] as const;

export const INCOME_RANGES = [
  "Under $2,500/mo",
  "$2,500–$4,000/mo",
  "$4,000–$6,000/mo",
  "Over $6,000/mo",
] as const;

export const DOWN_PAYMENT_RANGES = [
  "$0 down",
  "Under $1,000",
  "$1,000–$2,500",
  "$2,500–$5,000",
  "Over $5,000",
] as const;

export const CREDIT_TIERS = [
  "Excellent (720+)",
  "Good (660–719)",
  "Fair (600–659)",
  "Rebuilding (under 600)",
] as const;

export const TRADE_CONDITIONS = ["Excellent", "Good", "Fair", "Needs work"] as const;

/* ---------- shared fields ---------- */

const nameField = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(80, "Please enter a shorter name.");

const phoneField = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((digits) => digits.length === 10 || (digits.length === 11 && digits.startsWith("1")), {
    message: "Enter a 10-digit US phone number.",
  })
  .transform((digits) => (digits.length === 11 ? digits.slice(1) : digits));

const emailField = z
  .string()
  .trim()
  .email("Enter a valid email, or leave it blank.")
  .optional()
  .or(z.literal(""));

const tcpaField = z.literal(true, {
  message: "Please check the consent box so we can call or text you back.",
});

/* ---------- per-form schemas ---------- */

export const testDriveSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  window: z.enum(TEST_DRIVE_WINDOWS, { message: "Pick a time that works for you." }),
  tcpaConsent: tcpaField,
  vehicleSlug: z.string().min(1),
});
export type TestDriveLead = z.infer<typeof testDriveSchema>;

/** Pre-qualification: soft language only, NO SSN, NO date of birth — ever. */
export const prequalSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  employment: z.enum(EMPLOYMENT_STATUSES, { message: "Select your employment situation." }),
  income: z.enum(INCOME_RANGES, { message: "Select a monthly income range." }),
  downPayment: z.enum(DOWN_PAYMENT_RANGES, { message: "Select a down payment range." }),
  creditTier: z.enum(CREDIT_TIERS, { message: "Take your best guess — it won't be held against you." }),
  tcpaConsent: tcpaField,
});
export type PrequalLead = z.infer<typeof prequalSchema>;

export const tradeInSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  year: z.coerce
    .number({ message: "Enter the model year." })
    .int()
    .gte(1980, "Enter a year after 1980.")
    .lte(2027, "Enter a valid model year."),
  make: z.string().trim().min(1, "Enter the make."),
  model: z.string().trim().min(1, "Enter the model."),
  mileage: z.coerce
    .number({ message: "Enter the mileage." })
    .int()
    .positive("Enter the mileage.")
    .lte(500000, "Check the mileage — that's a lot of miles."),
  condition: z.enum(TRADE_CONDITIONS, { message: "Pick the closest condition." }),
  tcpaConsent: tcpaField,
});
export type TradeInLead = z.infer<typeof tradeInSchema>;

export const contactSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  message: z
    .string()
    .trim()
    .min(5, "Tell us a little about what you need.")
    .max(2000, "Please keep it under 2,000 characters."),
  tcpaConsent: tcpaField,
});
export type ContactLead = z.infer<typeof contactSchema>;

/* ---------- form plumbing ---------- */

/** FormData → schema input (checkbox "on" → boolean). Used client and server. */
export function leadPayloadFromFormData(data: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = Object.fromEntries(data);
  obj.tcpaConsent = data.get("tcpaConsent") === "on";
  return obj;
}

export function formatPhoneForHumans(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

export const initialLeadFormState: LeadFormState = { status: "idle" };
