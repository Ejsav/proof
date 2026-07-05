export function SupabaseSetupNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-neutral-200 bg-white p-10">
      <p className="label-caps text-ink-faint">Admin</p>
      <h1 className="mt-2 text-h2">Supabase isn&apos;t connected yet</h1>
      <p className="mt-4 text-body text-ink-muted">
        The admin dashboard needs Supabase credentials. Set{" "}
        <code className="rounded-xs bg-neutral-100 px-1.5 py-0.5 text-small">
          NEXT_PUBLIC_SUPABASE_URL
        </code>
        ,{" "}
        <code className="rounded-xs bg-neutral-100 px-1.5 py-0.5 text-small">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>
        ,{" "}
        <code className="rounded-xs bg-neutral-100 px-1.5 py-0.5 text-small">
          SUPABASE_SERVICE_ROLE_KEY
        </code>{" "}
        and{" "}
        <code className="rounded-xs bg-neutral-100 px-1.5 py-0.5 text-small">ADMIN_EMAILS</code>,
        run the migration in{" "}
        <code className="rounded-xs bg-neutral-100 px-1.5 py-0.5 text-small">
          supabase/migrations
        </code>
        , and reload. Until then, leads are delivered by email notification only.
      </p>
    </div>
  );
}
