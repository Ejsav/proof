import { OVERLAY_CUES, type OverlayCue } from "./overlay-config";

const ALIGN_CLASSES: Record<OverlayCue["align"], string> = {
  center: "items-center justify-center text-center",
  left: "items-center justify-start text-left pl-[8vw]",
  right: "items-center justify-end text-right pr-[8vw]",
};

/**
 * The stacked text layers for the scroll sequence. Rendered identically by the
 * MP4 and canvas variants; GSAP animates them via their data-cue attributes.
 *
 * In animated mode every layer starts at opacity-0 and GSAP takes over.
 * Under prefers-reduced-motion GSAP never runs, so the first layer is shown
 * statically and the rest stay hidden (invisible also removes the CTA link
 * from the tab order while it can't be seen).
 */
export function CinematicOverlays() {
  return (
    <>
      {OVERLAY_CUES.map((cue, i) => (
        <div
          key={cue.id}
          data-cue={cue.id}
          className={`pointer-events-none absolute inset-0 flex px-6 opacity-0 will-change-[transform,opacity,filter] ${
            ALIGN_CLASSES[cue.align]
          } ${i === 0 ? "motion-reduce:opacity-100" : "motion-reduce:invisible"}`}
        >
          <div className="max-w-xl">
            {cue.eyebrow && (
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-white/60 md:text-xs">
                {cue.eyebrow}
              </p>
            )}
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl [text-wrap:balance]">
              {cue.title}
            </h2>
            {cue.body && (
              <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
                {cue.body}
              </p>
            )}
            {cue.cta && (
              <a
                href={cue.cta.href}
                className="pointer-events-auto mt-8 inline-block rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {cue.cta.label}
              </a>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
