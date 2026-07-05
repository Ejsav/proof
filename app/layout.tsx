import type { Metadata, Viewport } from "next";
import "./globals.css";
import { clashDisplay, generalSans } from "./fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Used Cars in Branford, CT`,
    template: `%s | ${site.name}`,
  },
  description: `Quality used cars at ${fullAddress}. Browse inventory, get pre-qualified with no impact to your credit score, or call ${site.phone.sales.display}.`,
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
  // Required for env(safe-area-inset-*) on notched devices
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${generalSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-ink focus:shadow-md"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
