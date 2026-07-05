"use client";

import { submitPrequalLead } from "@/app/actions/leads";
import {
  CREDIT_TIERS,
  DOWN_PAYMENT_RANGES,
  EMPLOYMENT_STATUSES,
  INCOME_RANGES,
  prequalSchema,
} from "@/lib/leads/schema";
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

function PlainSelect({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  error?: string;
}) {
  return (
    <Select label={label} name={name} required error={error} defaultValue="">
      <option value="" disabled>
        Select one
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </Select>
  );
}

export function PrequalForm() {
  const { state, pending, startedAt, errors, handleSubmit } = useLeadForm(
    submitPrequalLead,
    prequalSchema,
    "prequal",
  );

  if (state.status === "success") {
    return (
      <LeadSuccess
        title="You're in the queue."
        body="Our finance team will call or text with your pre-qualification — usually within the hour during business hours. No impact to your credit score."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby="prequal-reassurance">
      <LeadHiddenFields startedAt={startedAt} />

      <p id="prequal-reassurance" className="label-caps text-ink-faint">
        Soft check only · No SSN required · No impact to your credit score
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
          className="sm:col-span-2"
        />
        <PlainSelect
          label="Employment"
          name="employment"
          options={EMPLOYMENT_STATUSES}
          error={errors.employment}
        />
        <PlainSelect
          label="Monthly income range"
          name="income"
          options={INCOME_RANGES}
          error={errors.income}
        />
        <PlainSelect
          label="Down payment"
          name="downPayment"
          options={DOWN_PAYMENT_RANGES}
          error={errors.downPayment}
        />
        <PlainSelect
          label="How's your credit? (best guess)"
          name="creditTier"
          options={CREDIT_TIERS}
          error={errors.creditTier}
        />
      </div>

      <LeadConsent error={errors.tcpaConsent} context="my financing pre-qualification" />
      <LeadFormError state={state} />

      <Button type="submit" size="lg" className="mt-8" disabled={pending}>
        {pending ? "Sending…" : "See what I qualify for"}
      </Button>
      <CallFallback />
    </form>
  );
}
