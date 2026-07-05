"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminEmails, isSupabaseConfigured } from "@/lib/supabase/config";
import { createAuthClient, createServiceClient } from "@/lib/supabase/server";

export type AdminAuthState = { status: "idle" | "sent" | "error"; message?: string };

export async function sendMagicLink(
  _prev: AdminAuthState,
  formData: FormData,
): Promise<AdminAuthState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured yet." };
  }

  const email = z.string().trim().toLowerCase().email().safeParse(formData.get("email"));
  if (!email.success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // Allowlist check BEFORE sending anything — no account enumeration,
  // no magic links to strangers.
  if (!adminEmails().includes(email.data)) {
    return { status: "error", message: "That email isn't authorized for admin access." };
  }

  const supabase = await createAuthClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { emailRedirectTo: `${siteUrl}/admin/auth/callback` },
  });

  if (error) {
    console.error("[admin:magic-link-failed]", error.message);
    return { status: "error", message: "Couldn't send the link — try again in a minute." };
  }

  return { status: "sent" };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const LEAD_STATUSES = ["new", "contacted", "appointment", "sold", "lost"] as const;

export async function updateLeadStatus(formData: FormData): Promise<void> {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) return;

  const id = z.string().uuid().safeParse(formData.get("id"));
  const status = z.enum(LEAD_STATUSES).safeParse(formData.get("status"));
  if (!id.success || !status.success) return;

  const service = createServiceClient();
  const { error } = await service.from("leads").update({ status: status.data }).eq("id", id.data);
  if (error) console.error("[admin:status-update-failed]", error.message);
  revalidatePath("/admin");
}
