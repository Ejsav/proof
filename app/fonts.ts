import localFont from "next/font/local";

/**
 * Self-hosted via next/font/local per CLAUDE.md.
 *
 * NOTE: The .woff2 files currently in /public/fonts are PLACEHOLDERS
 * (network policy blocks fontshare.com from this environment).
 * Replace them with the real Fontshare variable fonts — same filenames,
 * no code changes needed. See public/fonts/README.md.
 */
export const clashDisplay = localFont({
  src: "../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  display: "swap",
  weight: "200 700",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: false,
});

export const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralSans-VariableItalic.woff2",
      weight: "200 700",
      style: "italic",
    },
  ],
  variable: "--font-general",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: false,
});
