/**
 * Text overlay cues for the cinematic scroll sequence.
 *
 * `start` / `end` are fractions (0–1) of the master scrubbed timeline,
 * i.e. of the section's total scroll distance. Edit these numbers to
 * re-time any block — both the MP4 and the canvas renderer read from here.
 */
export interface OverlayCue {
  id: string;
  /** Timeline progress (0–1) where the block starts entering. */
  start: number;
  /** Timeline progress (0–1) where the block has fully exited (or, if `persist`, where its entrance settles). */
  end: number;
  /** Skip the exit animation and stay visible through the end of the sequence. */
  persist?: boolean;
  align: "center" | "left" | "right";
  eyebrow?: string;
  title: string;
  body?: string;
  cta?: { label: string; href: string };
}

export const OVERLAY_CUES: OverlayCue[] = [
  {
    id: "headline",
    start: 0.05,
    end: 0.22,
    align: "center",
    eyebrow: "A new perspective",
    title: "Engineered for the moment.",
  },
  {
    id: "chapter-two",
    start: 0.32,
    end: 0.48,
    align: "left",
    eyebrow: "01 — Precision",
    title: "Every detail, deliberate.",
    body: "Nothing added. Nothing spared. Form that follows intention.",
  },
  {
    id: "chapter-three",
    start: 0.58,
    end: 0.75,
    align: "right",
    eyebrow: "02 — Motion",
    title: "Stillness, in movement.",
    body: "Designed to feel effortless at any speed — including yours.",
  },
  {
    id: "finale",
    start: 0.82,
    end: 0.96,
    persist: true,
    align: "center",
    eyebrow: "The experience",
    title: "See it for yourself.",
    cta: { label: "Reserve a viewing", href: "#contact" },
  },
];
