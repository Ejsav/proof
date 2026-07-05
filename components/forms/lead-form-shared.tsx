"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import type { z } from "zod";
import { CheckCircle2, Phone } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  initialLeadFormState,
  leadPayloadFromFormData,
  type LeadFormState,
  type LeadType,
} from "@/lib/leads/schema";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

type LeadAction = (prev: LeadFormState, formData: FormData) => Promise<LeadFormState>;

/**
 * Shared engine for every lead form: client-side Zod pass for instant
 * feedback, manual action dispatch (never <form action> — React's automatic
 * post-action reset would wipe user input on server-side rejections),
 * time-on-page stamp, and the GA4 generate_lead event on success.
 */
export function useLeadForm(action: LeadAction, schema: z.ZodType, leadType: LeadType) {
  const [state, formAction, pending] = useActionState(action, initialLeadFormState);
  const [clientErrors, setClientErrors] = useState<Partial<Record<string, string>>>({});
  const [startedAt] = useState(() => Date.now());
  const tracked = useRef(false);

  useEffect(() => {
    if (state.status === "success" && !tracked.current) {
      tracked.current = true;
      track("generate_lead", { lead_type: leadType });
    }
  }, [state.status, leadType]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = schema.safeParse(leadPayloadFromFormData(data));
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

  return {
    state,
    pending,
    startedAt,
    errors: { ...state.fieldErrors, ...clientErrors } as Partial<Record<string, string>>,
    handleSubmit,
  };
}

/** Hidden honeypot + time-on-page fields — include inside every lead form. */
export function LeadHiddenFields({ startedAt }: { startedAt: number }) {
  const id = useId();
  return (
    <>
      <input type="hidden" name="startedAt" value={startedAt} />
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id}>Company</label>
        <input id={id} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );
}

/** TCPA consent — unchecked by default, always (CLAUDE.md). */
export function LeadConsent({ error, context }: { error?: string; context: string }) {
  return (
    <div className="mt-6">
      <Checkbox
        name="tcpaConsent"
        label={
          <>
            I agree to receive calls and texts from {site.name} about {context} at the number
            provided. Message and data rates may apply. Consent is not a condition of purchase.
          </>
        }
      />
      {error && (
        <p role="alert" className="mt-2 text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadFormError({ state }: { state: LeadFormState }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <p role="alert" className="mt-6 text-small font-medium text-error">
      {state.message}
    </p>
  );
}

export function LeadSuccess({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-10" role="status">
      <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
      <h3 className="mt-4 text-h3">{title}</h3>
      <p className="mt-2 max-w-md text-body text-ink-muted">{body}</p>
      <Button href={site.phone.sales.tel} variant="secondary" className="mt-6">
        <Phone className="size-4" aria-hidden="true" />
        {site.phone.sales.display}
      </Button>
    </div>
  );
}

export function CallFallback() {
  return (
    <p className="mt-4 text-small text-ink-muted">
      Prefer to talk? Call{" "}
      <a
        href={site.phone.sales.tel}
        className="font-medium text-ink underline decoration-neutral-400 underline-offset-4"
      >
        {site.phone.sales.display}
      </a>{" "}
      — we pick up.
    </p>
  );
}
