'use client';

import Image from 'next/image';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge } from '@/components/shared';
import { GEAR } from '@/lib/catalog-data';

const slotMap: Record<string, string> = {
  helmet: 'Helmet',
  'armor-vest': 'Body Armor',
  outerwear: 'Jacket',
  backpack: 'Backpack',
  gloves: 'Gloves',
  boots: 'Boots',
  'medical-pouch': 'Medical',
  flashlight: 'Flashlight',
  radio: 'Radio',
  respirator: 'Gas Mask',
  goggles: 'Night Vision',
  'armor-insert': 'Armor Inserts',
  'ammunition-carrier': 'Ammo Carrier',
  'carry-harness': 'Harness',
  'hydration': 'Hydration',
  'knee-guards': 'Knee Guards',
  'map-case': 'Map Case',
  scanner: 'Scanner',
  'survival-kit': 'Survival Kit',
  'utility-belt': 'Utility Belt',
};

const slotOrder = [
  'helmet', 'armor-vest', 'outerwear', 'backpack',
  'gloves', 'boots', 'medical-pouch', 'flashlight',
  'radio', 'respirator', 'goggles', 'armor-insert',
  'ammunition-carrier', 'carry-harness', 'hydration',
  'knee-guards', 'map-case', 'scanner', 'survival-kit', 'utility-belt',
];

const slotIcons: Record<string, string> = {
  helmet: 'H', 'armor-vest': 'A', outerwear: 'J', backpack: 'B',
  gloves: 'G', boots: 'F', 'medical-pouch': 'M', flashlight: 'L',
  radio: 'R', respirator: 'G', goggles: 'N', 'armor-insert': 'I',
  'ammunition-carrier': 'A', 'carry-harness': 'H', hydration: 'D',
  'knee-guards': 'K', 'map-case': 'C', scanner: 'S', 'survival-kit': 'K', 'utility-belt': 'U',
};

const gearThumbnails: Record<string, string> = {
  'gear.sentinel-helmet': '/assets/gear/tactical-helmet.png',
  'gear.relay-radio': '/assets/gear/field-radio.png',
};

export default function GearPage() {
  const [selectedItem, setSelectedItem] = useState<typeof GEAR[0] | null>(null);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Loadout"
        title="Gear & Equipment"
        description="Every slot matters. Protection, utility, mobility, and capacity. Click an item to see details."
        image="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
        imageAlt="Survivor 001 model"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Loadout interface — game inventory style */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px] lg:gap-4">
            {/* Left: Equipment slots */}
            <div className="space-y-2">
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Equipment</p>
              {slotOrder.slice(0, 10).map((slotKey) => {
                const item = GEAR.find((g) => g.subCategory === slotKey);
                return (
                  <button
                    key={slotKey}
                    onClick={() => item && setSelectedItem(item)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selectedItem?.subCategory === slotKey
                        ? 'border-orange-200/30 bg-orange-100/10'
                        : 'border-white/10 bg-[#0a0a09] hover:border-white/20'
                    }`}
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                      {item && gearThumbnails[item.id] ? (
                        <Image src={gearThumbnails[item.id]} alt={item.name} fill sizes="32px" className="object-contain p-0.5" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-black text-orange-100/60">
                          {slotIcons[slotKey] ?? '?'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{slotMap[slotKey] ?? slotKey}</p>
                      {item && <p className="mt-0.5 truncate text-xs font-bold text-white">{item.name}</p>}
                    </div>
                    {item && <StatusBadge status={item.status as any} />}
                  </button>
                );
              })}
            </div>

            {/* Center: Character model with equipment visualization */}
            <div className="relative flex flex-col items-center">
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Survivor</p>
              <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-stone-900 to-black">
                <Image
                  src="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
                  alt="Survivor 001 full body model"
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover object-top saturate-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/40 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                  Survivor 001
                </span>
                {/* Equipment slot indicators around character */}
                <div className="absolute left-2 top-1/4 flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/20 bg-black/60 text-xs font-black text-orange-100/60 backdrop-blur">H</div>
                <div className="absolute left-2 top-1/3 flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/20 bg-black/60 text-xs font-black text-orange-100/60 backdrop-blur">A</div>
                <div className="absolute left-2 top-1/2 flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/20 bg-black/60 text-xs font-black text-orange-100/60 backdrop-blur">B</div>
                <div className="absolute right-2 top-1/4 flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/20 bg-black/60 text-xs font-black text-orange-100/60 backdrop-blur">G</div>
                <div className="absolute right-2 top-1/2 flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/20 bg-black/60 text-xs font-black text-orange-100/60 backdrop-blur">F</div>
                <div className="absolute right-2 bottom-1/4 flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200/20 bg-black/60 text-xs font-black text-orange-100/60 backdrop-blur">M</div>
              </div>
              {/* Stats summary */}
              <div className="mt-4 grid w-full max-w-sm grid-cols-4 gap-2">
                {(['protection', 'utility', 'mobility', 'capacity'] as const).map((stat) => (
                  <div key={stat} className="rounded-lg border border-white/10 bg-[#0a0a09] p-2 text-center">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-stone-500">{stat.slice(0, 4)}</p>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${65}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Utility slots */}
            <div className="space-y-2">
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Utility</p>
              {slotOrder.slice(10).map((slotKey) => {
                const item = GEAR.find((g) => g.subCategory === slotKey);
                return (
                  <button
                    key={slotKey}
                    onClick={() => item && setSelectedItem(item)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selectedItem?.subCategory === slotKey
                        ? 'border-orange-200/30 bg-orange-100/10'
                        : 'border-white/10 bg-[#0a0a09] hover:border-white/20'
                    }`}
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                      {item && gearThumbnails[item.id] ? (
                        <Image src={gearThumbnails[item.id]} alt={item.name} fill sizes="32px" className="object-contain p-0.5" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-black text-orange-100/60">
                          {slotIcons[slotKey] ?? '?'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{slotMap[slotKey] ?? slotKey}</p>
                      {item && <p className="mt-0.5 truncate text-xs font-bold text-white">{item.name}</p>}
                    </div>
                    {item && <StatusBadge status={item.status as any} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item detail panel */}
          {selectedItem && (
            <div className="mt-8 rounded-2xl border border-orange-200/15 bg-[#0a0a09] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{slotMap[selectedItem.subCategory] ?? selectedItem.subCategory}</p>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">{selectedItem.name}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-stone-400">{selectedItem.description}</p>
                </div>
                <StatusBadge status={selectedItem.status as any} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {['protection', 'utility', 'mobility', 'capacity'].map((stat) => (
                  <div key={stat} className="rounded-xl border border-white/10 bg-black/30 p-3">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-stone-500">{stat}</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: `${70}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full gear grid */}
          <div className="mt-12">
            <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">All Gear ({GEAR.length} items)</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GEAR.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group rounded-xl border border-white/10 bg-[#0a0a09] p-4 text-left transition hover:border-orange-200/15"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-lg font-black text-orange-100/50">
                      {slotIcons[item.subCategory] ?? '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{slotMap[item.subCategory] ?? item.subCategory}</p>
                      <p className="mt-0.5 truncate text-xs font-bold text-white">{item.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}