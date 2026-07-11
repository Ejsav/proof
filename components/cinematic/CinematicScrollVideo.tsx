"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicOverlays } from "./CinematicOverlays";
import { addOverlayAnimations } from "./overlay-timeline";

gsap.registerPlugin(ScrollTrigger);

interface CinematicScrollVideoProps {
  src: string;
  poster?: string;
  /** Total scroll distance of the section, in viewport heights. 400–600 recommended. */
  heightVh?: number;
}

/**
 * Scroll-scrubbed cinematic video section.
 *
 * Scroll progress through the (heightVh)-tall section maps 1:1 onto the
 * video's duration via a single scrubbed GSAP timeline. The stage stays
 * fixed to the viewport with `position: sticky` rather than ScrollTrigger's
 * `pin` — sticky is handled by the browser compositor, so it survives mobile
 * address-bar resizes without the jump/flash that re-pinning can cause.
 *
 * Nothing in the scroll path touches React state: GSAP writes
 * `video.currentTime` and overlay transforms directly on the DOM.
 *
 * Upgrade path: this component and CinematicScrollCanvas share the same
 * shell, overlay markup and overlay timeline. To switch to a canvas image
 * sequence later, only the "media layer" (the <video>) and the media tween
 * (the currentTime proxy) are swapped — see CinematicScrollCanvas.tsx.
 */
export function CinematicScrollVideo({
  src,
  poster,
  heightVh = 500,
}: CinematicScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Reveal the section once the first frame is decodable, so there is
    // never a blank stage. The timeout is a safety net for browsers that
    // stall preloading offscreen video.
    const markReady = () => setReady(true);
    if (video.readyState >= 2) markReady();
    else video.addEventListener("loadeddata", markReady, { once: true });
    const readyFallback = window.setTimeout(markReady, 4000);

    // iOS refuses to decode/seek a video that has never "played". One muted
    // play+pause on first touch unlocks scrubbing.
    const unlock = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    const mm = gsap.matchMedia();

    // Under prefers-reduced-motion nothing below runs: no scrub, no pin-like
    // behavior (CSS collapses the section to one viewport) and the static
    // first frame + headline remain visible.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let tl: gsap.core.Timeline | null = null;

      const build = () => {
        if (tl || !video.duration) return;

        // Master timeline is exactly 1 unit long == scroll progress 0..1.
        tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Stop a couple of frames shy of duration: seeking to the exact end
        // renders black in some browsers, and this keeps the final frame
        // painted once the section scrolls past.
        const endTime = Math.max(video.duration - 0.08, 0);
        const proxy = { t: 0 };
        tl.to(
          proxy,
          {
            t: 1,
            duration: 1,
            onUpdate: () => {
              const target = proxy.t * endTime;
              // Skip sub-half-frame deltas so we don't spam redundant seeks.
              if (Math.abs(video.currentTime - target) > 1 / 60) {
                video.currentTime = target;
              }
            },
          },
          0
        );

        addOverlayAnimations(tl, section);
      };

      // The scrub range depends on video.duration, so the trigger is only
      // created once metadata exists.
      if (video.readyState >= 1) build();
      else video.addEventListener("loadedmetadata", build, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", build);
        tl?.scrollTrigger?.kill();
        tl?.kill();
      };
    });

    return () => {
      window.clearTimeout(readyFallback);
      video.removeEventListener("loadeddata", markReady);
      window.removeEventListener("touchstart", unlock);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${heightVh}vh` }}
      className="relative bg-black motion-reduce:!h-svh"
      aria-label="Cinematic scroll sequence"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Vignette for text legibility — kept subtle. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

        <CinematicOverlays />

        {/* Loading veil: covers the stage until the first frame is ready. */}
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
