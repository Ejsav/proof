import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin shell. Auth is enforced per-page (login page must be reachable);
 * the unconfigured state renders here so every admin route degrades
 * gracefully before Supabase env vars exist.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Section as="div">{children}</Section>;
}
