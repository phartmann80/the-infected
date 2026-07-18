import Link from 'next/link';
import Image from 'next/image';
import { ChapterNavigation } from './ChapterNavigation';
import { EarlyAccessForm } from './EarlyAccessForm';

type RegistryStatus = 'approved' | 'prototype' | 'placeholder' | 'blocked' | 'internal-review';

type RegistryEntry = {
  code: string;
  label: string;
  title: string;
  description: string;
  status: RegistryStatus;
  image?: string;
  imageAlt?: string;
};

const storyBeats = [
  {
    number: '01',
    label: 'The first silence',
    title: 'The city stopped answering.',
    description: 'Sirens became static. The emergency network kept repeating one location after every other channel went dark.',
  },
  {
    number: '02',
    label: 'The change',
    title: 'The streets learned to move.',
    description: 'Something crossed the quarantine line. The people who stayed behind stopped behaving like people.',
  },
  {
    number: '03',
    label: 'The signal',
    title: 'One transmission remains.',
    description: 'A weak pulse is still coming from inside the dead zone. Following it means leaving the last safe room behind.',
  },
] as const;

const registryEntries: RegistryEntry[] = [
  {
    code: 'SURVIVOR / 001',
    label: 'Human presentation',
    title: 'Survivor 001 is ready for review.',
    description: 'One candidate presentation now anchors the first shared web and Android visual reference. It has no final name, backstory, or roster implication until creative approval.',
    status: 'internal-review',
    image: '/assets/cinematic/survivor-001-production-candidate-internal-review.jpg',
    imageAlt: 'Internal-review candidate portrait of Survivor 001 in the quarantine route',
  },
  {
    code: 'INFECTED / 001',
    label: 'Threat presentation',
    title: 'Infected 001 is ready for review.',
    description: 'One candidate now establishes the first shared threat reference for the website and future Android readability review. No creature roster, final behavior, or lore is implied.',
    status: 'internal-review',
    image: '/assets/cinematic/infected-001-production-candidate-internal-review.jpg',
    imageAlt: 'Internal-review candidate portrait of Infected 001 at a ruined quarantine checkpoint',
  },
];

const survivorEntry = registryEntries[0];
const infectedEntry = registryEntries[1];

const arsenal = [
  {
    code: 'A-01',
    name: 'Field blade',
    role: 'Close-range / prototype',
    description: 'A practical tool for the space between a locked door and the next breath.',
    detail: 'Fast recovery / low reach',
  },
  {
    code: 'A-02',
    name: 'Signal flare',
    role: 'Utility / prototype',
    description: 'Light is useful when you need a route. It is dangerous when something else needs one too.',
    detail: 'Area reveal / limited supply',
  },
  {
    code: 'A-03',
    name: 'Recovered sidearm',
    role: 'Ranged / prototype',
    description: 'Every shot solves one problem and announces another. Ammunition is a decision, not a default.',
    detail: 'Short burst / scarce ammo',
  },
] as const;

const levels = [
  {
    index: '01',
    name: 'The arrival route',
    location: 'Outer quarantine',
    description: 'A broken approach road, a locked checkpoint, and the first proof that the signal is real.',
    status: 'prototype' as const,
  },
  {
    index: '02',
    name: 'The service district',
    location: 'Below the city',
    description: 'Maintenance corridors turn the city into a maze. Every shortcut has a cost.',
    status: 'prototype' as const,
  },
  {
    index: '03',
    name: 'The source room',
    location: 'Signal origin',
    description: 'The destination is known. What waits there is not. This chapter remains unreleased.',
    status: 'blocked' as const,
  },
] as const;

const progression = [
  {
    label: 'Carry',
    title: 'Make room for what matters.',
    description: 'Inventory space makes every found object a question: use it, carry it, or leave it for the dark.',
  },
  {
    label: 'Adapt',
    title: 'Survival is a route, not a score.',
    description: 'Prototype progression connects equipment choices and discovered paths to the next playable chapter.',
  },
  {
    label: 'Salvage',
    title: 'Nothing comes back for free.',
    description: 'Loot and currency data are prototype-only. Names, values, and drop tables await a balance pass.',
  },
] as const;

const lootLedger = [
  {
    label: 'Loot',
    state: 'Field salvage',
    description: 'Collected materials and ammunition remain prototype data. Drop tables and final names await balance review.',
  },
  {
    label: 'Currency',
    state: 'Value pending',
    description: 'A future salvage economy is acknowledged without inventing prices, vendors, or progression rewards.',
  },
  {
    label: 'Carry rule',
    state: 'Slice constraint',
    description: 'Inventory space keeps each pickup readable in the current movement, combat, loot, and save loop.',
  },
] as const;

const gameplayLoop = [
  {
    step: '01',
    label: 'Reach',
    title: 'Follow the signal.',
    description: 'Move through the review-only Environment 001 route until the beacon confirms the next objective.',
  },
  {
    step: '02',
    label: 'Survive',
    title: 'Read the threat.',
    description: 'One infected closes the distance. Movement, health, camera control, and melee recoil keep the encounter legible.',
  },
  {
    step: '03',
    label: 'Recover',
    title: 'Carry what remains.',
    description: 'Collect scrap and ammunition, use a medkit when the route turns against you, and keep the HUD readable.',
  },
  {
    step: '04',
    label: 'Persist',
    title: 'Make the route repeatable.',
    description: 'The versioned local save records the run, while RESET RUN returns the prototype to its opening state.',
  },
] as const;

const budgets = [
  ['LCP', '≤ 2.5s', 'Representative mid-range mobile device'],
  ['Initial JS', '≤ 220 KB', 'Compressed before hero media'],
  ['Hero poster', '≤ 350 KB', 'Video and audio remain opt-in'],
  ['Interaction', '≤ 3.5s', 'Throttled mobile connection'],
] as const;

const statusStyles: Record<RegistryStatus, string> = {
  approved: 'border-emerald-200/25 bg-emerald-100/10 text-emerald-100',
  prototype: 'border-orange-200/20 bg-orange-100/5 text-orange-100/80',
  placeholder: 'border-sky-200/20 bg-sky-100/5 text-sky-100/80',
  blocked: 'border-red-200/20 bg-red-100/5 text-red-100/80',
  'internal-review': 'border-orange-200/30 bg-orange-100/10 text-orange-100',
};

function StatusBadge({ status }: { status: RegistryStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function SectionMarker({ chapter, eyebrow, title, description, headingId }: { chapter: string; eyebrow: string; title: string; description?: string; headingId: string }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
        <span className="h-px w-8 bg-orange-300/70" aria-hidden />
        {chapter} / {eyebrow}
      </p>
      <h2 id={headingId} className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">{title}</h2>
      {description && <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">{description}</p>}
    </div>
  );
}

function RegistryCard({ entry }: { entry: RegistryEntry }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c0d] p-6 shadow-[0_24px_100px_rgba(0,0,0,.2)] sm:p-8">
      <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl transition duration-700 group-hover:bg-orange-500/20" />
      <div className="relative flex min-h-72 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-stone-400">{entry.code}</p>
            <StatusBadge status={entry.status} />
          </div>
          {entry.image && (
            <div className="relative mt-6 aspect-[5/8] overflow-hidden rounded-[1.5rem] border border-orange-200/15 bg-black/30">
              <Image src={entry.image} alt={entry.imageAlt ?? ''} fill sizes="(min-width: 768px) 42vw, 100vw" loading="lazy" className="object-cover object-center saturate-[0.82]" />
              <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">Review frame</span>
            </div>
          )}
          <p className="mt-16 text-xs uppercase tracking-[0.28em] text-orange-100/60">{entry.label}</p>
          <h3 className="mt-4 max-w-md text-3xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-white">{entry.title}</h3>
          <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400">{entry.description}</p>
        </div>
        <div className="mt-10 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone-400">
          <span className="h-px flex-1 bg-white/10" aria-hidden />
          Registry governed
        </div>
      </div>
    </article>
  );
}

export function LandingChapters() {
  return (
    <div className="bg-[#060606] text-stone-200">
      <ChapterNavigation />

      <section id="story" aria-labelledby="story-heading" className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div aria-hidden className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-[#080403] to-transparent" />
        <div aria-hidden className="absolute left-1/2 top-20 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-orange-950/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <SectionMarker
              chapter="Chapter 01"
              eyebrow="The outbreak"
              title="The city did not end. It changed."
              description="The world went quiet before it fell. The last signal does not promise rescue. It promises a direction."
              headingId="story-heading"
            />
            <div className="rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.035] p-6 sm:p-8">
              <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">
                <span>Emergency channel / 07</span>
                <span className="flex items-center gap-2 text-red-200/80"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" aria-hidden />Live</span>
              </div>
              <p className="mt-12 max-w-xl text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white sm:text-4xl">“If you can hear this, the quarantine is already gone.”</p>
              <div className="mt-10 flex items-end gap-1" aria-label="Signal activity visualization">
                {[18, 34, 12, 52, 28, 72, 44, 88, 22, 56, 31, 64, 18, 42, 26, 76, 38, 54, 20, 48].map((height, index) => (
                  <span key={`${height}-${index}`} className="h-10 flex-1 bg-orange-300/45" style={{ transform: `scaleY(${height / 100})`, transformOrigin: 'bottom' }} aria-hidden />
                ))}
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-stone-400">Transmission continues / location withheld</p>
            </div>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {storyBeats.map((beat) => (
              <article key={beat.number} className="bg-[#0a0a09] p-6 sm:p-8">
                <p className="text-5xl font-black tracking-[-0.08em] text-orange-100/20">{beat.number}</p>
                <p className="mt-12 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{beat.label}</p>
                <h3 className="mt-4 text-2xl font-black uppercase leading-none tracking-[-0.05em] text-white">{beat.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{beat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="world" aria-labelledby="world-heading" className="relative overflow-hidden border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize: '72px 72px', maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)' }} />
        <div className="relative mx-auto max-w-7xl">
          <SectionMarker
            chapter="Chapter 02"
            eyebrow="World building"
            title="Every street remembers what happened."
            description="The outbreak is told through places, missing voices, and the practical traces people leave behind when they run out of time."
            headingId="world-heading"
          />
          <div className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <figure className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0c0e] p-6 sm:p-8">
              <Image
                src="/assets/cinematic/environment-001-production-candidate-internal-review.jpg"
                alt="Internal-review candidate frame of the ruined Environment 001 quarantine route"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                loading="lazy"
                className="object-cover object-center opacity-55 saturate-[0.7]"
              />
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(255,79,27,.24),transparent_23%),linear-gradient(135deg,rgba(22,47,60,.8),transparent_48%),linear-gradient(180deg,transparent_50%,rgba(0,0,0,.92))]" />
              <div aria-hidden className="absolute bottom-0 left-[12%] h-40 w-20 border-x border-t border-white/10 bg-black/30 sm:h-56 sm:w-28" />
              <div aria-hidden className="absolute bottom-0 left-[34%] h-56 w-28 border-x border-t border-orange-200/15 bg-black/35 sm:h-72 sm:w-40" />
              <div aria-hidden className="absolute bottom-0 right-[15%] h-32 w-24 border-x border-t border-white/10 bg-black/25 sm:h-44 sm:w-36" />
              <div className="relative z-10 flex h-full min-h-[24rem] flex-col justify-between">
                <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-400">
                  <span>Field record / environment 001</span>
                  <span className="rounded-full border border-orange-200/20 bg-orange-100/10 px-3 py-1 text-orange-100/80">Internal review candidate</span>
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-orange-100/65">The arrival route</p>
                  <h3 className="mt-4 max-w-lg text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-white sm:text-6xl">The road in is the first thing to disappear.</h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">This Environment 001 candidate is the first shared visual reference for the web and Android milestone. It remains unapproved and non-canonical until creative review.</p>
                </div>
              </div>
              <figcaption className="sr-only">Internal-review, non-canonical Environment 001 candidate. Final production art is still awaiting approval.</figcaption>
            </figure>
            <div className="grid gap-5">
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/65">Evidence / 01</p>
                <h3 className="mt-12 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white">No exposition without a footprint.</h3>
                <p className="mt-5 text-sm leading-7 text-stone-400">A barricade, a dead radio, a door left open. The world should tell the story before a character explains it.</p>
              </article>
              <article className="rounded-[2rem] border border-white/10 bg-[#0b0b0a] p-6 sm:p-8">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/65">Evidence / 02</p>
                <h3 className="mt-12 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white">The signal is a promise and a trap.</h3>
                <p className="mt-5 text-sm leading-7 text-stone-400">Every chapter moves toward the same question: who is still transmitting, and why have they waited?</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="survivors" aria-labelledby="survivors-heading" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionMarker
            chapter="Chapter 03"
            eyebrow="Survivor presentation"
            title="Human stakes before a roster."
            description="One survivor candidate anchors the first shared visual reference for the website and playable slice. The presentation remains internal review until the creative gate is approved."
            headingId="survivors-heading"
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <RegistryCard entry={survivorEntry} />
            <aside className="rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.035] p-6 sm:p-8">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/65">Character gate / 001</p>
              <h3 className="mt-12 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white">A person first. A roster later.</h3>
              <p className="mt-5 text-sm leading-7 text-stone-400">The candidate is a shared reference, not a final character canon. Name, backstory, equipment detail, and production approval remain open review decisions.</p>
              <dl className="mt-10 grid gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.18em]">
                <div className="flex items-center justify-between gap-4"><dt className="text-stone-400">Asset state</dt><dd className="text-orange-100/80">Internal review</dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-stone-400">Shared use</dt><dd className="text-stone-300">Web / Android reference</dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-stone-400">Roster scope</dt><dd className="text-stone-300">One candidate</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section id="infected" aria-labelledby="infected-heading" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionMarker
            chapter="Chapter 04"
            eyebrow="Infected presentation"
            title="The threat gets a chapter of its own."
            description="The first infected design will define how tension moves through the world. Until a candidate is approved, the threat language stays intentionally focused on one prototype enemy."
            headingId="infected-heading"
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <RegistryCard entry={infectedEntry} />
            <div className="rounded-[2rem] border border-red-200/15 bg-red-100/[0.035] p-6 sm:p-8">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-red-100/65">Threat boundary / prototype</p>
              <h3 className="mt-12 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white">One infected. No roster.</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-400">The Android slice proves one readable enemy encounter. This page will not imply additional variants, names, abilities, or final lore until the first infected candidate passes creative review.</p>
              <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-stone-400">Current state</p><p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-orange-100/80">Internal review</p></div>
                <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-stone-400">Playable scope</p><p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-stone-300">One enemy</p></div>
                <div><p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-stone-400">Next gate</p><p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-stone-300">Behavior + Android review</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="arsenal" aria-labelledby="arsenal-heading" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionMarker
              chapter="Chapter 05"
              eyebrow="Arsenal"
              title="What still works in your hands."
              description="Equipment is practical, scarce, and readable at a glance. These are prototype loadout placeholders, not final balance or item canon."
              headingId="arsenal-heading"
            />
            <StatusBadge status="prototype" />
          </div>
          <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {arsenal.map((item) => (
              <article key={item.code} className="grid gap-4 py-7 sm:grid-cols-[100px_1fr_auto] sm:items-center">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-100/55">{item.code}</p>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">{item.name}</h3>
                    <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone-400">{item.role}</span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">{item.description}</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400 sm:text-right">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" aria-labelledby="mission-heading" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <SectionMarker
            chapter="Chapter 06"
            eyebrow="The mission"
            title="Keep moving toward the source."
            description="The first playable route is small by design. It needs one environment, one survivor, one infected, and enough tension to make the next door matter."
            headingId="mission-heading"
          />
          <div id="loop" className="mt-14 rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.035] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/65">Android vertical slice / internal evaluation</p>
                <h3 className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white sm:text-4xl">The first route is a loop.</h3>
              </div>
              <StatusBadge status="prototype" />
            </div>
            <ol aria-label="Android prototype gameplay loop" className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {gameplayLoop.map((item) => (
                <li key={item.step} className="bg-[#0b0b0a] p-5 sm:p-6">
                  <p className="text-4xl font-black tracking-[-0.08em] text-orange-100/20" aria-hidden>{item.step}</p>
                  <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{item.label}</p>
                  <h4 className="mt-3 text-xl font-black uppercase leading-none tracking-[-0.05em] text-white">{item.title}</h4>
                  <p className="mt-4 text-sm leading-7 text-stone-400">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {levels.map((level) => (
              <article key={level.index} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0a] p-6 sm:p-8">
                <div aria-hidden className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="relative flex min-h-72 flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="text-5xl font-black tracking-[-0.08em] text-white/15">{level.index}</p>
                    <StatusBadge status={level.status} />
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{level.location}</p>
                    <h3 className="mt-4 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white">{level.name}</h3>
                    <p className="mt-4 text-sm leading-7 text-stone-400">{level.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div id="progression" className="mt-20 grid gap-12 border-t border-white/10 pt-14 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionMarker
              chapter="Chapter 07"
              eyebrow="Progression"
              title="Salvage has a cost."
              description="Progression should reward attention, not grind. The first loop will prove how movement, combat, inventory, and saving fit together."
              headingId="progression-heading"
            />
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-3">
              {progression.map((item) => (
                <article key={item.label} className="bg-[#0a0a09] p-6">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{item.label}</p>
                  <h3 className="mt-14 text-2xl font-black uppercase leading-none tracking-[-0.05em] text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-stone-400">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div id="loot" aria-labelledby="loot-heading" className="mt-10 rounded-[2rem] border border-orange-200/15 bg-orange-100/[0.035] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/65">Loot / currency / prototype data</p>
                <h3 id="loot-heading" className="mt-3 text-3xl font-black uppercase leading-none tracking-[-0.06em] text-white sm:text-4xl">Every pickup has a job.</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">The page shows the shape of the economy without presenting placeholder values as final game canon.</p>
              </div>
              <StatusBadge status="prototype" />
            </div>
            <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
              {lootLedger.map((item) => (
                <article key={item.label} className="bg-[#0a0a09] p-5 sm:p-6">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{item.label}</p>
                  <p className="mt-8 text-xl font-black uppercase leading-none tracking-[-0.05em] text-white">{item.state}</p>
                  <p className="mt-4 text-sm leading-7 text-stone-400">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="review" aria-labelledby="review-heading" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionMarker chapter="Build discipline" eyebrow="Review gates" title="The atmosphere has a budget." description="These targets keep the cinematic surface usable on the devices that need the most care. They are gates to measure, not results to imply." headingId="review-heading" />
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2">
            {budgets.map(([label, value, detail]) => (
              <div key={label} className="bg-[#0b0b0a] p-6 sm:p-8">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-400">{label}</p>
                <p className="mt-8 text-3xl font-black tracking-[-0.06em] text-orange-100">{value}</p>
                <p className="mt-3 text-sm leading-6 text-stone-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" aria-labelledby="join-heading" className="border-t border-white/8 px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-orange-200/20 bg-[radial-gradient(circle_at_80%_20%,rgba(255,78,25,.18),transparent_34%),#0d0b0a] p-7 sm:p-12 lg:p-16">
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-orange-200/10" />
          <div aria-hidden className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-orange-200/10" />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65"><span className="h-px w-8 bg-orange-300/70" aria-hidden />Transmission / Early Access</p>
              <h2 id="join-heading" className="mt-5 text-5xl font-black uppercase leading-[0.88] tracking-[-0.08em] text-white sm:text-7xl">Be there when the signal answers.</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-stone-400 sm:text-lg">Leave a signal for the next transmission. The registration contract is defined, but this preview keeps persistence closed until privacy, contact, retention, and deployment review are complete.</p>
            </div>
            <EarlyAccessForm
              idPrefix="landing"
              source="landing"
              heading="Leave your signal"
              registrationEnabled={false}
              description="The form is ready for the reviewed backend. This preview returns an unavailable state and stores nothing while registration is closed."
              className="max-w-sm rounded-2xl border border-white/10 bg-black/20 p-5"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 text-sm text-stone-400 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div>
            <p className="font-black uppercase tracking-[0.2em] text-stone-200">The Infected</p>
            <p className="mt-3 max-w-sm leading-6">A cinematic survival game in development. Android availability and all game systems remain in production.</p>
          </div>
          <nav aria-label="Game chapters" className="flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[0.16em]">
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="#story">Story</Link>
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="#arsenal">Arsenal</Link>
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="#mission">Mission</Link>
          </nav>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[0.16em]">
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="/legal/privacy">Privacy</Link>
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="/legal/terms">Terms</Link>
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="/legal/cookies">Cookies</Link>
            <Link className="transition hover:text-orange-200 focus:outline-none focus-visible:text-orange-200" href="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
