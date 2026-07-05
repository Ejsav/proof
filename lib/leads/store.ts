import "server-only";
import type { LeadType } from "@/lib/leads/schema";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

/**
 * Lead persistence — the repository seam for leads. Server Actions call
 * this; components never touch the database. Demo mode (no Supabase env):
 * no-op, the Resend/demo-log notification is the record.
 */
export async function saveLead(type: LeadType, lead: Record<string, unknown>): Promise<void> {
  if (!isSupabaseServiceConfigured()) return;

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();
  const { error } = await supabase.from("leads").insert({
    type,
    name: String(lead.name ?? ""),
    phone: String(lead.phone ?? ""),
    email: lead.email ? String(lead.email) : null,
    vehicle_slug: lead.vehicleSlug ? String(lead.vehicleSlug) : null,
    payload: lead,
  });

  if (error) {
    // The notification email still fires — a DB hiccup must not lose the lead.
    console.error("[lead:store-failed]", error.message);
  }
}
