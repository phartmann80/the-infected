import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';

const combatActions = [
  { name: 'Machete Attack', type: 'Melee', status: 'planned' as const, desc: 'Wide horizontal slash with readable wind-up. Staggers infected on impact.' },
  { name: 'Knife Attack', type: 'Melee', status: 'planned' as const, desc: 'Fast forward stab. Low damage, rapid recovery, tactical interrupt.' },
  { name: 'Axe Chop', type: 'Melee', status: 'planned' as const, desc: 'Heavy overhead chop. Highest melee damage. Slow recovery.' },
  { name: 'Pistol Fire', type: 'Firearm', status: 'prototype' as const, desc: 'Catalog-driven damage and fire rate. Muzzle flash, shell ejection, procedural audio.' },
  { name: 'Rifle Fire', type: 'Firearm', status: 'prototype' as const, desc: 'Semi-automatic fire with recoil pattern. Effective at medium range.' },
  { name: 'Shotgun Impact', type: 'Firearm', status: 'prototype' as const, desc: 'Spread damage at close range. Visible pellet spread and impact feedback.' },
  { name: 'Reload', type: 'System', status: 'prototype' as const, desc: 'Magazine and per-round reload. Animation-driven with clear timing windows.' },
  { name: 'Weapon Switch', type: 'System', status: 'prototype' as const, desc: 'Quick swap between equipped weapons. Catalog-linked equip animations.' },
  { name: 'Grenade Throw', type: 'Throwable', status: 'planned' as const, desc: 'Arc throw with timed fuse. Area denial and group control.' },
  { name: 'Dynamite', type: 'Explosive', status: 'planned' as const, desc: 'Placeable charge with manual or timed detonation. Ambush tool.' },
  { name: 'Explosive Trap', type: 'Explosive', status: 'planned' as const, desc: 'Proximity-triggered device. Defensive positioning at choke points.' },
  { name: 'Infected Stagger', type: 'Feedback', status: 'prototype' as const, desc: 'Visual and audio stagger reaction when infected take melee or firearm damage.' },
  { name: 'Infected Defeat', type: 'Feedback', status: 'prototype' as const, desc: 'Ragdoll defeat animation. Loot drops on infected takedown.' },
  { name: 'Player Damage', type: 'Feedback', status: 'prototype' as const, desc: 'Screen-edge damage indicator, health bar response, directional feedback.' },
  { name: 'Medkit Use', type: 'Recovery', status: 'prototype' as const, desc: 'Channelled healing with clear timing. Movement limited during use.' },
  { name: 'Defeat & Recovery', type: 'Recovery', status: 'prototype' as const, desc: 'Death screen with respawn at last save. Inventory and state preserved.' },
];

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
          {/* Combat actions grid */}
          <section>
            <SectionMarker eyebrow="Combat Actions" title="How you fight." headingId="combat-actions" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {combatActions.map((action) => (
                <article key={action.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                  <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/12" />
                  <div className="relative">
                    {/* Visual placeholder */}
                    <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 to-black">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-600">
                          {action.type} demo
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-stone-400 backdrop-blur">
                        Video pending
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{action.type}</p>
                        <h3 className="mt-2 text-base font-black uppercase leading-tight tracking-[-0.04em] text-white">{action.name}</h3>
                      </div>
                      <StatusBadge status={action.status} />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-stone-400">{action.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Gameplay loop */}
          <section className="rounded-2xl border border-orange-200/15 bg-orange-100/[0.035] p-6 sm:p-8 lg:p-10">
            <SectionMarker eyebrow="The Loop" title="Explore. Fight. Loot. Survive." headingId="combat-loop" />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {['Explore', 'Fight', 'Loot', 'Equip', 'Save', 'Continue'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="rounded-xl border border-white/10 bg-[#0a0a09] px-4 py-2.5 text-sm font-black uppercase tracking-[-0.03em] text-white">
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
        </div>
      </div>
    </PageShell>
  );
}