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
          {/* Loadout interface */}
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr_1fr] lg:gap-6">
            {/* Left: Equipment slots */}
            <div className="space-y-2">
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Equipment Slots</p>
              {slotOrder.slice(0, 10).map((slotKey) => {
                const item = GEAR.find((g) => g.subCategory === slotKey);
                return (
                  <button
                    key={slotKey}
                    onClick={() => item && setSelectedItem(item)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      selectedItem?.subCategory === slotKey
                        ? 'border-orange-200/30 bg-orange-100/10'
                        : 'border-white/10 bg-[#0a0a09] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{slotMap[slotKey] ?? slotKey}</p>
                      {item && <p className="mt-1 text-xs font-bold text-white">{item.name}</p>}
                    </div>
                    {item && <StatusBadge status={item.status as any} />}
                  </button>
                );
              })}
            </div>

            {/* Center: Character model */}
            <div className="relative flex flex-col items-center">
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Survivor</p>
              <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-stone-900 to-black">
                <Image
                  src="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
                  alt="Survivor 001 full body model"
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover object-center saturate-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/40 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                  Survivor 001
                </span>
              </div>
              {/* Stats summary */}
              <div className="mt-4 grid w-full max-w-sm grid-cols-4 gap-2">
                {(['protection', 'utility', 'mobility', 'capacity'] as const).map((stat) => (
                  <div key={stat} className="rounded-lg border border-white/10 bg-[#0a0a09] p-2 text-center">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-stone-500">{stat.slice(0, 3)}</p>
                    <p className="mt-1 text-sm font-black text-orange-100">--</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: More slots + detail */}
            <div className="space-y-2">
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Utility Slots</p>
              {slotOrder.slice(10).map((slotKey) => {
                const item = GEAR.find((g) => g.subCategory === slotKey);
                return (
                  <button
                    key={slotKey}
                    onClick={() => item && setSelectedItem(item)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      selectedItem?.subCategory === slotKey
                        ? 'border-orange-200/30 bg-orange-100/10'
                        : 'border-white/10 bg-[#0a0a09] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{slotMap[slotKey] ?? slotKey}</p>
                      {item && <p className="mt-1 text-xs font-bold text-white">{item.name}</p>}
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
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{selectedItem.subCategory}</p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white">{selectedItem.name}</h2>
                </div>
                <StatusBadge status={selectedItem.status as any} />
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">{selectedItem.purpose}</p>
              <p className="mt-3 text-xs leading-5 text-stone-500">{selectedItem.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <dt className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">Protection</dt>
                  <dd className="mt-1 text-lg font-black text-orange-100">{selectedItem.stats.protection}</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <dt className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">Utility</dt>
                  <dd className="mt-1 text-lg font-black text-orange-100">{selectedItem.stats.utility}</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <dt className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">Mobility</dt>
                  <dd className="mt-1 text-lg font-black text-orange-100">{selectedItem.stats.mobility}</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <dt className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">Capacity</dt>
                  <dd className="mt-1 text-lg font-black text-orange-100">{selectedItem.stats.capacity}</dd>
                </div>
              </dl>
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
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-orange-100/55">{item.subCategory}</p>
                  <h3 className="mt-2 text-sm font-black uppercase leading-tight tracking-[-0.04em] text-white">{item.name}</h3>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[0.58rem] font-bold text-stone-500">P:{item.stats.protection}</span>
                    <span className="text-[0.58rem] font-bold text-stone-500">U:{item.stats.utility}</span>
                    <span className="text-[0.58rem] font-bold text-stone-500">M:{item.stats.mobility}</span>
                    <span className="text-[0.58rem] font-bold text-stone-500">C:{item.stats.capacity}</span>
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