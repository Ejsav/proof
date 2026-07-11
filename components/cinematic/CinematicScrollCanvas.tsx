"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicOverlays } from "./CinematicOverlays";
import { addOverlayAnimations } from "./overlay-timeline";

gsap.registerPlugin(ScrollTrigger);

interface CinematicScrollCanvasProps {
  /**
   * Frame URL template; `{i}` is replaced with the zero-padded frame index.
   * Example: "/frames/frame-{i}.webp" with pad 4 → /frames/frame-0001.webp
   */
  frameTemplate: string;
  frameCount: number;
  /** Zero-pad width of the index in filenames (FFmpeg %04d → 4). */
  pad?: number;
  /** First frame index in the filenames (FFmpeg starts at 1). */
  firstFrame?: number;
  heightVh?: number;
}

function frameUrl(template: string, index: number, pad: number, first: number) {
  return template.replace("{i}", String(index + first).padStart(pad, "0"));
}

/**
 * Canvas image-sequence version of the cinematic scroll section.
 *
 * Same shell, overlays and timing as CinematicScrollVideo — only the media
 * layer differs: instead of seeking a <video>, scroll progress selects a
 * frame index and the frame is drawn to a canvas. Decoding happens once at
 * load time (createImageBitmap), so scrubbing is a plain bitmap blit and is
 * perfectly smooth in both directions on every browser.
 *
 * Generate the frames with FFmpeg — see docs/image-sequence-workflow.md.
 */
export function CinematicScrollCanvas({
  frameTemplate,
  frameCount,
  pad = 4,
  firstFrame = 1,
  heightVh = 500,
}: CinematicScrollCanvasProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    let disposed = false;
    let currentIndex = 0;

    const loadFrame = async (i: number) => {
      const url = frameUrl(frameTemplate, i, pad, firstFrame);
      if (typeof createImageBitmap === "function") {
        const res = await fetch(url);
        const blob = await res.blob();
        return await createImageBitmap(blob);
      }
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    // Draw with object-fit: cover semantics.
    const draw = (index: number) => {
      // If the exact frame isn't decoded yet, fall back to the nearest
      // earlier loaded one so scrubbing never flashes blank.
      let frame = frames[index];
      for (let i = index; i >= 0 && !frame; i--) frame = frames[i];
      if (!frame) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const fw = frame.width;
      const fh = frame.height;
      const scale = Math.max(cw / fw, ch / fh);
      const dw = fw * scale;
      const dh = fh * scale;
      ctx2d.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // Cap DPR at 2 — beyond that the fill cost outweighs any visible gain.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(currentIndex);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Preload: first frame immediately (unblocks the loading veil), then the
    // rest with limited concurrency so we don't saturate the connection.
    const preload = async () => {
      try {
        frames[0] = await loadFrame(0);
        if (disposed) return;
        resize();
        setReady(true);
      } catch {
        setReady(true); // don't leave the veil up on a failed first frame
        return;
      }

      const CONCURRENCY = 6;
      let next = 1;
      await Promise.all(
        Array.from({ length: CONCURRENCY }, async () => {
          while (next < frameCount && !disposed) {
            const i = next++;
            try {
              const frame = await loadFrame(i);
              if (disposed) return;
              frames[i] = frame;
              if (i === currentIndex) draw(i);
            } catch {
              // A missing frame just falls back to its neighbor when drawn.
            }
          }
        })
      );
    };
    preload();

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const proxy = { frame: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        proxy,
        {
          frame: frameCount - 1,
          duration: 1,
          onUpdate: () => {
            const index = Math.round(proxy.frame);
            if (index !== currentIndex) {
              currentIndex = index;
              draw(index);
            }
          },
        },
        0
      );

      addOverlayAnimations(tl, section);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => {
      disposed = true;
      ro.disconnect();
      mm.revert();
      for (const f of frames) {
        if (f && "close" in f) f.close();
      }
    };
  }, [frameTemplate, frameCount, pad, firstFrame]);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${heightVh}vh` }}
      className="relative bg-black motion-reduce:!h-svh"
      aria-label="Cinematic scroll sequence"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`h-full w-full transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

        <CinematicOverlays />

        <div
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/40">
            Loading
          </span>
        </div>
      </div>
    </section>
  );
}
