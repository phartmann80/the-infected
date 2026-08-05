import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';

export const metadata = { title: 'Survivors' };

export default function SurvivorsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Survivors"
        title="The Living"
        description="Those who remain. Armed, desperate, and still human."
        image="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
        imageAlt="Survivor 001 model"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Survivor 001 showcase */}
          <article className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
              <Image
                src="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
                alt="Survivor 001 full body 3D model"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center saturate-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                  SURVIVOR / 001
                </span>
                <StatusBadge status="internal-review" />
              </div>
            </div>

            <div>
              <SectionMarker eyebrow="Survivor 001" title="The last signal follower." />
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-400">
                Generated as a 3D game-ready model via Meshy AI. The GLB export is Godot-compatible for direct use in the Android game. Realistic tactical survivor with vest, cargo pants, and combat boots.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Health', value: '100' },
                  { label: 'Stamina', value: '85' },
                  { label: 'Speed', value: '70' },
                  { label: 'Carry', value: '45kg' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-[#0a0a09] p-4 text-center">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-black text-orange-100">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Equipment */}
              <div className="mt-8">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Default loadout</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Warden-9 Pistol', 'Field Pack 45', 'Bastion Vest', 'Sentinel Helmet', 'Relay Radio', 'Pathfinder Boots'].map((item) => (
                    <span key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-stone-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3D model info */}
              <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">3D Model Specs</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  <div><dt className="text-stone-500">Source</dt><dd className="font-bold text-stone-200">Meshy AI</dd></div>
                  <div><dt className="text-stone-500">Format</dt><dd className="font-bold text-stone-200">GLB</dd></div>
                  <div><dt className="text-stone-500">Textures</dt><dd className="font-bold text-stone-200">2K PBR</dd></div>
                  <div><dt className="text-stone-500">Engine</dt><dd className="font-bold text-stone-200">Godot 4.7</dd></div>
                  <div><dt className="text-stone-500">Pose</dt><dd className="font-bold text-stone-200">A-pose</dd></div>
                  <div><dt className="text-stone-500">LOD</dt><dd className="font-bold text-stone-200">3-tier</dd></div>
                </dl>
              </div>
            </div>
          </article>

          {/* Planned survivors */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-[#0a0a09] p-6 sm:p-8">
            <SectionMarker eyebrow="Planned roster" title="More survivors are coming." description="Additional survivor characters are in development with unique backstories, loadouts, and abilities." />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { name: 'The Medic', desc: 'Field medic with enhanced healing capabilities and medical equipment bonuses.' },
                { name: 'The Engineer', desc: 'Trap specialist. Can craft explosive devices and fortify positions.' },
                { name: 'The Scout', desc: 'Stealth-oriented survivor with increased awareness and silent movement.' },
              ].map((survivor) => (
                <div key={survivor.name} className="rounded-xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black uppercase tracking-[-0.04em] text-white">{survivor.name}</h3>
                    <StatusBadge status="planned" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-400">{survivor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}