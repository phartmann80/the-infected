import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';

const missions = [
  { id: 'M01', name: 'Reach the checkpoint', level: '01', status: 'completed' as const, unlocks: 'Service District Access' },
  { id: 'M02', name: 'Find the maintenance key', level: '02', status: 'completed' as const, unlocks: 'Quarantine Breach' },
  { id: 'M03', name: 'Breach the quarantine line', level: '03', status: 'active' as const, unlocks: 'City Access' },
  { id: 'M04', name: 'Search the residential building', level: '04', status: 'locked' as const, unlocks: 'Signal Relay Part' },
  { id: 'M05', name: 'Reach the factory control room', level: '05', status: 'locked' as const, unlocks: 'Industrial Materials' },
  { id: 'M06', name: 'Find the signal source', level: '06', status: 'locked' as const, unlocks: 'Endgame' },
];

const achievements = [
  { name: 'First Contact', desc: 'Encounter your first infected', status: 'unlocked' as const },
  { name: 'Survivor', desc: 'Survive 10 minutes without taking damage', status: 'unlocked' as const },
  { name: 'Scavenger', desc: 'Collect 50 items', status: 'progress' as const },
  { name: 'Marksman', desc: '50 headshot kills', status: 'locked' as const },
  { name: 'Untouchable', desc: 'Complete a level without damage', status: 'locked' as const },
  { name: 'Signal Hunter', desc: 'Reach the signal source', status: 'locked' as const },
];

const unlocks = [
  { name: 'Warden-9 Pistol', type: 'Weapon', level: 'Level 1', status: 'unlocked' as const },
  { name: 'Raven-12 Shotgun', type: 'Weapon', level: 'Level 4', status: 'locked' as const },
  { name: 'Bastion Vest', type: 'Gear', level: 'Level 2', status: 'unlocked' as const },
  { name: 'Sentinel Helmet', type: 'Gear', level: 'Level 3', status: 'locked' as const },
  { name: 'Cinder-5 Carbine', type: 'Weapon', level: 'Level 5', status: 'locked' as const },
  { name: 'Nightglass NVG', type: 'Gear', level: 'Level 6', status: 'locked' as const },
];

const statusConfig = {
  completed: { color: 'border-green-200/30 bg-green-100/10 text-green-100', dot: 'bg-green-400', label: 'Completed' },
  active: { color: 'border-orange-200/30 bg-orange-100/10 text-orange-100', dot: 'bg-orange-400 animate-pulse', label: 'Active' },
  locked: { color: 'border-stone-200/20 bg-stone-100/5 text-stone-500', dot: 'bg-stone-600', label: 'Locked' },
  unlocked: { color: 'border-green-200/30 bg-green-100/10 text-green-100', dot: 'bg-green-400', label: 'Unlocked' },
  progress: { color: 'border-amber-200/20 bg-amber-100/5 text-amber-100', dot: 'bg-amber-400', label: 'In Progress' },
};

export const metadata = { title: 'Progression — Mission Map' };

export default function ProgressionPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Progression"
        title="Mission Map"
        description="Track your path through the outbreak. Every mission unlocks new areas, weapons, and gear."
        image="/assets/cinematic/env/env-quarantine-checkpoint.jpg"
        imageAlt="Quarantine checkpoint"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12">

          {/* Mission path */}
          <section>
            <SectionMarker eyebrow="Mission Path" title="The route through the city." headingId="mission-path" />
            <div className="mt-8 space-y-3">
              {missions.map((mission, i) => {
                const cfg = statusConfig[mission.status];
                return (
                  <div key={mission.id} className="flex items-center gap-4">
                    {/* Connector line */}
                    <div className="flex flex-col items-center">
                      <span className={`h-3 w-3 rounded-full ${cfg.dot}`} />
                      {i < missions.length - 1 && <span className="mt-1 h-8 w-px bg-white/10" />}
                    </div>
                    {/* Mission card */}
                    <div className={`flex flex-1 items-center justify-between rounded-xl border p-4 ${cfg.color}`}>
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] opacity-60">{mission.id} / Level {mission.level}</p>
                        <h3 className="mt-1 text-sm font-black uppercase tracking-[-0.03em]">{mission.name}</h3>
                        <p className="mt-1 text-xs opacity-70">Unlocks: {mission.unlocks}</p>
                      </div>
                      <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em]">{cfg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* World map zones */}
          <section>
            <SectionMarker eyebrow="World Map" title="Safe zones and danger areas." headingId="world-map" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Safe House Alpha', type: 'Safe Zone', status: 'completed' as const, desc: 'First safe room. Save point and basic supplies.' },
                { name: 'Quarantine Perimeter', type: 'Danger Zone', status: 'active' as const, desc: 'High infected density. Military remnants.' },
                { name: 'Residential Sector', type: 'Contested', status: 'locked' as const, desc: 'Mixed threat. Good loot opportunities.' },
                { name: 'Industrial District', type: 'High Risk', status: 'locked' as const, desc: 'Brute territory. Best weapon parts.' },
                { name: 'Extraction Point', type: 'Objective', status: 'locked' as const, desc: 'Final extraction. Signal source location.' },
                { name: 'Underground Tunnels', type: 'Danger Zone', status: 'locked' as const, desc: 'Low visibility. Runner packs.' },
              ].map((zone) => {
                const cfg = statusConfig[zone.status];
                return (
                  <div key={zone.name} className={`rounded-xl border p-5 ${cfg.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] opacity-60">{zone.type}</span>
                      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    </div>
                    <h3 className="mt-2 text-base font-black uppercase tracking-[-0.04em]">{zone.name}</h3>
                    <p className="mt-2 text-xs leading-5 opacity-70">{zone.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <SectionMarker eyebrow="Achievements" title="Milestones." headingId="achievements" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((ach) => {
                const cfg = statusConfig[ach.status];
                return (
                  <div key={ach.name} className={`rounded-xl border p-5 ${cfg.color}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black uppercase tracking-[-0.04em]">{ach.name}</h3>
                      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    </div>
                    <p className="mt-2 text-xs leading-5 opacity-70">{ach.desc}</p>
                    <p className="mt-3 text-[0.58rem] font-bold uppercase tracking-[0.14em]">{cfg.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Unlocks */}
          <section>
            <SectionMarker eyebrow="Unlocks" title="Weapons and gear by progression." headingId="unlocks" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unlocks.map((item) => {
                const cfg = statusConfig[item.status];
                return (
                  <div key={item.name} className={`rounded-xl border p-5 ${cfg.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] opacity-60">{item.type}</span>
                      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    </div>
                    <h3 className="mt-2 text-base font-black uppercase tracking-[-0.04em]">{item.name}</h3>
                    <p className="mt-1 text-xs opacity-70">{item.level}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}