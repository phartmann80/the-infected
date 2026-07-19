'use client';

import { landingChapters } from '@the-infected/game-data';

type CinematicChaptersProps = {
  onJoin: () => void;
};

const chapterLinks = [
  { id: 'arrival', number: '01', name: 'Arrival' },
  ...landingChapters.map(({ id, number, name }) => ({ id, number, name })),
  { id: 'join-the-survivors', number: '07', name: 'Join the Survivors' },
];

export function CinematicChapters({ onJoin }: CinematicChaptersProps) {
  return (
    <section id="chapters" className="relative overflow-hidden bg-[#050606] px-5 py-24 text-stone-200 sm:px-8 sm:py-32 lg:px-12">
      <div aria-hidden className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-[#0a0705]/75 to-transparent" />
      <div aria-hidden className="absolute left-1/2 top-24 h-[38rem] w-[52rem] -translate-x-1/2 rounded-full bg-orange-950/18 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-orange-100/60">Chapter file / Prototype direction</p>
            <h2 className="mt-5 max-w-sm text-4xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl">
              Go deeper than the first signal.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-stone-400">
              The landing page is being built as a descent into the city, not a brochure. These chapter beats define the reveal while final lore and production media remain under review.
            </p>

            <nav aria-label="Cinematic chapters" className="mt-9 overflow-x-auto border-y border-white/12 py-3 lg:border-y-0 lg:border-l lg:py-0 lg:pl-4">
              <ol className="flex min-w-max gap-1 lg:block lg:min-w-0 lg:space-y-1">
                {chapterLinks.map((chapter) => (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      className="group flex min-h-10 items-center gap-3 whitespace-nowrap rounded-xl px-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-500 transition hover:bg-white/6 hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200/70 lg:rounded-r-xl"
                    >
                      <span className="font-mono text-[0.65rem] text-orange-200/55 group-hover:text-orange-200">{chapter.number}</span>
                      <span>{chapter.name}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {landingChapters.map((chapter, index) => (
              <article id={chapter.id} key={chapter.id} className="scroll-mt-8 border-t border-white/12 pt-5">
                <div className="flex items-center justify-between gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  <span><span className="font-mono text-orange-200/70">{chapter.number}</span> / {chapter.name}</span>
                  <span className="hidden sm:inline">Field note {String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className="mt-5 grid gap-7 md:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)] md:items-center">
                  <div className={`relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-white/12 ${chapter.glow}`}>
                    <div aria-hidden className="absolute inset-5 rounded-[1.2rem] border border-white/12" />
                    <div aria-hidden className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-200/50 to-transparent" />
                    <div aria-hidden className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-100/30 shadow-[0_0_70px_rgba(255,84,32,0.2)]" />
                    <div className="absolute inset-x-8 bottom-7 flex items-end justify-between gap-4 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-stone-400">
                      <span className="text-orange-100/70">{chapter.signal}</span>
                      <span className="text-right">No canonical media</span>
                    </div>
                  </div>

                  <div className="max-w-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-orange-100/60">Next reveal</p>
                    <h3 className="mt-4 text-3xl font-black uppercase leading-none tracking-[-0.05em] text-white sm:text-5xl">{chapter.name}</h3>
                    <p className="mt-5 text-base leading-7 text-stone-400 sm:text-lg">{chapter.copy}</p>
                  </div>
                </div>
              </article>
            ))}

            <article id="join-the-survivors" className="scroll-mt-8 rounded-[2rem] border border-orange-200/18 bg-[radial-gradient(circle_at_80%_10%,rgba(255,88,31,0.22),transparent_30%),linear-gradient(135deg,#16100d,#080807_68%)] p-7 sm:p-10 lg:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.42em] text-orange-100/70">07 / Conversion moment</p>
              <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <h3 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-6xl">Join the Survivors.</h3>
                  <p className="mt-5 text-base leading-7 text-stone-300 sm:text-lg">The world is still being uncovered. Get the first signal when the next chapter is ready.</p>
                </div>
                <button
                  type="button"
                  onClick={onJoin}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-orange-500 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_70px_rgba(255,74,28,.24)] transition hover:scale-[1.02] hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  Join the Survivors
                </button>
              </div>
              <p className="mt-8 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-stone-500">Early-access flow is a local prototype and does not store submissions yet.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
