import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { LazyVideo, ScrollReveal } from '@/components/animation/CinematicMotion';

const levels = [
  {
    index: '01',
    name: 'The Arrival Route',
    location: 'Outer quarantine',
    description: 'A broken approach road, a locked checkpoint, and the first proof that the signal is real.',
    status: 'prototype' as const,
    env: 'env-ruined-street',
    objective: 'Reach the quarantine checkpoint',
    threats: 'Runner infected, environmental debris',
    loot: 'Basic supplies, pistol ammunition',
    hazards: 'Collapsed road sections, abandoned vehicles',
  },
  {
    index: '02',
    name: 'The Service District',
    location: 'Below the city',
    description: 'Maintenance corridors turn the city into a maze. Every shortcut has a cost.',
    status: 'prototype' as const,
    env: 'env-underground-tunnel',
    objective: 'Navigate the maintenance tunnels',
    threats: 'Runner infected groups, low visibility',
    loot: 'Industrial tools, medical supplies',
    hazards: 'Flooding, electrical hazards, dead ends',
  },
  {
    index: '03',
    name: 'The Quarantine Checkpoint',
    location: 'City perimeter',
    description: 'The line that was supposed to hold. Abandoned military equipment and the first infected traces.',
    status: 'prototype' as const,
    env: 'env-quarantine-checkpoint',
    objective: 'Breach the checkpoint and enter the city',
    threats: 'Brute infected, military automatons',
    loot: 'Military-grade weapons, armor inserts',
    hazards: 'Razor wire, automated turrets, toxic residue',
  },
  {
    index: '04',
    name: 'The Abandoned Building',
    location: 'Residential sector',
    description: 'Every room has a story you do not want to read. Supplies are here, but so are they.',
    status: 'prototype' as const,
    env: 'env-abandoned-building',
    objective: 'Search the building for the signal relay',
    threats: 'Runner infected, nest areas',
    loot: 'Consumer supplies, radio parts, medkits',
    hazards: 'Unstable floors, dark rooms, locked doors',
  },
  {
    index: '05',
    name: 'The Industrial Zone',
    location: 'Manufacturing district',
    description: 'The machines kept running after the people stopped. Loud, dangerous, and full of salvage.',
    status: 'prototype' as const,
    env: 'env-industrial-zone',
    objective: 'Reach the factory control room',
    threats: 'Brute infected, environmental hazards',
    loot: 'Industrial materials, weapon parts, explosives',
    hazards: 'Active machinery, chemical spills, high noise',
  },
  {
    index: '06',
    name: 'The Source Room',
    location: 'Signal origin',
    description: 'The destination is known. What waits there is not. This chapter remains unreleased.',
    status: 'planned' as const,
    env: 'env-ruined-street',
    objective: 'Unknown',
    threats: 'Unknown',
    loot: 'Unknown',
    hazards: 'Unknown',
  },
];

export const metadata = { title: 'Levels — The World' };

export default function LevelsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="The World"
        title="Levels"
        description="Every level has its own identity, its own threats, and its own rewards. Not all are playable yet."
        videoSrc="/assets/cinematic/env/env-ruined-street.mp4"
        poster="/assets/cinematic/env/env-ruined-street.jpg"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          {levels.map((level, i) => (
            <ScrollReveal key={level.index} delay={i * 0.05}>
              <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                {/* Environment visual — large video or image */}
                <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[16/6]">
                  {level.status === 'prototype' ? (
                    <LazyVideo
                      srcMp4={`/assets/cinematic/env/${level.env}.mp4`}
                      srcWebm={`/assets/cinematic/env/${level.env}.webm`}
                      poster={`/assets/cinematic/env/${level.env}.jpg`}
                      className="absolute inset-0 h-full w-full"
                      overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]/40"
                    />
                  ) : (
                    <Image
                      src={`/assets/cinematic/env/${level.env}.jpg`}
                      alt={level.name}
                      fill
                      sizes="100vw"
                      className="object-cover saturate-[0.7]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between sm:bottom-6 sm:left-8">
                    <div>
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-orange-100/50">Level {level.index} / {level.location}</p>
                      <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.04em] text-white sm:text-3xl">{level.name}</h2>
                    </div>
                    <StatusBadge status={level.status} />
                  </div>
                </div>

                {/* Details — visual info grid */}
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
                  {[
                    { label: 'Objective', value: level.objective, icon: 'O' },
                    { label: 'Threats', value: level.threats, icon: 'T' },
                    { label: 'Expected Loot', value: level.loot, icon: 'L' },
                    { label: 'Hazards', value: level.hazards, icon: 'H' },
                  ].map((detail) => (
                    <div key={detail.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-orange-200/20 bg-orange-100/5 text-[0.58rem] font-black text-orange-100/60">
                          {detail.icon}
                        </span>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">{detail.label}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-stone-300">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}

          {/* Planned levels */}
          <ScrollReveal>
            <div className="rounded-2xl border border-white/10 bg-[#0a0a09] p-6 sm:p-8">
              <SectionMarker eyebrow="Planned" title="More environments coming." description="Additional levels are being designed with unique environments, objectives, and infected types." />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {['Rooftops', 'Subway System', 'Hospital', 'Power Plant'].map((name) => (
                  <div key={name} className="group rounded-xl border border-white/10 bg-black/30 p-5 transition hover:border-orange-200/15">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-xl font-black text-stone-600 transition group-hover:text-orange-500/30">
                      ?
                    </div>
                    <h3 className="mt-3 text-base font-black uppercase tracking-[-0.04em] text-white">{name}</h3>
                    <div className="mt-3">
                      <StatusBadge status="planned" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}