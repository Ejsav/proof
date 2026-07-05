"use client";

import { submitContactLead } from "@/app/actions/leads";
import { contactSchema } from "@/lib/leads/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  CallFallback,
  LeadConsent,
  LeadFormError,
  LeadHiddenFields,
  LeadSuccess,
  useLeadForm,
} from "@/components/forms/lead-form-shared";

export function ContactForm() {
  const { state, pending, startedAt, errors, handleSubmit } = useLeadForm(
    submitContactLead,
    contactSchema,
    "contact",
  );

  if (state.status === "success") {
    return (
      <LeadSuccess
        title="Got it — we'll be in touch."
        body="A real person reads every message, usually within the hour during business hours. Need an answer right now? Call us."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
          className="sm:col-span-2"
        />
        <Textarea
          label="How can we help?"
          name="message"
          placeholder="The car you're after, a question about financing, anything."
          required
          error={errors.message}
          className="sm:col-span-2"
        />
      </div>

      <LeadConsent error={errors.tcpaConsent} context="my inquiry" />
      <LeadFormError state={state} />

      <Button type="submit" size="lg" className="mt-8" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
      <CallFallback />
    </form>
  );
}
