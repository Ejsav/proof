# Production workflow: MP4 → image-sequence scrubbing

The MP4 version (`CinematicScrollVideo`) is the reliable baseline. If video
seeking still isn't smooth enough on your target browsers/devices, upgrade to
the canvas image-sequence version (`CinematicScrollCanvas`) using the workflow
below. Both components share the same shell, overlays and timing config, so
the swap is a one-line change in `app/page.tsx`.

## Why an image sequence scrubs better

Scrubbing a video means *seeking*, and a seek can only start decoding from the
nearest keyframe. Even with a keyframe-dense encode, `video.currentTime`
assignment is asynchronous and throttled differently per browser (Safari in
particular). An image sequence sidesteps decoding entirely at scroll time:
every frame is decoded once during preload, and scrubbing is just a bitmap
blit to a canvas — deterministic and identical in both scroll directions.

## Step 0 (optional but recommended for the MP4 baseline)

Before jumping to frames, re-encode the MP4 all-intra (a keyframe on every
frame). This alone fixes most video-scrub jank and is what
`public/videos/cinematic-scene.mp4` in this repo already uses:

```bash
ffmpeg -i source.mp4 \
  -an \                       # strip audio — never needed for scrubbing
  -c:v libx264 -profile:v high \
  -crf 22 \                   # quality (lower = better/larger), 20–24 is the sweet spot
  -g 1 \                      # keyframe interval 1 = every frame is seekable instantly
  -pix_fmt yuv420p \
  -movflags +faststart \      # moov atom up front so metadata loads immediately
  cinematic-scene.mp4
```

## Step 1 — extract frames

### WebP (best compatibility/tooling today)

```bash
mkdir -p public/frames
ffmpeg -i source.mp4 \
  -vf "fps=24,scale=1920:-2" \
  -c:v libwebp -quality 78 -compression_level 6 \
  public/frames/frame-%04d.webp
```

### AVIF (smaller files, needs a recent FFmpeg with libaom/libsvtav1)

```bash
ffmpeg -i source.mp4 \
  -vf "fps=24,scale=1920:-2" \
  -c:v libaom-av1 -still-picture 1 -crf 32 -b:v 0 \
  public/frames/frame-%04d.avif
```

If your FFmpeg can't write AVIF sequences, extract lossless PNGs first and
batch-convert with `avifenc`:

```bash
ffmpeg -i source.mp4 -vf "fps=24,scale=1920:-2" tmp/frame-%04d.png
for f in tmp/*.png; do avifenc -q 60 "$f" "public/frames/$(basename "${f%.png}").avif"; done
```

## Recommended settings

| Setting | Recommendation | Why |
|---|---|---|
| Frame rate | 20–24 fps (use `fps=24`) | Scroll scrubbing doesn't need 60fps source frames; the *rendering* is still 60fps because intermediate scroll positions snap to the nearest frame. Fewer frames = faster preload. |
| Frame count budget | 150–300 total | A 10s clip at 24fps = 240 frames — right in budget. For longer clips, drop to `fps=15` rather than exceeding ~300 frames. |
| Dimensions | 1920px wide (`scale=1920:-2`), 2560px only if the video is a full-bleed hero on large screens | `-2` keeps height even (codec requirement) and preserves aspect ratio. The canvas draws with cover-fit, so frames never stretch. |
| WebP quality | 70–80 | ~40–80KB per 1920px frame. Below 70 gradients band; above 80 the size climbs for no visible gain over video. |
| AVIF quality | `-crf 30–34` | Roughly 30–50% smaller than WebP at equivalent quality. |
| Total payload target | ≤ 15–20MB for the full sequence | Comparable to a hero video; loaded progressively, not up front. |

## Preload strategy (what `CinematicScrollCanvas` implements)

1. **Frame 1 first, alone.** Fetch and decode it immediately, draw it, and
   drop the loading veil — the section is visually complete before anything
   else arrives.
2. **Remaining frames with capped concurrency (6 parallel fetches).** This
   fills the sequence front-to-back without starving the rest of the page's
   requests. Front-to-back order matters: the user scrubs from the start, so
   the frames they'll hit first arrive first.
3. **Decode at load time, not scrub time.** `createImageBitmap()` decodes off
   the main thread and hands back a GPU-friendly bitmap; drawing it is cheap.
4. **Graceful gaps.** If the user outruns the preload, the renderer draws the
   nearest already-loaded earlier frame instead of flashing blank.
5. Optionally add `<link rel="preload" as="fetch">` for the first ~10 frames
   in the page `<head>` if the section is above the fold.

## Swapping the implementation

```tsx
// app/page.tsx — replace the video component…
<CinematicScrollVideo
  src="/videos/cinematic-scene.mp4"
  poster="/videos/cinematic-scene-poster.jpg"
  heightVh={500}
/>

// …with the canvas one. Same scroll feel, same overlays, same timing.
<CinematicScrollCanvas
  frameTemplate="/frames/frame-{i}.webp"
  frameCount={240}   // number of files FFmpeg produced
  pad={4}            // %04d → 4
  firstFrame={1}     // FFmpeg numbering starts at 1
  heightVh={500}
/>
```

The overlay copy and timing live in `components/cinematic/overlay-config.ts`
and apply to both renderers unchanged.
