import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';

export const metadata = { title: 'Android' };

export default function AndroidPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Android"
        title="Built for Touch"
        description="The Infected is an Android-first game. Touch controls, offline play, and a mobile renderer are built into the foundation."
        image="/assets/cinematic/env/env-ruined-street.jpg"
        imageAlt="Android game environment"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12">
          <section>
            <SectionMarker eyebrow="Features" title="Mobile-first design." headingId="android-features" />
            <div className="mt-8 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Touch Movement', desc: 'Analog virtual joystick with dead-zone calibration and state recovery.' },
                { label: 'Drag-to-Look', desc: 'Drag anywhere on the right side to rotate the camera. Look-ahead smoothing.' },
                { label: 'Combat HUD', desc: 'Health bar, ammo counter, weapon indicator, and objective beacon.' },
                { label: 'Save & Load', desc: 'Local save preserves inventory, equipped gear, weapons, and player state.' },
                { label: 'Offline Play', desc: 'No internet required after installation. No login, no account, no cloud sync.' },
                { label: 'Performance', desc: 'Targets 60 FPS on mid-range devices. ARM64 native libraries, mobile renderer.' },
              ].map((feature) => (
                <article key={feature.label} className="bg-[#0b0b0a] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-black uppercase leading-none tracking-[-0.04em] text-white">{feature.label}</h3>
                    <StatusBadge status="prototype" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-400">{feature.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionMarker eyebrow="Build Info" title="Technical specs." headingId="android-specs" />
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              <div className="bg-[#0a0a09] p-5"><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Package</p><p className="mt-2 text-sm font-bold text-stone-200">app.theinfected.game</p></div>
              <div className="bg-[#0a0a09] p-5"><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Version</p><p className="mt-2 text-sm font-bold text-stone-200">0.1.0-prototype</p></div>
              <div className="bg-[#0a0a09] p-5"><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Min SDK</p><p className="mt-2 text-sm font-bold text-stone-200">Android 9 (API 28)</p></div>
              <div className="bg-[#0a0a09] p-5"><p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Target SDK</p><p className="mt-2 text-sm font-bold text-stone-200">API 36</p></div>
            </div>
          </section>

          <section>
            <SectionMarker eyebrow="Engine" title="Godot 4.7.1" headingId="android-engine" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Engine', value: 'Godot 4.7.1' },
                { label: 'Language', value: 'GDScript' },
                { label: 'Renderer', value: 'Mobile' },
                { label: 'Architecture', value: 'ARM64' },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl border border-white/10 bg-[#0a0a09] p-5 text-center">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">{spec.label}</p>
                  <p className="mt-2 text-lg font-black text-orange-100">{spec.value}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="text-center text-xs text-stone-500">Screenshots shown are from internal-review candidates, not final production builds. No fabricated gameplay screenshots are used.</p>
        </div>
      </div>
    </PageShell>
  );
}