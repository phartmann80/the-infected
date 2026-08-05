import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';

const infectedTypes = [
  {
    code: 'INFECTED / 001',
    name: 'The Runner',
    threat: 'High',
    status: 'prototype' as const,
    image: '/assets/cinematic/infected-001-v3-portrait.png',
    alt: 'Infected 001 photorealistic rotting zombie portrait',
    description: 'A once-human infected driven by relentless pursuit. Grey-green mottled decaying skin, exposed bone on the skull and jaw, torn bloody flesh with visible wounds. Sunken hollow eyes with milky corneas. Torn civilian clothing.',
    behaviors: ['Hunched idle motion', 'Uneven breathing', 'Head twitch', 'Jaw movement', 'Reaching grasp', 'Aggressive lunge'],
    wounds: 'Exposed cranial bone, torn cheek flesh, bite marks on arms',
    detection: 'Sound-based detection. Pursues at sprint speed when alerted.',
    stats: { speed: 85, aggression: 70, awareness: 60, durability: 40 },
  },
  {
    code: 'INFECTED / 002',
    name: 'The Brute',
    threat: 'Extreme',
    status: 'prototype' as const,
    image: '/assets/cinematic/infected-002-v3-portrait.png',
    alt: 'Infected 002 bulky mutated zombie portrait',
    description: 'A bulkier mutated infected with swollen musculature visible through torn skin. Exposed ribs and bone. Torn military vest remnants with blood damage. Unhinged jaw with broken teeth. Milky white eyes. Mottled grey-green decaying skin with lesions.',
    behaviors: ['Heavy breathing', 'Shoulder and chest movement', 'Slow threatening turn', 'Roar / jaw movement', 'Heavy attack wind-up'],
    wounds: 'Exposed ribs, torn military vest, unhinged jaw, broken teeth',
    detection: 'Visual detection at close range. Slow but devastating charge.',
    stats: { speed: 35, aggression: 90, awareness: 40, durability: 85 },
  },
];

const statLabels: Record<string, string> = {
  speed: 'Speed',
  aggression: 'Aggression',
  awareness: 'Awareness',
  durability: 'Durability',
};

export const metadata = { title: 'Infected — Bestiary' };

export default function InfectedPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Bestiary"
        title="The Infected"
        description="They were us. Now they hunt us. Every type has its own behavior, its own weakness, its own way to kill you."
        image="/assets/cinematic/infected-001-v3-portrait.png"
        imageAlt="Infected zombie portrait"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-20">
          {infectedTypes.map((infected) => (
            <article key={infected.code} className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
              {/* Visual */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                <Image
                  src={infected.image}
                  alt={infected.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center saturate-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                    {infected.code}
                  </span>
                  <StatusBadge status={infected.status} />
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-red-200/30 bg-red-100/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-red-100">
                    Threat: {infected.threat}
                  </span>
                </div>
                <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">{infected.name}</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">{infected.description}</p>

                {/* Stats bars */}
                <div className="mt-8 space-y-3">
                  {Object.entries(infected.stats).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stone-500">{statLabels[key]}</span>
                        <span className="text-xs font-bold text-orange-100">{value}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Behaviors */}
                <div className="mt-8">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Behavior patterns</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {infected.behaviors.map((behavior) => (
                      <span key={behavior} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-stone-300">
                        {behavior}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wounds & detection */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-[#0a0a09] p-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Wounds & infection</p>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{infected.wounds}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#0a0a09] p-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Detection</p>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{infected.detection}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Planned types */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a09] p-6 sm:p-8">
            <SectionMarker eyebrow="Planned threats" title="More are coming." description="Additional infected types are in development. Each will have unique AI behavior, visual design, and combat mechanics." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'The Crawler', desc: 'Low-to-ground infected that ambushes from debris.' },
                { name: 'The Siren', desc: 'Vocal infected that attracts others with its scream.' },
                { name: 'The Spitter', desc: 'Ranged acid attack infected.' },
              ].map((type) => (
                <div key={type.name} className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">{type.name}</h3>
                    <StatusBadge status="planned" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-400">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}