'use client';

import Image from 'next/image';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge } from '@/components/shared';
import { LazyVideo } from '@/components/animation/CinematicMotion';

type MediaItem = {
  id: string;
  title: string;
  type: 'video' | 'image';
  category: 'Trailer' | 'Infected' | 'Survivors' | 'Weapons' | 'Gear' | 'Levels' | 'Gameplay' | 'Screenshots' | '3D Models';
  src?: string;
  poster?: string;
  image?: string;
  alt: string;
};

const filters = ['All', 'Trailer', 'Gameplay', 'Infected', 'Survivors', 'Weapons', 'Gear', 'Levels', 'Screenshots', '3D Models'] as const;

const mediaItems: MediaItem[] = [
  { id: 'hero', title: 'Cinematic Hero', type: 'video', category: 'Trailer', src: '/assets/cinematic/hero-cinematic-v5.mp4', poster: '/assets/cinematic/hero-poster-v5.jpg', alt: 'Cinematic hero video' },
  { id: 'inf-001', title: 'Infected 001 Portrait', type: 'image', category: 'Infected', image: '/assets/cinematic/infected-001-v3-portrait.png', alt: 'Infected 001 portrait' },
  { id: 'inf-002', title: 'Infected 002 Portrait', type: 'image', category: 'Infected', image: '/assets/cinematic/infected-002-v3-portrait.png', alt: 'Infected 002 portrait' },
  { id: 'surv-001', title: 'Survivor 001', type: 'image', category: 'Survivors', image: '/assets/cinematic/survivor-001-production-candidate-internal-review.jpg', alt: 'Survivor 001 model' },
  { id: 'env-street', title: 'Ruined Street', type: 'video', category: 'Levels', src: '/assets/cinematic/env/env-ruined-street.mp4', poster: '/assets/cinematic/env/env-ruined-street.jpg', alt: 'Ruined street environment' },
  { id: 'env-quarantine', title: 'Quarantine Checkpoint', type: 'video', category: 'Levels', src: '/assets/cinematic/env/env-quarantine-checkpoint.mp4', poster: '/assets/cinematic/env/env-quarantine-checkpoint.jpg', alt: 'Quarantine checkpoint environment' },
  { id: 'env-building', title: 'Abandoned Building', type: 'video', category: 'Levels', src: '/assets/cinematic/env/env-abandoned-building.mp4', poster: '/assets/cinematic/env/env-abandoned-building.jpg', alt: 'Abandoned building environment' },
  { id: 'env-industrial', title: 'Industrial Zone', type: 'video', category: 'Levels', src: '/assets/cinematic/env/env-industrial-zone.mp4', poster: '/assets/cinematic/env/env-industrial-zone.jpg', alt: 'Industrial zone environment' },
  { id: 'env-tunnel', title: 'Underground Tunnel', type: 'video', category: 'Levels', src: '/assets/cinematic/env/env-underground-tunnel.mp4', poster: '/assets/cinematic/env/env-underground-tunnel.jpg', alt: 'Underground tunnel environment' },
  { id: 'char-inf-001', title: 'Infected 001 3D Model', type: 'image', category: '3D Models', image: '/assets/characters/infected-001.png', alt: 'Infected 001 3D character model' },
  { id: 'char-inf-002', title: 'Infected 002 3D Model', type: 'image', category: '3D Models', image: '/assets/characters/infected-002.png', alt: 'Infected 002 3D character model' },
  { id: 'char-surv', title: 'Survivor 001 3D Model', type: 'image', category: '3D Models', image: '/assets/characters/survivor-001.png', alt: 'Survivor 001 3D character model' },
];

export default function MediaPage() {
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All' ? mediaItems : mediaItems.filter((m) => m.category === filter);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Gallery"
        title="Media"
        description="Trailers, character models, environment loops, and screenshots from The Infected."
        image="/assets/cinematic/infected-001-v3-portrait.png"
        imageAlt="Infected portrait"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition ${
                  filter === f
                    ? 'border-orange-200/30 bg-orange-100/10 text-orange-100'
                    : 'border-white/10 bg-[#0a0a09] text-stone-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                {item.type === 'video' && item.src ? (
                  <LazyVideo
                    srcMp4={item.src ?? ''}
                    poster={item.poster ?? ''}
                    className="absolute inset-0 h-full w-full"
                    overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent"
                  />
                ) : item.image ? (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover saturate-[0.85] transition group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#060606] to-transparent p-4">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100/60">{item.category}</p>
                  <h3 className="mt-1 text-sm font-black uppercase tracking-[-0.03em] text-white">{item.title}</h3>
                </div>
                {item.type === 'video' && (
                  <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-orange-100 backdrop-blur">
                    Video
                  </span>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-sm text-stone-500">No media in this category yet.</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}