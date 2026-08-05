import Image from 'next/image';
import Link from 'next/link';
import { CinematicHero } from '@/components/CinematicHero';
import { ProductionFooter } from '@/components/ProductionFooter';
import { NavHeader } from '@/components/NavHeader';
import { LazyVideo } from '@/components/animation/CinematicMotion';

const featuredCards = [
  {
    href: '/infected',
    label: 'The Infected',
    title: 'They were us.',
    image: '/assets/cinematic/infected-001-v3-portrait.png',
    alt: 'Photorealistic infected zombie portrait',
  },
  {
    href: '/survivors',
    label: 'Survivors',
    title: 'Stay alive. Stay human.',
    image: '/assets/cinematic/survivor-001-production-candidate-internal-review.jpg',
    alt: 'Survivor 001 3D model preview',
  },
  {
    href: '/weapons',
    label: 'Arsenal',
    title: 'Every shell is a decision.',
    image: '/assets/cinematic/env/env-ruined-street.jpg',
    alt: 'Weapons arsenal preview',
  },
  {
    href: '/gear',
    label: 'Gear & Loadout',
    title: 'Every slot matters.',
    image: '/assets/cinematic/env/env-quarantine-checkpoint.jpg',
    alt: 'Gear loadout preview',
  },
  {
    href: '/levels',
    label: 'The World',
    title: 'The city stopped answering.',
    image: '/assets/cinematic/env/env-abandoned-building.jpg',
    alt: 'Level environment preview',
  },
  {
    href: '/combat',
    label: 'Combat',
    title: 'Read the fight.',
    image: '/assets/cinematic/env/env-industrial-zone.jpg',
    alt: 'Combat preview',
  },
];

const screenshots = [
  { src: '/assets/cinematic/infected-001-v3-portrait.png', alt: 'Infected 001 portrait', label: 'Infected 001' },
  { src: '/assets/cinematic/infected-002-v3-portrait.png', alt: 'Infected 002 portrait', label: 'Infected 002' },
  { src: '/assets/cinematic/survivor-001-production-candidate-internal-review.jpg', alt: 'Survivor 001', label: 'Survivor 001' },
  { src: '/assets/cinematic/env/env-ruined-street.jpg', alt: 'Ruined street', label: 'Ruined Street' },
  { src: '/assets/cinematic/env/env-quarantine-checkpoint.jpg', alt: 'Quarantine checkpoint', label: 'Quarantine' },
  { src: '/assets/cinematic/env/env-industrial-zone.jpg', alt: 'Industrial zone', label: 'Industrial Zone' },
];

const envVideos = [
  { mp4: '/assets/cinematic/env/env-ruined-street.mp4', webm: '/assets/cinematic/env/env-ruined-street.webm', poster: '/assets/cinematic/env/env-ruined-street.jpg', label: 'Ruined Streets' },
  { mp4: '/assets/cinematic/env/env-quarantine-checkpoint.mp4', webm: '/assets/cinematic/env/env-quarantine-checkpoint.webm', poster: '/assets/cinematic/env/env-quarantine-checkpoint.jpg', label: 'Quarantine Zone' },
  { mp4: '/assets/cinematic/env/env-industrial-zone.mp4', webm: '/assets/cinematic/env/env-industrial-zone.webm', poster: '/assets/cinematic/env/env-industrial-zone.jpg', label: 'Industrial Zone' },
];

export default function Home() {
  return (
    <>
      <NavHeader />
      <main id="main-content" tabIndex={-1} className="page-enter">
        {/* Cinematic hero */}
        <CinematicHero />

        {/* Featured grid — visual gateway */}
        <section className="border-t border-white/8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
              <span className="h-px w-8 bg-orange-300/70" aria-hidden />
              Explore the game
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              Enter the outbreak.
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] transition hover:border-orange-200/20"
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center saturate-[0.85] transition duration-700 group-hover:scale-105 group-hover:saturate-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.28em] text-orange-100/70">{card.label}</p>
                    <h3 className="mt-2 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-white">{card.title}</h3>
                    <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-orange-100/80 transition group-hover:text-orange-100">
                      Explore <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Environment video showcase */}
        <section className="border-t border-white/8 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
              <span className="h-px w-8 bg-orange-300/70" aria-hidden />
              The world
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-3xl">
              Where it happens.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {envVideos.map((v) => (
                <div key={v.label} className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                  <LazyVideo
                    srcMp4={v.mp4}
                    srcWebm={v.webm}
                    poster={v.poster}
                    className="absolute inset-0 h-full w-full"
                    overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100/70">{v.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshot strip */}
        <section className="border-t border-white/8 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
              <span className="h-px w-8 bg-orange-300/70" aria-hidden />
              Visual gallery
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-3xl">
              See the world.
            </h2>
            <div className="mt-8 flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
              {screenshots.map((shot) => (
                <div key={shot.src} className="relative aspect-[16/10] w-72 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 sm:w-80">
                  <Image src={shot.src} alt={shot.alt} fill sizes="320px" className="object-cover saturate-[0.85] transition group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060606] to-transparent p-3">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100/70">{shot.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/media" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-100 transition hover:text-orange-200">
              View full gallery <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/8 px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-orange-200/15 bg-gradient-to-br from-orange-950/10 to-transparent p-8 sm:p-12 lg:flex-row lg:items-center">
              <div>
                <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
                  <span className="h-px w-8 bg-orange-300/70" aria-hidden />
                  Early Access
                </p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-white sm:text-4xl">
                  Join the outbreak.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-stone-300">
                  Follow the development. Get build updates, new infected reveals, and the first playable build.
                </p>
              </div>
              <Link
                href="/early-access"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-sm font-black uppercase tracking-[0.1em] text-black transition hover:bg-orange-400"
              >
                Join Early Access
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <ProductionFooter />
      </main>
    </>
  );
}