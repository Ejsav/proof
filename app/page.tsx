import { CinematicScrollVideo } from "@/components/cinematic/CinematicScrollVideo";

export default function Home() {
  return (
    <main className="bg-black text-white">
      {/* Intro — gives the scrub a resting first frame before scrolling starts. */}
      <header className="flex h-svh flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          A cinematic scroll experience
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl [text-wrap:balance]">
          The story unfolds as you scroll.
        </h1>
        <div className="mt-16 flex flex-col items-center gap-3 text-white/40">
          <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-white/40" />
        </div>
      </header>

      <CinematicScrollVideo
        src="/videos/cinematic-scene.mp4"
        poster="/videos/cinematic-scene-poster.jpg"
        heightVh={500}
      />

      {/* Outro — the final video frame stays visible until this section scrolls in. */}
      <footer
        id="contact"
        className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          Continue
        </p>
        <h2 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl [text-wrap:balance]">
          The rest of the page begins here.
        </h2>
        <p className="max-w-md text-white/60">
          Everything above was driven frame-by-frame by your scroll position.
        </p>
      </footer>
    </main>
  );
}
