"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { submitTestDriveLead } from "@/app/actions/leads";
import { track } from "@/lib/analytics";
import {
  TEST_DRIVE_WINDOWS,
  initialLeadFormState,
  testDriveSchema,
} from "@/lib/leads/schema";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function TestDriveForm({
  vehicleSlug,
  vehicleName,
}: {
  vehicleSlug: string;
  vehicleName: string;
}) {
  const [state, formAction, pending] = useActionState(submitTestDriveLead, initialLeadFormState);
  const [clientErrors, setClientErrors] = useState<Partial<Record<string, string>>>({});
  const [startedAt] = useState(() => Date.now());
  // Controlled: <select> has no defaultValue attribute in the DOM, so the
  // automatic post-action form reset would wipe it back to the placeholder.
  const [timeWindow, setTimeWindow] = useState("");
  const tracked = useRef(false);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      track("generate_lead", { lead_type: "test_drive", vehicle: vehicleSlug });
    }
  }, [state.status, vehicleSlug]);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-10" role="status">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <h3 className="mt-4 text-h3">You&apos;re on the books.</h3>
        <p className="mt-2 max-w-md text-body text-ink-muted">
          We&apos;ll call or text shortly to confirm your test drive of the {vehicleName}.
          Want it faster? Call us right now.
        </p>
        <Button href={site.phone.sales.tel} variant="secondary" className="mt-6">
          <Phone className="size-4" aria-hidden="true" />
          {site.phone.sales.display}
        </Button>
      </div>
    );
  }

  const errors = { ...state.fieldErrors, ...clientErrors };

  // Client-side pass for instant feedback; the Server Action re-validates.
  // Dispatched manually (not via <form action>) so React's automatic
  // post-action form reset never wipes what the user typed.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = testDriveSchema.safeParse({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      window: data.get("window"),
      tcpaConsent: data.get("tcpaConsent") === "on",
      vehicleSlug,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setClientErrors(next);
      return;
    }
    setClientErrors({});
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="vehicleSlug" value={vehicleSlug} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot — invisible to humans, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`company-${vehicleSlug}`}>Company</label>
        <input
          id={`company-${vehicleSlug}`}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          required
          error={errors.name}
          defaultValue={state.values?.name}
        />
        <Input
          label="Mobile phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          error={errors.phone}
          defaultValue={state.values?.phone}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          hint="Optional"
          error={errors.email}
          defaultValue={state.values?.email}
        />
        <Select
          label="Best time for you"
          name="window"
          required
          error={errors.window}
          value={timeWindow}
          onChange={(e) => setTimeWindow(e.target.value)}
        >
          <option value="" disabled>
            Pick a window
          </option>
          {TEST_DRIVE_WINDOWS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        <Checkbox
          name="tcpaConsent"
          defaultChecked={state.values?.tcpaConsent}
          label={
            <>
              I agree to receive calls and texts from {site.name} about my test drive request at
              the number provided. Message and data rates may apply. Consent is not a condition
              of purchase.
            </>
          }
        />
        {errors.tcpaConsent && (
          <p role="alert" className="mt-2 text-small text-error">
            {errors.tcpaConsent}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 text-small font-medium text-error">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-8" disabled={pending}>
        {pending ? "Booking…" : "Book my test drive"}
      </Button>
      <p className="mt-4 text-small text-ink-muted">
        Prefer to talk? Call{" "}
        <a href={site.phone.sales.tel} className="font-medium text-ink underline decoration-neutral-400 underline-offset-4">
          {site.phone.sales.display}
        </a>{" "}
        — we pick up.
      </p>
    </form>
  );
}
