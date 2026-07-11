# Cinematic Scroll Video

A scroll-controlled cinematic section built with Next.js (App Router), React,
TypeScript, Tailwind CSS v4 and GSAP ScrollTrigger. Scroll position directly
drives the video's current time — a frame-by-frame scrub, not playback.

## Install & run

```bash
npm install        # next, react, tailwind and gsap are in package.json
npm run dev        # http://localhost:3000
```

If adding to an existing Next.js + Tailwind project, the only extra
dependency is GSAP:

```bash
npm install gsap
```

## File structure

```
app/
  layout.tsx                      # fonts, metadata
  globals.css                     # dark base, overscroll behavior
  page.tsx                        # intro → cinematic section → outro
components/
  cinematic/
    overlay-config.ts             # ← text copy + timing (edit here)
    overlay-timeline.ts           # shared GSAP overlay animations
    CinematicOverlays.tsx         # shared overlay markup
    CinematicScrollVideo.tsx      # MP4 scrub version (default)
    CinematicScrollCanvas.tsx     # canvas image-sequence version (upgrade)
public/
  videos/
    cinematic-scene.mp4           # all-intra encode (keyframe every frame)
    cinematic-scene-poster.jpg    # first frame, shown while loading
docs/
  image-sequence-workflow.md      # FFmpeg workflow for the canvas upgrade
```

## How it works

- The section is `heightVh` tall (default 500vh). The visible stage is a
  `position: sticky` full-viewport child, so it stays pinned while the
  section scrolls through — sticky survives mobile address-bar resizes
  without the jump that JS re-pinning can cause.
- One GSAP timeline, exactly 1 unit long, is scrubbed across the section
  (`scrub: true`, `start: "top top"`, `end: "bottom bottom"`), so timeline
  position == scroll progress 0–1.
- A proxy tween maps progress onto `video.currentTime` (clamped just shy of
  the end so the final frame stays painted). Seeks smaller than half a frame
  are skipped.
- Text overlays are added to the same timeline from `overlay-config.ts`.
- No React state is touched while scrolling; the only state updates are
  one-time flags (video ready).
- The ScrollTrigger is created only after `loadedmetadata` (duration known),
  and everything is reverted via `gsap.matchMedia().revert()` on unmount.
- `prefers-reduced-motion`: GSAP setup is skipped entirely, the section
  collapses to one viewport (`motion-reduce:!h-svh`) and shows the static
  first frame with the headline.

## Tuning

**Scroll duration** — pass `heightVh` (400–600 recommended):

```tsx
<CinematicScrollVideo src="..." heightVh={600} />
```

Larger = slower, more deliberate scrub. Text timing is fractional, so it
rescales automatically.

**Text timing & copy** — edit `components/cinematic/overlay-config.ts`.
Each cue has `start`/`end` as fractions of scroll progress
(e.g. `start: 0.32, end: 0.48` = 32%–48%). Within each cue's window the
entrance uses 35%, hold 40%, exit 25% (see `overlay-timeline.ts`).
`persist: true` (the final CTA) skips the exit so it stays visible.

## Upgrading to a canvas image sequence

If video seeking isn't smooth enough on your target browsers, swap
`CinematicScrollVideo` for `CinematicScrollCanvas` — same overlays, same
timing. The FFmpeg workflow (frame extraction, WebP/AVIF settings, preload
strategy) is documented in [docs/image-sequence-workflow.md](docs/image-sequence-workflow.md).
