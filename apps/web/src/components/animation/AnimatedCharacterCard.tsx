'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import type { RegistryEntry } from './types';

type AnimatedCharacterCardProps = {
  entry: RegistryEntry;
  variant: 'survivor' | 'infected-001' | 'infected-002';
};

export function AnimatedCharacterCard({ entry, variant }: AnimatedCharacterCardProps) {
  const reduceMotion = useReducedMotion();

  const animClass = reduceMotion
    ? ''
    : variant === 'survivor'
      ? 'anim-survivor-breathing'
      : variant === 'infected-001'
        ? 'anim-infected-sway'
        : 'anim-heavy-breathing';

  const innerAnim = reduceMotion
    ? ''
    : variant === 'survivor'
      ? 'anim-weapon-grip'
      : variant === 'infected-001'
        ? 'anim-head-twitch'
        : 'anim-threatening-turn';

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c0d] p-6 shadow-[0_24px_100px_rgba(0,0,0,.2)] sm:p-8">
      <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl transition duration-700 group-hover:bg-orange-500/20" />
      <div className="relative flex min-h-72 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-stone-400">{entry.code}</p>
            <span className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] ${entry.status === 'internal-review' ? 'border-orange-200/30 bg-orange-100/10 text-orange-100' : 'border-white/10 bg-white/5 text-stone-300'}`}>
              {entry.status}
            </span>
          </div>
          {entry.image && (
            <div className="relative mt-6 aspect-[5/8] overflow-hidden rounded-[1.5rem] border border-orange-200/15 bg-black/30">
              <div className={`absolute inset-0 ${animClass}`} style={{ transformOrigin: 'center' }}>
                <Image
                  src={entry.image}
                  alt={entry.imageAlt ?? ''}
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  loading="lazy"
                  className="object-cover object-center saturate-[0.82]"
                />
              </div>
              {/* Character-specific motion overlays */}
              {variant === 'infected-001' && !reduceMotion && (
                <div className="anim-jaw-move absolute inset-0" aria-hidden />
              )}
              {variant === 'infected-002' && !reduceMotion && (
                <div className="anim-heavy-breathing absolute inset-0" aria-hidden style={{ transformOrigin: 'center top' }} />
              )}
              {/* Smoke overlay on character cards */}
              {!reduceMotion && (
                <div className="anim-smoke pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" aria-hidden />
              )}
              {/* Ember particles */}
              {!reduceMotion && (
                <>
                  <span className="anim-ember absolute bottom-2 left-1/4 h-1 w-1 rounded-full bg-orange-400/50" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} aria-hidden />
                  <span className="anim-ember absolute bottom-2 right-1/3 h-1 w-1 rounded-full bg-orange-400/40" style={{ animationDelay: '1.5s', animationDuration: '4s' }} aria-hidden />
                </>
              )}
              <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                {variant === 'survivor' ? 'Idle animation' : 'Threat idle'}
              </span>
            </div>
          )}
          <p className="mt-16 text-xs uppercase tracking-[0.28em] text-orange-100/60">{entry.label}</p>
          <h3 className="mt-4 max-w-md text-3xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-white">{entry.title}</h3>
          <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400">{entry.description}</p>
        </div>
        <div className="mt-10 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone-400">
          <span className="h-px flex-1 bg-white/10" aria-hidden />
          Registry governed
        </div>
      </div>
    </article>
  );
}