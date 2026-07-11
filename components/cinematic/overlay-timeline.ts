import gsap from "gsap";
import { OVERLAY_CUES } from "./overlay-config";

/**
 * Adds the text-overlay animations onto the master scrubbed timeline.
 *
 * The master timeline is exactly 1 unit long (scroll progress 0–1), so cue
 * fractions from overlay-config.ts can be used directly as timeline positions.
 * Shared by the MP4 and the canvas image-sequence renderers so both stay in sync.
 */
export function addOverlayAnimations(tl: gsap.core.Timeline, root: HTMLElement) {
  for (const cue of OVERLAY_CUES) {
    const el = root.querySelector<HTMLElement>(`[data-cue="${cue.id}"]`);
    if (!el) continue;

    const span = cue.end - cue.start;
    const enter = span * (cue.persist ? 0.45 : 0.35);
    const exit = span * 0.3;

    gsap.set(el, { autoAlpha: 0, y: 48, scale: 0.97, filter: "blur(14px)" });

    tl.to(
      el,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: enter,
        ease: "power2.out",
      },
      cue.start
    );

    if (!cue.persist) {
      // Drift slightly upward while dissolving, per the cinematic brief.
      tl.to(
        el,
        {
          autoAlpha: 0,
          y: -36,
          filter: "blur(10px)",
          duration: exit,
          ease: "power2.in",
        },
        cue.end - exit
      );
    }
  }
}
