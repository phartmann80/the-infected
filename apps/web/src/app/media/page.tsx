'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import PageShell from '@/components/PageShell';
import { PageHeader } from '@/components/shared';
import { LazyVideo } from '@/components/animation/CinematicMotion';

type FilterCategory = 'All' | 'Trailers' | 'Gameplay' | 'Infected' | 'Survivors' | 'Weapons' | 'Gear' | 'Levels' | 'Screenshots' | '3D Characters';

const filters: FilterCategory[] = ['All', 'Trailers', 'Gameplay', 'Infected', 'Survivors', 'Weapons', 'Gear', 'Levels', 'Screenshots', '3D Characters'];

type MediaItem = {
  id: string;
  type: 'video' | 'image';
  category: Exclude<FilterCategory, 'All'>;
  title: string;
  src: string;
  poster?: string;
  webm?: string;
};

const mediaItems: MediaItem[] = [
  // Trailers
  { id: 'hero-trailer', type: 'video', category: 'Trailers', title: 'Cinematic Hero Trailer', src: '/assets/cinematic/hero-v3.mp4', poster: '/assets/cinematic/hero-v3-poster.jpg' },
  // Infected
  { id: 'inf-001', type: 'image', category: 'Infected', title: 'Infected 001 Portrait', src: '/assets/cinematic/infected-001-v3-portrait.png' },
  { id: 'inf-002', type: 'image', category: 'Infected', title: 'Infected 002 Portrait', src: '/assets/cinematic/infected-002-v3-portrait.png' },
  // Survivors
  { id: 'surv-001', type: 'image', category: 'Survivors', title: 'Survivor 001 Model', src: '/assets/cinematic/survivor-001-production-candidate-internal-review.jpg' },
  // 3D Characters
  { id: '3d-surv', type: 'image', category: '3D Characters', title: 'Survivor 001 3D Turntable', src: '/assets/cinematic/survivor-001-production-candidate-internal-review.jpg' },
  { id: '3d-inf1', type: 'image', category: '3D Characters', title: 'Infected 001 3D Model', src: '/assets/cinematic/infected-001-v3-portrait.png' },
  { id: '3d-inf2', type: 'image', category: '3D Characters', title: 'Infected 002 3D Model', src: '/assets/cinematic/infected-002-v3-portrait.png' },
  // Levels — environment videos
  { id: 'env-street', type: 'video', category: 'Levels', title: 'Ruined Streets', src: '/assets/cinematic/env/env-ruined-street.mp4', webm: '/assets/cinematic/env/env-ruined-street.webm', poster: '/assets/cinematic/env/env-ruined-street.jpg' },
  { id: 'env-quarantine', type: 'video', category: 'Levels', title: 'Quarantine Checkpoint', src: '/assets/cinematic/env/env-quarantine-checkpoint.mp4', webm: '/assets/cinematic/env/env-quarantine-checkpoint.webm', poster: '/assets/cinematic/env/env-quarantine-checkpoint.jpg' },
  { id: 'env-building', type: 'video', category: 'Levels', title: 'Abandoned Building', src: '/assets/cinematic/env/env-abandoned-building.mp4', webm: '/assets/cinematic/env/env-abandoned-building.webm', poster: '/assets/cinematic/env/env-abandoned-building.jpg' },
  { id: 'env-industrial', type: 'video', category: 'Levels', title: 'Industrial Zone', src: '/assets/cinematic/env/env-industrial-zone.mp4', webm: '/assets/cinematic/env/env-industrial-zone.webm', poster: '/assets/cinematic/env/env-industrial-zone.jpg' },
  { id: 'env-tunnel', type: 'video', category: 'Levels', title: 'Underground Tunnel', src: '/assets/cinematic/env/env-underground-tunnel.mp4', webm: '/assets/cinematic/env/env-underground-tunnel.webm', poster: '/assets/cinematic/env/env-underground-tunnel.jpg' },
  // Screenshots
  { id: 'ss-1', type: 'image', category: 'Screenshots', title: 'Environment Shot 1', src: '/assets/cinematic/env/env-ruined-street.jpg' },
  { id: 'ss-2', type: 'image', category: 'Screenshots', title: 'Environment Shot 2', src: '/assets/cinematic/env/env-quarantine-checkpoint.jpg' },
  { id: 'ss-3', type: 'image', category: 'Screenshots', title: 'Environment Shot 3', src: '/assets/cinematic/env/env-industrial-zone.jpg' },
  { id: 'ss-4', type: 'image', category: 'Screenshots', title: 'Environment Shot 4', src: '/assets/cinematic/env/env-abandoned-building.jpg' },
];

export default function MediaPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return mediaItems;
    return mediaItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Media"
        title="Gallery"
        description="Trailers, infected reveals, environment loops, character models, and screenshots."
        image="/assets/cinematic/env/env-ruined-street.jpg"
        imageAlt="Media gallery"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition ${
                  activeFilter === filter
                    ? 'border-orange-200/30 bg-orange-100/15 text-orange-100'
                    : 'border-white/10 bg-[#0a0a09] text-stone-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Media grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                {item.type === 'video' && item.poster ? (
                  <LazyVideo
                    srcMp4={item.src}
                    srcWebm={item.webm}
                    poster={item.poster}
                    className="absolute inset-0 h-full w-full"
                    overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover saturate-[0.85] transition group-hover:scale-105 group-hover:saturate-100"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060606] to-transparent p-4">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100/60">{item.category}</p>
                  <h3 className="mt-1 text-sm font-black uppercase tracking-[-0.04em] text-white">{item.title}</h3>
                </div>
                {item.type === 'video' && (
                  <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-orange-100 backdrop-blur">
                    Video
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-stone-500">No media in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}