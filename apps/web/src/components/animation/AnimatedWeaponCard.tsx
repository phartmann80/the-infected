'use client';

import { useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';

type Weapon = {
  id: string;
  name: string;
  subCategory: string;
  purpose: string;
  stats: {
    damage: number;
    fireRateRpm: number;
    rangeMeters: number;
    magazineCapacity: number;
  };
  ammo: { type: string };
  reload: { behavior: string; durationSeconds: number };
};

type AnimatedWeaponCardProps = {
  weapon: Weapon;
  index: number;
};

export function AnimatedWeaponCard({ weapon, index }: AnimatedWeaponCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09] p-5 transition hover:border-orange-200/20 sm:p-6"
      style={{
        transform: reduceMotion ? undefined : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      <div aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-500/6 blur-2xl transition group-hover:bg-orange-500/15" />
      {/* Muzzle flash indicator */}
      {!reduceMotion && (
        <div className="anim-muzzle-flash pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-full bg-orange-500/30 blur-xl" style={{ animationDelay: `${index * 0.7}s` }} aria-hidden />
      )}
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{weapon.subCategory}</p>
            <h3 className="mt-2 text-lg font-black uppercase leading-tight tracking-[-0.04em] text-white">{weapon.name}</h3>
          </div>
          <span className="inline-flex shrink-0 rounded-full border border-orange-200/20 bg-orange-100/5 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-orange-100/80">prototype</span>
        </div>
        <p className="mt-4 text-xs leading-5 text-stone-400">{weapon.purpose}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.62rem]">
          <StatBar label="Damage" value={weapon.stats.damage} max={100} color="bg-orange-400" delay={index * 0.1} reduceMotion={reduceMotion} />
          <StatBar label="Fire Rate" value={weapon.stats.fireRateRpm} max={900} unit=" rpm" color="bg-orange-300" delay={index * 0.1 + 0.1} reduceMotion={reduceMotion} />
          <StatBar label="Range" value={weapon.stats.rangeMeters} max={100} unit="m" color="bg-orange-400" delay={index * 0.1 + 0.2} reduceMotion={reduceMotion} />
          <StatBar label="Magazine" value={weapon.stats.magazineCapacity} max={30} unit=" rds" color="bg-orange-300" delay={index * 0.1 + 0.3} reduceMotion={reduceMotion} />
          <div><dt className="font-bold uppercase tracking-[0.18em] text-stone-500">Ammo</dt><dd className="mt-1 text-sm font-bold text-stone-200">{weapon.ammo.type}</dd></div>
          <div><dt className="font-bold uppercase tracking-[0.18em] text-stone-500">Reload</dt><dd className="mt-1 text-sm font-bold text-stone-200">{weapon.reload.behavior} ({weapon.reload.durationSeconds}s)</dd></div>
        </dl>
      </div>
    </div>
  );
}

function StatBar({ label, value, max, unit, color, delay, reduceMotion }: { label: string; value: number; max: number; unit?: string; color: string; delay: number; reduceMotion: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div ref={ref}>
      <dt className="font-bold uppercase tracking-[0.18em] text-stone-500">{label}</dt>
      <dd className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold text-orange-100">{value}{unit}</span>
      </dd>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: reduceMotion ? `${pct}%` : inView ? `${pct}%` : '0%',
            transition: reduceMotion ? undefined : 'width 0.8s ease-out {delay}s',
          }}
        />
      </div>
    </div>
  );
}