import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { WEAPONS } from '@/lib/catalog-data';

const categoryOrder = ['pistol', 'shotgun', 'carbine', 'bolt-action-rifle', 'marksman-rifle', 'revolver', 'submachine-gun'];
const categoryLabels: Record<string, string> = {
  pistol: 'Pistols',
  shotgun: 'Shotguns',
  carbine: 'Carbines',
  'bolt-action-rifle': 'Bolt-Action Rifles',
  'marksman-rifle': 'Marksman Rifles',
  revolver: 'Revolvers',
  'submachine-gun': 'SMGs',
  melee: 'Melee',
  throwable: 'Throwables',
  explosives: 'Explosives',
};

const meleeWeapons = [
  { name: 'Machete', category: 'melee', status: 'planned' as const, damage: 75, speed: 60, range: 'Close', desc: 'Heavy blade for decisive melee strikes. Wide arc, readable wind-up.' },
  { name: 'Combat Knife', category: 'melee', status: 'planned' as const, damage: 45, speed: 90, range: 'Close', desc: 'Fast stabbing weapon. Low damage but rapid recovery between strikes.' },
  { name: 'Axe', category: 'melee', status: 'planned' as const, damage: 85, speed: 35, range: 'Close', desc: 'Heavy overhead chop. Highest melee damage with slowest recovery.' },
];

const explosiveWeapons = [
  { name: 'Grenade', category: 'throwable', status: 'planned' as const, damage: 95, radius: '4m', desc: 'Fragmentation grenade. Timed fuse with area denial.' },
  { name: 'Dynamite', category: 'explosives', status: 'planned' as const, damage: 90, radius: '5m', desc: 'Placeable explosive charge. Manual detonation or fuse timer.' },
  { name: 'Explosive Trap', category: 'explosives', status: 'planned' as const, damage: 80, radius: '3m', desc: 'Proximity-triggered trap. Ambush defense for choke points.' },
];

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
          {byCategory.map((group) => (
            <section key={group.label}>
              <SectionMarker eyebrow={group.label} title={group.label} headingId={`weapons-${group.label}`} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.weapons.map((weapon) => (
                  <article key={weapon.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                    <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/12" />
                    <div className="relative">
                      {/* Weapon visual placeholder */}
                      <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 to-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-600">
                            <path d="M2 12h20M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l3 3" />
                          </svg>
                        </div>
                        <span className="absolute bottom-2 right-2 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-stone-400 backdrop-blur">
                          Render pending
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{weapon.subCategory}</p>
                          <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
                        </div>
                        <StatusBadge status={weapon.status as any} />
                      </div>
                      <p className="mt-3 text-xs leading-5 text-stone-400">{weapon.purpose}</p>

                      {/* Stats */}
                      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.58rem]">
                        <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Damage</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.stats.damage}</dd></div>
                        <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Fire Rate</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.stats.fireRateRpm} rpm</dd></div>
                        <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Range</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.stats.rangeMeters}m</dd></div>
                        <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Magazine</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.stats.magazineCapacity}</dd></div>
                      </dl>

                      {/* Ammo & reload */}
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
          ))}

          {/* Melee weapons */}
          <section>
            <SectionMarker eyebrow="Melee" title="Melee Weapons" headingId="weapons-melee" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meleeWeapons.map((weapon) => (
                <article key={weapon.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                  <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/12" />
                  <div className="relative">
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 to-black">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-600">
                          <path d="M3 21l6-6M14 4l6 6-4 4-6-6 4-4z" />
                        </svg>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-full border border-amber-200/20 bg-amber-100/5 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-amber-100/80 backdrop-blur">
                        Render pending
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">Melee</p>
                        <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
                      </div>
                      <StatusBadge status={weapon.status} />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-stone-400">{weapon.desc}</p>
                    <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-2 text-[0.58rem]">
                      <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Damage</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.damage}</dd></div>
                      <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Speed</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.speed}</dd></div>
                      <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Range</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.range}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Explosives */}
          <section>
            <SectionMarker eyebrow="Explosives" title="Explosives & Throwables" headingId="weapons-explosives" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {explosiveWeapons.map((weapon) => (
                <article key={weapon.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15 sm:p-6">
                  <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/12" />
                  <div className="relative">
                    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-stone-900 to-black">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-600">
                          <circle cx="12" cy="12" r="6" /><path d="M12 6V3M12 3l2-1M18 6l2-2" />
                        </svg>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-full border border-amber-200/20 bg-amber-100/5 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-amber-100/80 backdrop-blur">
                        Render pending
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{weapon.category}</p>
                        <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
                      </div>
                      <StatusBadge status={weapon.status} />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-stone-400">{weapon.desc}</p>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.58rem]">
                      <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Damage</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.damage}</dd></div>
                      <div><dt className="font-bold uppercase tracking-[0.14em] text-stone-500">Blast Radius</dt><dd className="mt-0.5 text-xs font-bold text-orange-100">{weapon.radius}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <p className="text-center text-xs text-stone-500">Weapon renders and turntable videos are in production. Items marked Planned are not yet implemented in the game prototype.</p>
        </div>
      </div>
    </PageShell>
  );
}