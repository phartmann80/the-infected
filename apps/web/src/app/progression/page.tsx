import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { ScrollReveal } from '@/components/animation/CinematicMotion';

const missionNodes = [
  { id: 'arrival', name: 'The Arrival', level: '01', status: 'completed' as const, x: 10, y: 50 },
  { id: 'service', name: 'Service District', level: '02', status: 'completed' as const, x: 25, y: 30 },
  { id: 'quarantine', name: 'Quarantine Checkpoint', level: '03', status: 'active' as const, x: 40, y: 55 },
  { id: 'building', name: 'Abandoned Building', level: '04', status: 'locked' as const, x: 55, y: 35 },
  { id: 'industrial', name: 'Industrial Zone', level: '05', status: 'locked' as const, x: 70, y: 50 },
  { id: 'source', name: 'The Source Room', level: '06', status: 'locked' as const, x: 85, y: 30 },
];

const nodeColors: Record<string, string> = {
  completed: 'border-green-200/40 bg-green-100/15 text-green-100',
  active: 'border-orange-200/50 bg-orange-100/20 text-orange-100 anim-glow-pulse',
  locked: 'border-stone-200/10 bg-stone-100/5 text-stone-500',
};

const achievements = [
  { name: 'First Contact', desc: 'Encounter your first infected', icon: '!', status: 'completed' as const },
  { name: 'Signal Hunter', desc: 'Reach the quarantine checkpoint', icon: 'S', status: 'completed' as const },
  { name: 'Pack Rat', desc: 'Fill your backpack to capacity', icon: 'P', status: 'completed' as const },
  { name: 'Marksman', desc: 'Land 50 headshots', icon: 'M', status: 'active' as const },
  { name: 'Survivor', desc: 'Survive 10 levels without dying', icon: 'V', status: 'locked' as const },
  { name: 'The Truth', desc: 'Reach the source room', icon: 'T', status: 'locked' as const },
];

const unlocks = [
  { name: 'Warden-9 Pistol', type: 'Weapon', level: '01', icon: 'W' },
  { name: 'Raven-12 Shotgun', type: 'Weapon', level: '03', icon: 'S' },
  { name: 'Bastion Vest', type: 'Gear', level: '02', icon: 'A' },
  { name: 'Sentinel Helmet', type: 'Gear', level: '03', icon: 'H' },
  { name: 'Cinder-5 Carbine', type: 'Weapon', level: '04', icon: 'C' },
  { name: 'Field Pack 45', type: 'Gear', level: '01', icon: 'B' },
];

export const metadata = { title: 'Progression — Mission Map' };

export default function ProgressionPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Progression"
        title="Mission Map"
        description="The path through the outbreak. Every level unlocks new weapons, gear, and challenges."
        image="/assets/cinematic/env/env-quarantine-checkpoint.jpg"
        imageAlt="Quarantine checkpoint environment"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Visual mission map */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="World Map" title="The path through the city." headingId="mission-map" />
              <div className="mt-8 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-stone-900 via-[#0a0a09] to-black p-6 sm:p-10">
                {/* Map background — stylized city grid */}
                <div className="absolute inset-0 opacity-10">
                  <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(rgba(255,100,30,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,100,30,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Mission nodes with connector lines */}
                <div className="relative aspect-[2/1] sm:aspect-[3/1]">
                  <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {missionNodes.slice(0, -1).map((node, i) => {
                      const next = missionNodes[i + 1];
                      const isUnlocked = node.status === 'completed' || node.status === 'active';
                      return (
                        <line
                          key={i}
                          x1={node.x}
                          y1={node.y}
                          x2={next.x}
                          y2={next.y}
                          stroke={isUnlocked ? 'rgba(255,100,30,0.4)' : 'rgba(120,113,108,0.2)'}
                          strokeWidth="0.5"
                          strokeDasharray={isUnlocked ? '0' : '2,2'}
                        />
                      );
                    })}
                  </svg>

                  {missionNodes.map((node) => (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${nodeColors[node.status]} sm:h-14 sm:w-14`}>
                        <span className="text-sm font-black sm:text-base">{node.level}</span>
                      </div>
                      <p className="mt-2 max-w-[100px] text-center text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-400">
                        {node.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Map legend */}
                <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-green-200/40 bg-green-100/15" />
                    <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-orange-200/50 bg-orange-100/20" />
                    <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border-2 border-stone-200/10 bg-stone-100/5" />
                    <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-400">Locked</span>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Achievements */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Achievements" title="Milestones" headingId="achievements" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((ach) => (
                  <div key={ach.name} className={`group rounded-xl border p-5 transition ${
                    ach.status === 'completed'
                      ? 'border-green-200/20 bg-green-100/5'
                      : ach.status === 'active'
                      ? 'border-orange-200/20 bg-orange-100/5'
                      : 'border-white/10 bg-[#0a0a09]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-black ${
                        ach.status === 'completed'
                          ? 'border-green-200/30 bg-green-100/10 text-green-100'
                          : ach.status === 'active'
                          ? 'border-orange-200/30 bg-orange-100/10 text-orange-100'
                          : 'border-white/10 bg-black/30 text-stone-600'
                      }`}>
                        {ach.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-[-0.04em] text-white">{ach.name}</h3>
                        <p className="mt-0.5 text-xs text-stone-400">{ach.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Unlocks */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Unlocks" title="What you earn." headingId="unlocks" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unlocks.map((unlock) => (
                  <div key={unlock.name} className="group rounded-xl border border-white/10 bg-[#0a0a09] p-4 transition hover:border-orange-200/15">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200/20 bg-orange-100/5 text-lg font-black text-orange-100/60">
                        {unlock.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{unlock.type}</p>
                        <h3 className="text-sm font-bold text-white">{unlock.name}</h3>
                      </div>
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-400">
                        Lv {unlock.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Zone info */}
          <ScrollReveal>
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-green-200/15 bg-green-100/[0.03] p-6">
                <SectionMarker eyebrow="Safe Zones" title="Where you breathe." />
                <p className="mt-4 text-sm leading-7 text-stone-400">Safe rooms between levels. Save your progress, manage inventory, and prepare for the next push.</p>
              </div>
              <div className="rounded-2xl border border-red-200/15 bg-red-100/[0.03] p-6">
                <SectionMarker eyebrow="High-Risk Areas" title="Where you gamble." />
                <p className="mt-4 text-sm leading-7 text-stone-400">Optional high-threat zones with rare loot. The risk is real. The rewards are worth it.</p>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}