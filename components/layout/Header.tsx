"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/Button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md",
        "transition-[border-color,box-shadow] duration-(--duration-base) ease-(--ease-out)",
        scrolled ? "border-neutral-200 shadow-xs" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-4",
          "transition-[height] duration-(--duration-base) ease-(--ease-in-out)",
          scrolled ? "h-16" : "h-16 md:h-20",
        )}
      >
        {/* Logo placeholder — replace with real mark when received */}
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-1.5 font-display"
          aria-label={`${site.name} — home`}
        >
          <span className="text-xl font-semibold tracking-tight text-ink">AUTOMAX</span>
          <span className="label-caps text-ink-muted">Branford</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {site.nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-sm px-3 py-2 text-small font-medium",
                      "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                      active ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-0.5 origin-left bg-accent-600",
                        "transition-transform duration-(--duration-base) ease-(--ease-out-expo)",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Click-to-call: visible at every breakpoint */}
          <a
            href={site.phone.sales.tel}
            className={buttonClasses("primary", "sm", "shrink-0")}
            aria-label={`Call sales at ${site.phone.sales.display}`}
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{site.phone.sales.display}</span>
            <span className="sm:hidden">Call</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "flex size-10 items-center justify-center rounded-sm text-ink md:hidden",
              "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-neutral-100",
            )}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Main"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-neutral-200 bg-paper md:hidden"
          >
            <ul className="container-site flex flex-col py-4">
              {site.nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-sm px-3 py-3 font-display text-h3 font-medium",
                        active ? "text-accent-600" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
