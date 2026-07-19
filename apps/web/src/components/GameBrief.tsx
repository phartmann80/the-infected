import { gameDirectionCards } from '@the-infected/game-data';

export function GameBrief() {
  return (
    <section id="field-manual" className="relative overflow-hidden border-t border-white/10 bg-[#080909] px-5 py-24 text-stone-200 sm:px-8 sm:py-32 lg:px-12">
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#050606] to-transparent" />
      <div aria-hidden className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-orange-950/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-orange-100/60">Field manual / Prototype direction</p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl">The rules of the road are still being written.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-400 sm:text-lg">
            These are the project’s current creative and production signals. They give the landing page a useful shape while the canonical game data, hero media, and Android prototype move through review.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {gameDirectionCards.map((card, index) => (
            <article key={card.id} className="group rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-orange-200/25 hover:bg-white/[0.055] sm:p-8">
              <div className="flex items-center justify-between gap-4 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-stone-500">
                <span><span className="font-mono text-orange-200/70">0{index + 1}</span> / {card.eyebrow}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.58rem] text-orange-100/65">{card.status}</span>
              </div>
              <h3 className="mt-7 max-w-sm text-2xl font-black uppercase leading-[0.95] tracking-[-0.045em] text-white sm:text-3xl">{card.title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-stone-400 sm:text-base">{card.copy}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-stone-600">
          Directional copy only · no canonical characters, enemies, weapons, or economy are declared here.
        </p>
      </div>
    </section>
  );
}
