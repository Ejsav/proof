import "server-only";
import type { LeadType } from "@/lib/leads/schema";

/**
 * Lead persistence seam. Today a no-op (demo build, no Supabase env yet);
 * post-signing this inserts into the Supabase `leads` table. Server
 * Actions call this — components never touch the database.
 */
export async function saveLead(type: LeadType, lead: Record<string, unknown>): Promise<void> {
  void type;
  void lead; // SEAM: supabase.from("leads").insert({ type, payload: lead, ... })
}
