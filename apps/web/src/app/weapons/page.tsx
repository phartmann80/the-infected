import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { ScrollReveal } from '@/components/animation/CinematicMotion';
import { WEAPONS } from '@/lib/catalog-data';

const categoryOrder = ['pistol', 'shotgun', 'carbine', 'bolt-action-rifle', 'marksman-rifle', 'revolver', 'submachine-gun'];
const categoryLabels: Record<string, string> = {
  pistol: 'Sidearms',
  shotgun: 'Shotguns',
  carbine: 'Carbines',
  'bolt-action-rifle': 'Bolt-Action Rifles',
  'marksman-rifle': 'Marksman Rifles',
  revolver: 'Revolvers',
  'submachine-gun': 'SMGs',
  melee: 'Melee Weapons',
  throwable: 'Throwables',
  explosives: 'Explosives',
};

const meleeWeapons = [
  { name: 'Machete', category: 'melee', status: 'planned' as const, damage: 75, speed: 60, range: 'Close', desc: 'Heavy blade for decisive melee strikes. Wide arc, readable wind-up.', icon: 'M' },
  { name: 'Combat Knife', category: 'melee', status: 'planned' as const, damage: 45, speed: 90, range: 'Close', desc: 'Fast stabbing weapon. Low damage but rapid recovery between strikes.', icon: 'K' },
  { name: 'Axe', category: 'melee', status: 'planned' as const, damage: 85, speed: 35, range: 'Close', desc: 'Heavy overhead chop. Highest melee damage with slowest recovery.', icon: 'A' },
];

const explosiveWeapons = [
  { name: 'Grenade', category: 'throwable', status: 'planned' as const, damage: 95, radius: '4m', desc: 'Fragmentation grenade. Timed fuse with area denial.', icon: 'G' },
  { name: 'Dynamite', category: 'explosives', status: 'planned' as const, damage: 90, radius: '5m', desc: 'Placeable explosive charge. Manual detonation or fuse timer.', icon: 'D' },
  { name: 'Explosive Trap', category: 'explosives', status: 'planned' as const, damage: 80, radius: '3m', desc: 'Proximity-triggered trap. Ambush defense for choke points.', icon: 'T' },
];

function WeaponStatBar({ label, value, max, unit }: { label: string; value: number; max: number; unit?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{label}</span>
        <span className="text-xs font-bold text-orange-100">{value}{unit}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export const metadata = { title: 'Weapons — Arsenal' };

export default function WeaponsPage() {
  const firearms = WEAPONS.filter((w) => w.category === 'weapon');
  const byCategory = categoryOrder.map((cat) => ({
    label: categoryLabels[cat] ?? cat,
    weapons: firearms.filter((w) => w.subCategory === cat),
  })).filter((g) => g.weapons.length > 0);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Arsenal"
        title="Weapons"
        description="Every weapon has catalog-driven stats, readable timing, and clear feedback. Every shot is a decision."
        image="/assets/cinematic/env/env-ruined-street.jpg"
        imageAlt="Ruined street environment"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-16">

          {/* Firearms by category */}
          {byCategory.map((group, gi) => (
            <ScrollReveal key={group.label} delay={gi * 0.05}>
              <section>
                <SectionMarker eyebrow={group.label} title={group.label} headingId={`weapons-${group.label}`} />
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.weapons.map((weapon) => (
                    <article key={weapon.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                      <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/12" />
                      <div className="relative">
                        {/* Weapon visual — large render area with category icon */}
                        <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 via-[#0d0d0c] to-black">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl font-black text-stone-700/40 transition group-hover:text-orange-500/20 group-hover:scale-110">
                              {weapon.subCategory.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/5 to-transparent" />
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{weapon.subCategory}</p>
                            <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
                          </div>
                          <StatusBadge status={weapon.status as any} />
                        </div>
                        <p className="mt-3 text-xs leading-5 text-stone-400">{weapon.purpose}</p>

                        {/* Stats with visual bars */}
                        <div className="mt-4 space-y-2.5">
                          <WeaponStatBar label="Damage" value={weapon.stats.damage} max={100} />
                          <WeaponStatBar label="Fire Rate" value={weapon.stats.fireRateRpm} max={900} unit=" rpm" />
                          <WeaponStatBar label="Range" value={weapon.stats.rangeMeters} max={100} unit="m" />
                          <WeaponStatBar label="Magazine" value={weapon.stats.magazineCapacity} max={30} unit=" rds" />
                        </div>

                        {/* Ammo & reload tags */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-300">
                            {weapon.ammo.type}
                          </span>
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-300">
                            {weapon.reload.behavior}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          ))}

          {/* Melee weapons */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Melee" title="Melee Weapons" headingId="weapons-melee" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {meleeWeapons.map((weapon) => (
                  <article key={weapon.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                    <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/12" />
                    <div className="relative">
                      {/* Large icon visual */}
                      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 via-[#0d0d0c] to-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-black text-stone-700/40 transition group-hover:text-orange-500/20 group-hover:scale-110">
                            {weapon.icon}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/5 to-transparent" />
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">Melee</p>
                          <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
                        </div>
                        <StatusBadge status={weapon.status} />
                      </div>
                      <p className="mt-3 text-xs leading-5 text-stone-400">{weapon.desc}</p>
                      <div className="mt-4 space-y-2.5">
                        <WeaponStatBar label="Damage" value={weapon.damage} max={100} />
                        <WeaponStatBar label="Speed" value={weapon.speed} max={100} />
                      </div>
                      <div className="mt-3">
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-300">
                          Range: {weapon.range}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Explosives */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Explosives" title="Explosives & Throwables" headingId="weapons-explosives" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {explosiveWeapons.map((weapon) => (
                  <article key={weapon.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                    <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-red-500/6 blur-2xl transition group-hover:bg-red-500/12" />
                    <div className="relative">
                      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 via-[#0d0d0c] to-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-black text-stone-700/40 transition group-hover:text-red-500/20 group-hover:scale-110">
                            {weapon.icon}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-red-950/5 to-transparent" />
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-red-100/55">{weapon.category}</p>
                          <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
                        </div>
                        <StatusBadge status={weapon.status} />
                      </div>
                      <p className="mt-3 text-xs leading-5 text-stone-400">{weapon.desc}</p>
                      <div className="mt-4 space-y-2.5">
                        <WeaponStatBar label="Damage" value={weapon.damage} max={100} />
                      </div>
                      <div className="mt-3">
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-300">
                          Blast Radius: {weapon.radius}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}