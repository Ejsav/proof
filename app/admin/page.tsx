import { redirect } from "next/navigation";
import { Phone } from "lucide-react";
import { signOutAdmin } from "@/app/actions/admin";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { SupabaseSetupNotice } from "@/components/admin/SupabaseSetupNotice";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPhoneForHumans, type LeadType } from "@/lib/leads/schema";
import { adminEmails, isSupabaseConfigured, isSupabaseServiceConfigured } from "@/lib/supabase/config";

const TYPE_LABELS: Record<LeadType, string> = {
  test_drive: "Test drive",
  prequal: "Pre-qual",
  trade_in: "Trade-in",
  contact: "Inquiry",
};

type LeadRow = {
  id: string;
  created_at: string;
  type: LeadType;
  name: string;
  phone: string;
  email: string | null;
  vehicle_slug: string | null;
  payload: Record<string, unknown>;
  status: string;
};

export default async function AdminInboxPage() {
  if (!isSupabaseConfigured() || !isSupabaseServiceConfigured()) {
    return <SupabaseSetupNotice />;
  }

  const { createAuthClient, createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createAuthClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) {
    redirect("/admin/login");
  }

  const service = createServiceClient();
  const { data: leads, error } = await service
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-ink-faint">Signed in as {email}</p>
          <h1 className="mt-2 text-h1">Lead inbox</h1>
        </div>
        <form action={signOutAdmin}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      {error ? (
        <p role="alert" className="mt-10 text-body text-error">
          Couldn&apos;t load leads: {error.message}
        </p>
      ) : !leads || leads.length === 0 ? (
        <p className="mt-10 rounded-xl border border-neutral-200 bg-white p-10 text-body text-ink-muted">
          No leads yet. They&apos;ll appear here the moment a form is submitted.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {(leads as LeadRow[]).map((lead) => (
            <li key={lead.id} className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="accent">{TYPE_LABELS[lead.type] ?? lead.type}</Badge>
                    <span className="text-caption text-ink-faint">
                      {new Date(lead.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="mt-3 text-h3 font-display">{lead.name}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-muted">
                    <a
                      href={`tel:+1${lead.phone}`}
                      className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-accent-700"
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {formatPhoneForHumans(lead.phone)}
                    </a>
                    {lead.email && <span>{lead.email}</span>}
                    {lead.vehicle_slug && <span>Vehicle: {lead.vehicle_slug}</span>}
                  </p>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-small font-medium text-ink-muted hover:text-ink">
                      Full details
                    </summary>
                    <dl className="mt-2 grid gap-1 text-small text-ink-muted">
                      {Object.entries(lead.payload)
                        .filter(([k]) => !["tcpaConsent"].includes(k))
                        .map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <dt className="font-medium text-ink">{k}:</dt>
                            <dd>{String(v)}</dd>
                          </div>
                        ))}
                    </dl>
                  </details>
                </div>
                <LeadStatusSelect id={lead.id} status={lead.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
