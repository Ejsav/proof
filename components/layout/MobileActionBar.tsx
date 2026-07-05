import Link from "next/link";
import { MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Sticky mobile conversion bar — present on every page, hidden on md+.
 * Call → sales line, Text → dedicated text line, Get Pre-Qualified → /financing.
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid h-17 grid-cols-3 items-stretch">
        <a
          href={site.phone.sales.tel}
          className="flex flex-col items-center justify-center gap-1 text-ink transition-colors duration-(--duration-fast) ease-(--ease-out) active:bg-neutral-100"
          aria-label={`Call sales at ${site.phone.sales.display}`}
        >
          <Phone className="size-5" aria-hidden="true" />
          <span className="text-caption font-medium">Call</span>
        </a>
        <a
          href={site.phone.text.sms}
          className="flex flex-col items-center justify-center gap-1 border-x border-neutral-200 text-ink transition-colors duration-(--duration-fast) ease-(--ease-out) active:bg-neutral-100"
          aria-label={`Text us at ${site.phone.text.display}`}
        >
          <MessageSquare className="size-5" aria-hidden="true" />
          <span className="text-caption font-medium">Text</span>
        </a>
        <Link
          href="/financing"
          className="flex flex-col items-center justify-center gap-1 bg-accent-600 text-white transition-colors duration-(--duration-fast) ease-(--ease-out) active:bg-accent-700"
        >
          <ShieldCheck className="size-5" aria-hidden="true" />
          <span className="text-caption font-medium">Get Pre-Qualified</span>
        </Link>
      </div>
    </nav>
  );
}
