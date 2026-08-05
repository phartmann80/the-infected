import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { ScrollReveal } from '@/components/animation/CinematicMotion';

const infectedTypes = [
  {
    id: 'infected-001',
    name: 'Infected 001',
    designation: 'Runner',
    image: '/assets/cinematic/infected-001-v3-portrait.png',
    status: 'internal-review' as const,
    stats: { speed: 80, aggression: 70, awareness: 60, durability: 40 },
    behavior: ['Sprint pursuit', 'Group attacks', 'Sound-triggered'],
    wounds: 'Decaying flesh, exposed forearm bone, torn clothing',
    detection: 'Sight and sound. Will investigate noise sources within 15m.',
    threat: 'High in groups. Manageable alone.',
  },
  {
    id: 'infected-002',
    name: 'Infected 002',
    designation: 'Brute',
    image: '/assets/cinematic/infected-002-v3-portrait.png',
    status: 'internal-review' as const,
    stats: { speed: 40, aggression: 90, awareness: 50, durability: 85 },
    behavior: ['Charge attack', 'Single target focus', 'High damage'],
    wounds: 'Severe decomposition, exposed ribcage, missing lower jaw',
    detection: 'Sight only. Slow to detect but relentless once engaged.',
    threat: 'Very high. Can down a survivor in 2-3 hits.',
  },
];

const plannedTypes = [
  { name: 'The Crawler', designation: 'Stealth', desc: 'Low-to-ground infected that ambushes from dark corners. Silent until it strikes.', icon: 'C' },
  { name: 'The Screamer', designation: 'Alarm', desc: 'Vocal infected that alerts other infected to your position. Priority target.', icon: 'S' },
  { name: 'The Bloated', designation: 'Tank', desc: 'Heavily mutated infected with toxic burst on death. Area denial threat.', icon: 'B' },
];

export const metadata = { title: 'Infected — Bestiary' };

export default function InfectedPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Bestiary"
        title="The Infected"
        description="They were us. Now they hunt us. Each type has its own behavior, threat level, and weakness."
        image="/assets/cinematic/infected-001-v3-portrait.png"
        imageAlt="Infected 001 portrait"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Infected showcase — large visual cards */}
          {infectedTypes.map((infected, i) => (
            <ScrollReveal key={infected.id} delay={i * 0.05}>
              <article className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
                {/* Large portrait */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                  <Image
                    src={infected.image}
                    alt={`${infected.name} portrait`}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover saturate-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                        {infected.designation}
                      </span>
                    </div>
                    <StatusBadge status={infected.status} />
                  </div>
                </div>

                {/* Info panel */}
                <div className="flex flex-col justify-center">
                  <SectionMarker eyebrow={infected.designation} title={infected.name} />
                  <p className="mt-5 text-sm leading-7 text-stone-400">{infected.wounds}</p>

                  {/* Stats with visual bars */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {Object.entries(infected.stats).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-white/10 bg-[#0a0a09] p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{key}</span>
                          <span className="text-xs font-bold text-orange-100">{value}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-400" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Behavior tags */}
                  <div className="mt-5">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Behavior</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {infected.behavior.map((b) => (
                        <span key={b} className="rounded-md border border-orange-200/15 bg-orange-100/5 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-orange-100/80">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Detection */}
                  <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Detection</p>
                    <p className="mt-1.5 text-xs leading-5 text-stone-300">{infected.detection}</p>
                  </div>

                  {/* Threat level */}
                  <div className="mt-5 rounded-xl border border-red-200/15 bg-red-100/5 p-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-red-100/60">Threat Level</p>
                    <p className="mt-1.5 text-sm font-bold text-red-100">{infected.threat}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}

          {/* Planned infected types */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Planned" title="More are coming." description="Additional infected types are in development with unique behaviors and threat profiles." />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {plannedTypes.map((type) => (
                  <div key={type.name} className="group rounded-xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-xl font-black text-stone-600 transition group-hover:text-orange-500/30">
                      {type.icon}
                    </div>
                    <h3 className="mt-3 text-base font-black uppercase tracking-[-0.04em] text-white">{type.name}</h3>
                    <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-orange-100/50">{type.designation}</p>
                    <p className="mt-2 text-xs leading-5 text-stone-400">{type.desc}</p>
                    <div className="mt-3">
                      <StatusBadge status="planned" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}