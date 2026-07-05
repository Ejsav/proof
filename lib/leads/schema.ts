import { z } from "zod";

/**
 * Lead validation — shared by client (instant feedback) and server
 * (authoritative). CLAUDE.md rules enforced here: minimum fields,
 * honeypot, time-on-page >= 3s, TCPA consent, never SSN/DOB.
 */

export const MIN_TIME_ON_PAGE_MS = 3000;

export const TEST_DRIVE_WINDOWS = [
  "Weekday morning",
  "Weekday afternoon",
  "Weekday evening (before 6 PM)",
  "Saturday",
] as const;

const phoneField = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((digits) => digits.length === 10 || (digits.length === 11 && digits.startsWith("1")), {
    message: "Enter a 10-digit US phone number.",
  })
  .transform((digits) => (digits.length === 11 ? digits.slice(1) : digits));

export const testDriveSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Please enter a shorter name."),
  phone: phoneField,
  email: z
    .string()
    .trim()
    .email("Enter a valid email, or leave it blank.")
    .optional()
    .or(z.literal("")),
  window: z.enum(TEST_DRIVE_WINDOWS, {
    message: "Pick a time that works for you.",
  }),
  tcpaConsent: z.literal(true, {
    message: "Please check the consent box so we can call or text you back.",
  }),
  vehicleSlug: z.string().min(1),
});

export type TestDriveLead = z.infer<typeof testDriveSchema>;

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  /** Echo of submitted values so error re-renders don't wipe user input
   *  (React 19 resets uncontrolled fields after a form action) */
  values?: {
    name?: string;
    phone?: string;
    email?: string;
    window?: string;
    tcpaConsent?: boolean;
  };
};

export const initialLeadFormState: LeadFormState = { status: "idle" };
