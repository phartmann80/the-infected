import Link from 'next/link';

type RegistryStatus = 'approved' | 'prototype' | 'placeholder' | 'blocked';

type RegistryEntry = {
  label: string;
  title: string;
  description: string;
  status: RegistryStatus;
};

const survivorPresentation: RegistryEntry = {
  label: 'Survivor presentation',
  title: 'A place for the first survivor',
  description: 'The presentation slot is ready for one approved character study. No final roster is implied by this placeholder.',
  status: 'placeholder',
};

const infectedPresentation: RegistryEntry = {
  label: 'Infected presentation',
  title: 'The threat is still unnamed',
  description: 'The threat slot remains registry-governed until an infected design is approved. This page does not invent a creature roster.',
  status: 'placeholder',
};

const prototypeSystems = [
  {
    label: 'Levels',
    title: 'A city in checkpoints',
    description: 'Prototype progression moves from a sealed arrival point toward the next signal.',
  },
  {
    label: 'Weapons',
    title: 'What still works in your hands',
    description: 'Prototype equipment is practical, scarce, and subject to a future balance pass.',
  },
  {
    label: 'Progression',
    title: 'Every decision leaves a mark',
    description: 'Prototype progression will connect survival choices to the route ahead.',
  },
  {
    label: 'Loot and currency',
    title: 'Salvage has a cost',
    description: 'Prototype data only. Economy values, names, and drop tables are not final.',
  },
] as const;

const budgets = [
  'LCP: at or below 2.5 seconds on a representative mid-range mobile device',
  'Initial JavaScript: at or below 220 KB compressed before hero media',
  'Hero poster: at or below 350 KB; video and audio opt in after the first paint',
  'Interaction readiness: at or below 3.5 seconds on a throttled mobile connection',
] as const;

function StatusBadge({ status }: { status: RegistryStatus }) {
  return (
    <span className="inline-flex rounded-full border border-orange-200/20 bg-orange-100/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-orange-100/75">
      {status}
    </span>
  );
}

function RegistryCard({ entry }: { entry: RegistryEntry }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_16px_80px_rgba(0,0,0,.18)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{entry.label}</p>
        <StatusBadge status={entry.status} />
      </div>
      <h3 className="mt-7 text-2xl font-black uppercase leading-none tracking-[-0.05em] text-white">{entry.title}</h3>
      <p className="mt-4 text-sm leading-7 text-stone-400">{entry.description}</p>
    </article>
  );
}

export function LandingChapters() {
  return (
    <div className="bg-[#060606] text-stone-200">
      <section id="story" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-[#080403] to-transparent" />
        <div aria-hidden className="absolute left-1/2 top-16 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-orange-950/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-orange-100/60">Chapter 01 / The outbreak</p>
            <h2 className="mt-5 max-w-xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl">
              Every street remembers what happened.
            </h2>
          </div>
          <div className="max-w-2xl border-l border-orange-200/20 pl-6 text-base leading-8 text-stone-400 sm:text-lg">
            <p>The world went quiet before it fell. The last signal does not promise rescue. It promises a direction.</p>
            <p className="mt-5">The landing page now has a place for the story to unfold without pretending the game is finished. Approved work, prototype data, and placeholders remain visibly separate.</p>
          </div>
        </div>
      </section>

      <section id="survivors" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.42em] text-orange-100/60">Chapter 02 / What remains</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-[-0.06em] text-white sm:text-6xl">Human stakes before a roster.</h2>
            <p className="mt-5 text-base leading-8 text-stone-400">These presentation slots are governed by the registry. They make room for approved work without generating a broad cast of characters or enemies.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <RegistryCard entry={survivorPresentation} />
            <RegistryCard entry={infectedPresentation} />
          </div>
        </div>
      </section>

      <section id="systems" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.42em] text-orange-100/60">Chapter 03 / The mission</p>
              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-[-0.06em] text-white sm:text-6xl">Prototype systems, clearly marked.</h2>
            </div>
            <StatusBadge status="prototype" />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {prototypeSystems.map((system) => (
              <article key={system.label} className="rounded-3xl border border-white/10 bg-[#0b0b0a] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-orange-100/60">{system.label}</p>
                <h3 className="mt-6 text-2xl font-black uppercase leading-none tracking-[-0.05em] text-white">{system.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{system.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="performance" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-orange-100/60">Build discipline</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-[-0.06em] text-white sm:text-6xl">The atmosphere has a budget.</h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <ul className="space-y-5 text-sm leading-7 text-stone-300">
              {budgets.map((budget) => <li key={budget} className="border-b border-white/8 pb-5 last:border-0 last:pb-0">{budget}</li>)}
            </ul>
            <p className="mt-7 text-xs uppercase tracking-[0.18em] text-stone-500">Targets are review gates, not measured results yet.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 text-sm text-stone-500 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-black uppercase tracking-[0.2em] text-stone-200">The Infected</p>
            <p className="mt-3 max-w-sm leading-6">A cinematic survival prototype. Android availability and all game systems remain in development.</p>
          </div>
          <nav aria-label="Legal" className="flex gap-5 text-xs uppercase tracking-[0.16em]">
            <Link className="transition hover:text-orange-200" href="/legal/privacy">Privacy</Link>
            <Link className="transition hover:text-orange-200" href="/legal/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
