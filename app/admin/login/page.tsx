import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { SupabaseSetupNotice } from "@/components/admin/SupabaseSetupNotice";
import { adminEmails, isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/site";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupNotice />;
  }

  // Already signed in? Straight to the inbox.
  const { createAuthClient } = await import("@/lib/supabase/server");
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (email && adminEmails().includes(email)) {
    redirect("/admin");
  }

  const params = await searchParams;
  const linkError = params.error === "link";

  return (
    <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-10">
      <p className="label-caps text-ink-faint">{site.name}</p>
      <h1 className="mt-2 text-h2">Admin sign-in</h1>
      <p className="mt-3 text-body text-ink-muted">
        Enter your work email and we&apos;ll send a one-time sign-in link.
      </p>
      {linkError && (
        <p role="alert" className="mt-4 text-small font-medium text-error">
          That link expired or was already used — request a fresh one.
        </p>
      )}
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
