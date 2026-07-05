"use client";

import { submitTradeInLead } from "@/app/actions/leads";
import { TRADE_CONDITIONS, tradeInSchema } from "@/lib/leads/schema";
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

export function TradeInForm() {
  const { state, pending, startedAt, errors, handleSubmit } = useLeadForm(
    submitTradeInLead,
    tradeInSchema,
    "trade_in",
  );

  if (state.status === "success") {
    return (
      <LeadSuccess
        title="We're pricing it now."
        body="You'll get your trade number by call or text shortly — usually within the hour during business hours. Bring the car by and we'll firm it up on the spot."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <LeadHiddenFields startedAt={startedAt} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Year"
          name="year"
          type="number"
          inputMode="numeric"
          placeholder="2018"
          required
          error={errors.year}
        />
        <Input label="Make" name="make" placeholder="Honda" required error={errors.make} />
        <Input label="Model" name="model" placeholder="Accord" required error={errors.model} />
        <Input
          label="Mileage"
          name="mileage"
          type="number"
          inputMode="numeric"
          placeholder="72,000"
          required
          error={errors.mileage}
        />
        <Select label="Condition" name="condition" required error={errors.condition} defaultValue="">
          <option value="" disabled>
            Your honest take
          </option>
          {TRADE_CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input label="Full name" name="name" autoComplete="name" required error={errors.name} />
        <Input
          label="Mobile phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          error={errors.phone}
          hint="We'll text your number here"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          hint="Optional"
          error={errors.email}
        />
      </div>

      <LeadConsent error={errors.tcpaConsent} context="my trade-in valuation" />
      <LeadFormError state={state} />

      <Button type="submit" size="lg" className="mt-8" disabled={pending}>
        {pending ? "Sending…" : "Get my trade number"}
      </Button>
      <CallFallback />
    </form>
  );
}
