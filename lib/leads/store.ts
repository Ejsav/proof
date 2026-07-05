import "server-only";
import type { TestDriveLead } from "@/lib/leads/schema";

/**
 * Lead persistence seam. Today a no-op (demo build, no Supabase env yet);
 * post-signing this inserts into the Supabase `leads` table. Server
 * Actions call this — components never touch the database.
 */
export async function saveTestDriveLead(lead: TestDriveLead): Promise<void> {
  void lead; // SEAM: supabase.from("leads").insert(...) once env is provisioned
}
