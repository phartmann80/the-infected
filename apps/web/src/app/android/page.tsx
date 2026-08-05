import Image from 'next/image';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { ScrollReveal } from '@/components/animation/CinematicMotion';

const features = [
  { name: 'Touch Controls', desc: 'Dual-stick movement and aim. Tap to interact, swipe to look.', icon: 'T' },
  { name: 'Offline Play', desc: 'Full single-player campaign. No connection required.', icon: 'O' },
  { name: 'Minimal Ads', desc: 'No interrupting ads. Optional rewarded videos only.', icon: 'A' },
  { name: 'Small APK', desc: 'Optimized build size. Compressed assets and textures.', icon: 'S' },
  { name: 'High Score', desc: 'Local and cloud-synced high score tracking.', icon: 'H' },
  { name: 'Power-ups', desc: 'Medkits, ammo drops, and speed boosts in-world.', icon: 'P' },
];

const engineSpecs = [
  { label: 'Engine', value: 'Godot 4.7.1' },
  { label: 'Renderer', value: 'Mobile (Vulkan)' },
  { label: 'Target API', value: 'Android 9+ (API 28)' },
  { label: 'Architecture', value: 'ARM64' },
  { label: 'Min Screen', value: '5.0 inch' },
  { label: 'Orientation', value: 'Portrait' },
];

export const metadata = { title: 'Android' };

export default function AndroidPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Platform"
        title="Android"
        description="Built for Android first. Touch controls, offline play, and optimized performance."
        image="/assets/cinematic/env/env-ruined-street.jpg"
        imageAlt="Android game preview"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Phone mockup with game preview */}
          <ScrollReveal>
            <section className="grid items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
              <div>
                <SectionMarker eyebrow="Mobile Experience" title="Play it on your phone." />
                <p className="mt-5 max-w-xl text-sm leading-7 text-stone-400">
                  The Infected is built Android-first with Godot 4.7.1. Touch controls, mobile renderer, and compressed assets keep the game fast and responsive on any modern Android device.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <StatusBadge status="prototype" />
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone-300">
                    ARM64 Native
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone-300">
                    Offline
                  </span>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="relative mx-auto aspect-[9/19] w-64 overflow-hidden rounded-[2.5rem] border-[6px] border-stone-700 bg-black shadow-2xl">
                <Image
                  src="/assets/cinematic/infected-001-v3-portrait.png"
                  alt="Game preview on phone"
                  fill
                  sizes="256px"
                  className="object-cover saturate-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* HUD overlay */}
                <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[85%] rounded-full bg-red-500" />
                    </div>
                    <span className="text-[0.5rem] font-bold text-white/80">85</span>
                  </div>
                  <div className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[0.5rem] font-bold text-white/60 backdrop-blur">
                    Lv 03
                  </div>
                </div>
                {/* Touch control indicators */}
                <div className="absolute bottom-6 left-4 h-12 w-12 rounded-full border-2 border-white/20 bg-white/5" />
                <div className="absolute bottom-6 right-4 h-12 w-12 rounded-full border-2 border-white/20 bg-white/5" />
              </div>
            </section>
          </ScrollReveal>

          {/* Features grid */}
          <ScrollReveal>
            <section>
              <SectionMarker eyebrow="Features" title="What makes it mobile." headingId="android-features" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="group rounded-xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/15">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200/20 bg-orange-100/5 text-lg font-black text-orange-100/60">
                      {feature.icon}
                    </div>
                    <h3 className="mt-3 text-sm font-black uppercase tracking-[-0.04em] text-white">{feature.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-stone-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Engine specs */}
          <ScrollReveal>
            <section className="rounded-2xl border border-white/10 bg-[#0a0a09] p-6 sm:p-8">
              <SectionMarker eyebrow="Technical" title="Engine specs." headingId="android-specs" />
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {engineSpecs.map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{spec.label}</p>
                    <p className="mt-1 text-sm font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* APK Provenance Notice */}
          <ScrollReveal>
            <section className="rounded-2xl border border-orange-200/15 bg-gradient-to-br from-orange-950/10 to-transparent p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">APK under verification.</h2>
                  <p className="mt-2 text-sm text-stone-400">The public APK download is temporarily disabled while we verify build provenance. Join early access to be notified when the verified build is available.</p>
                </div>
                <a href="/early-access" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-black transition hover:bg-orange-400">
                  Join Early Access <span aria-hidden>→</span>
                </a>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}