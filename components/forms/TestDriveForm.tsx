"use client";

import { useState } from "react";
import { submitTestDriveLead } from "@/app/actions/leads";
import { TEST_DRIVE_WINDOWS, testDriveSchema } from "@/lib/leads/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  CallFallback,
  LeadConsent,
  LeadFormError,
  LeadHiddenFields,
  LeadSuccess,
  useLeadForm,
} from "@/components/forms/lead-form-shared";

export function TestDriveForm({
  vehicleSlug,
  vehicleName,
}: {
  vehicleSlug: string;
  vehicleName: string;
}) {
  const { state, pending, startedAt, errors, handleSubmit } = useLeadForm(
    submitTestDriveLead,
    testDriveSchema,
    "test_drive",
  );
  // Controlled to be reset-proof regardless of dispatch path
  const [timeWindow, setTimeWindow] = useState("");

  if (state.status === "success") {
    return (
      <LeadSuccess
        title="You're on the books."
        body={`We'll call or text shortly to confirm your test drive of the ${vehicleName}. Want it faster? Call us right now.`}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="vehicleSlug" value={vehicleSlug} />
      <LeadHiddenFields startedAt={startedAt} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Full name" name="name" autoComplete="name" required error={errors.name} />
        <Input
          label="Mobile phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          error={errors.phone}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          hint="Optional"
          error={errors.email}
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

      <LeadConsent error={errors.tcpaConsent} context="my test drive request" />
      <LeadFormError state={state} />

      <Button type="submit" size="lg" className="mt-8" disabled={pending}>
        {pending ? "Booking…" : "Book my test drive"}
      </Button>
      <CallFallback />
    </form>
  );
}
