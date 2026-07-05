# Fonts — ACTION REQUIRED

The three `.woff2` files here are **placeholders** (converted Liberation Sans)
because this build environment cannot reach fontshare.com.

To install the real fonts:

1. Download both families from Fontshare (free, ITF license):
   - https://www.fontshare.com/fonts/clash-display → "Download family"
   - https://www.fontshare.com/fonts/general-sans → "Download family"
2. From each zip, take the **variable** WOFF2 files and copy them here,
   overwriting the placeholders, with exactly these names:
   - `ClashDisplay-Variable.woff2`   (from clash-display zip: `Fonts/WEB/fonts/ClashDisplay-Variable.woff2`)
   - `GeneralSans-Variable.woff2`    (from general-sans zip: `Fonts/WEB/fonts/GeneralSans-Variable.woff2`)
   - `GeneralSans-VariableItalic.woff2` (from general-sans zip: `Fonts/WEB/fonts/GeneralSans-VariableItalic.woff2`)
3. No code changes are needed — `app/fonts.ts` already points at these paths.
