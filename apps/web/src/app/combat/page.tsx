import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { ScrollReveal } from '@/components/animation/CinematicMotion';

const combatActions = [
  { name: 'Machete Attack', type: 'Melee', status: 'planned' as const, desc: 'Wide horizontal slash with readable wind-up. Staggers infected on impact.', icon: 'M', color: 'orange' },
  { name: 'Knife Attack', type: 'Melee', status: 'planned' as const, desc: 'Fast forward stab. Low damage, rapid recovery, tactical interrupt.', icon: 'K', color: 'orange' },
  { name: 'Axe Chop', type: 'Melee', status: 'planned' as const, desc: 'Heavy overhead chop. Highest melee damage. Slow recovery.', icon: 'A', color: 'orange' },
  { name: 'Pistol Fire', type: 'Firearm', status: 'prototype' as const, desc: 'Catalog-driven damage and fire rate. Muzzle flash, shell ejection, procedural audio.', icon: 'P', color: 'orange' },
  { name: 'Rifle Fire', type: 'Firearm', status: 'prototype' as const, desc: 'Semi-automatic fire with recoil pattern. Effective at medium range.', icon: 'R', color: 'orange' },
  { name: 'Shotgun Impact', type: 'Firearm', status: 'prototype' as const, desc: 'Spread damage at close range. Visible pellet spread and impact feedback.', icon: 'S', color: 'orange' },
  { name: 'Reload', type: 'System', status: 'prototype' as const, desc: 'Magazine and per-round reload. Animation-driven with clear timing windows.', icon: 'R', color: 'blue' },
  { name: 'Weapon Switch', type: 'System', status: 'prototype' as const, desc: 'Quick swap between equipped weapons. Catalog-linked equip animations.', icon: 'W', color: 'blue' },
  { name: 'Grenade Throw', type: 'Throwable', status: 'planned' as const, desc: 'Arc throw with timed fuse. Area denial and group control.', icon: 'G', color: 'red' },
  { name: 'Dynamite', type: 'Explosive', status: 'planned' as const, desc: 'Placeable charge with manual or timed detonation. Ambush tool.', icon: 'D', color: 'red' },
  { name: 'Explosive Trap', type: 'Explosive', status: 'planned' as const, desc: 'Proximity-triggered device. Defensive positioning at choke points.', icon: 'T', color: 'red' },
  { name: 'Infected Stagger', type: 'Feedback', status: 'prototype' as const, desc: 'Visual and audio stagger reaction when infected take melee or firearm damage.', icon: '!', color: 'amber' },
  { name: 'Infected Defeat', type: 'Feedback', status: 'prototype' as const, desc: 'Ragdoll defeat animation. Loot drops on infected takedown.', icon: 'X', color: 'amber' },
  { name: 'Player Damage', type: 'Feedback', status: 'prototype' as const, desc: 'Screen-edge damage indicator, health bar response, directional feedback.', icon: '!', color: 'red' },
  { name: 'Medkit Use', type: 'Recovery', status: 'prototype' as const, desc: 'Channelled healing with clear timing. Movement limited during use.', icon: '+', color: 'green' },
  { name: 'Defeat & Recovery', type: 'Recovery', status: 'prototype' as const, desc: 'Death screen with respawn at last save. Inventory and state preserved.', icon: 'R', color: 'green' },
];

const colorMap: Record<string, string> = {
  orange: 'from-orange-950/10 to-transparent text-orange-500/20',
  blue: 'from-blue-950/10 to-transparent text-blue-500/20',
  red: 'from-red-950/10 to-transparent text-red-500/20',
  amber: 'from-amber-950/10 to-transparent text-amber-500/20',
  green: 'from-green-950/10 to-transparent text-green-500/20',
};

export const metadata = { title: 'Combat' };

export default function CombatPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Combat System"
        title="Combat"
        description="Read the fight before it reads you. Every weapon has readable timing, catalog-driven stats, and clear feedback."
        image="/assets/cinematic/env/env-industrial-zone.jpg"
        imageAlt="Industrial zone combat environment"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Combat actions grid — visual cards */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Combat Actions" title="How you fight." headingId="combat-actions" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {combatActions.map((action) => (
                  <article key={action.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                    <div aria-hidden className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${colorMap[action.color]} blur-2xl transition group-hover:scale-150`} />
                    <div className="relative">
                      {/* Visual demo area with large icon */}
                      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 via-[#0d0d0c] to-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-5xl font-black transition group-hover:scale-110 ${colorMap[action.color].split(' ').pop()}`}>
                            {action.icon}
                          </span>
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[action.color]}`} />
                        {/* Action type label */}
                        <span className="absolute bottom-2 left-2 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-stone-400 backdrop-blur">
                          {action.type}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-black uppercase leading-tight tracking-[-0.04em] text-white">{action.name}</h3>
                        <StatusBadge status={action.status} />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-stone-400">{action.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Gameplay loop — visual */}
          <ScrollReveal>
            <section className="rounded-2xl border border-orange-200/15 bg-orange-100/[0.035] p-6 sm:p-8 lg:p-10">
              <SectionMarker eyebrow="The Loop" title="Explore. Fight. Loot. Survive." headingId="combat-loop" />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {['Explore', 'Fight', 'Loot', 'Equip', 'Save', 'Continue'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="anim-glow-pulse rounded-xl border border-white/10 bg-[#0a0a09] px-4 py-2.5 text-sm font-black uppercase tracking-[-0.03em] text-white" style={{ animationDelay: `${i * 0.3}s` }}>
                      {step}
                    </span>
                    {i < 5 && <span className="text-orange-100/40" aria-hidden>→</span>}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-stone-400">
                The core loop is built on tension: every room you enter might have supplies, or it might have them. The choice to push forward or fall back is always yours.
              </p>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}