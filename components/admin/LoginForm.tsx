"use client";

import { useActionState } from "react";
import { sendMagicLink, type AdminAuthState } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initial: AdminAuthState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <p role="status" className="rounded-md bg-neutral-100 p-4 text-small text-ink">
        Check your inbox — your sign-in link is on the way. It&apos;s valid for one use.
      </p>
    );
  }

  return (
    <form action={formAction}>
      <Input
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.status === "error" ? state.message : undefined}
      />
      <Button type="submit" className="mt-6 w-full" disabled={pending}>
        {pending ? "Sending…" : "Email me a sign-in link"}
      </Button>
    </form>
  );
}
