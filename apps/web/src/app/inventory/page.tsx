'use client';

import Image from 'next/image';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge } from '@/components/shared';
import { WEAPONS, GEAR } from '@/lib/catalog-data';

const inventoryItems = [
  { id: 'medkit', name: 'Medkit', qty: 3, type: 'medical', icon: 'M' },
  { id: 'ammo-pistol', name: '9mm Ammo', qty: 24, type: 'ammo', icon: 'A' },
  { id: 'ammo-shotgun', name: '12-gauge', qty: 6, type: 'ammo', icon: 'A' },
  { id: 'water', name: 'Water Bottle', qty: 2, type: 'consumable', icon: 'W' },
  { id: 'bandage', name: 'Bandage', qty: 5, type: 'medical', icon: 'B' },
  { id: 'scrap', name: 'Scrap Metal', qty: 12, type: 'material', icon: 'S' },
  { id: 'cloth', name: 'Cloth', qty: 8, type: 'material', icon: 'C' },
  { id: 'battery', name: 'Battery', qty: 4, type: 'material', icon: 'E' },
  { id: 'key', name: 'Rusted Key', qty: 1, type: 'key', icon: 'K' },
  { id: 'radio-part', name: 'Radio Part', qty: 1, type: 'quest', icon: 'R' },
  { id: 'can-food', name: 'Canned Food', qty: 3, type: 'consumable', icon: 'F' },
  { id: 'empty', name: '', qty: 0, type: 'empty', icon: '' },
];

const typeColors: Record<string, string> = {
  medical: 'border-red-200/20 bg-red-100/10 text-red-100',
  ammo: 'border-orange-200/20 bg-orange-100/10 text-orange-100',
  consumable: 'border-green-200/20 bg-green-100/10 text-green-100',
  material: 'border-stone-200/20 bg-stone-100/10 text-stone-100',
  key: 'border-amber-200/20 bg-amber-100/10 text-amber-100',
  quest: 'border-purple-200/20 bg-purple-100/10 text-purple-100',
  empty: 'border-white/5 bg-white/[0.02] text-stone-700',
};

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<typeof inventoryItems[0] | null>(null);
  const equippedWeapon = WEAPONS[1]; // Warden-9 pistol
  const equippedGear = GEAR.slice(0, 4);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Inventory"
        title="Loadout"
        description="Grid inventory, equipment slots, and survivor status. This is an interactive web demo synced with the real catalog data."
        image="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
        imageAlt="Survivor inventory"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px] lg:gap-4">
            {/* Left: Survivor + stats */}
            <div className="space-y-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Survivor Status</p>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
                <Image
                  src="/assets/cinematic/survivor-001-production-candidate-internal-review.jpg"
                  alt="Survivor preview"
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover object-top saturate-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/60 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur">
                  Survivor 001
                </div>
              </div>
              {/* Health & status bars */}
              <div className="space-y-3 rounded-xl border border-white/10 bg-[#0a0a09] p-4">
                <div>
                  <div className="flex justify-between text-[0.58rem] font-bold uppercase tracking-[0.14em]">
                    <span className="text-stone-500">Health</span>
                    <span className="text-red-100">85/100</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[0.58rem] font-bold uppercase tracking-[0.14em]">
                    <span className="text-stone-500">Stamina</span>
                    <span className="text-blue-100">70/100</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '70%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[0.58rem] font-bold uppercase tracking-[0.14em]">
                    <span className="text-stone-500">Backpack</span>
                    <span className="text-orange-100">12/20</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Inventory grid — game-style */}
            <div>
              <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Backpack Grid</p>
              <div className="grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-[#0a0a09] p-4 sm:grid-cols-6">
                {inventoryItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => item.type !== 'empty' && setSelectedItem(item)}
                    className={`group relative aspect-square rounded-lg border p-2 transition hover:scale-105 ${
                      selectedItem?.id === item.id
                        ? 'border-orange-200/40 bg-orange-100/10'
                        : typeColors[item.type]
                    }`}
                  >
                    {item.icon && (
                      <span className="text-lg font-black">{item.icon}</span>
                    )}
                    {item.qty > 0 && (
                      <span className="absolute bottom-1 right-1 text-[0.58rem] font-bold text-stone-300">
                        {item.qty}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Item detail panel */}
              {selectedItem && (
                <div className="mt-4 rounded-xl border border-orange-200/15 bg-[#0a0a09] p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg border text-xl font-black ${typeColors[selectedItem.type]}`}>
                      {selectedItem.icon}
                    </div>
                    <div>
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{selectedItem.type}</p>
                      <h3 className="text-sm font-bold text-white">{selectedItem.name}</h3>
                      <p className="text-xs text-stone-500">Quantity: {selectedItem.qty}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-lg border border-green-200/20 bg-green-100/10 px-4 py-2 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-green-100 transition hover:bg-green-100/20">Use</button>
                    <button className="rounded-lg border border-blue-200/20 bg-blue-100/10 px-4 py-2 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-blue-100 transition hover:bg-blue-100/20">Equip</button>
                    <button className="rounded-lg border border-red-200/20 bg-red-100/10 px-4 py-2 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-red-100 transition hover:bg-red-100/20">Discard</button>
                  </div>
                </div>
              )}

              {/* Save/Load state */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg border border-white/10 bg-[#0a0a09] px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-300 transition hover:border-orange-200/20 hover:text-white">Save State</button>
                <button className="flex-1 rounded-lg border border-white/10 bg-[#0a0a09] px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-stone-300 transition hover:border-orange-200/20 hover:text-white">Load State</button>
              </div>
            </div>

            {/* Right: Equipment slots */}
            <div className="space-y-3">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">Equipped</p>
              {/* Weapon slot */}
              <div className="rounded-xl border border-white/10 bg-[#0a0a09] p-3">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">Weapon</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200/20 bg-orange-100/5 text-lg font-black text-orange-100/60">
                    W
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{equippedWeapon.name}</p>
                    <div className="mt-1 flex gap-2 text-[0.58rem]">
                      <span className="text-stone-500">DMG: <span className="text-orange-100">{equippedWeapon.stats.damage}</span></span>
                      <span className="text-stone-500">MAG: <span className="text-orange-100">{equippedWeapon.stats.magazineCapacity}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Gear slots */}
              {equippedGear.map((gear) => (
                <div key={gear.id} className="rounded-xl border border-white/10 bg-[#0a0a09] p-3">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-stone-500">{gear.subCategory}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-lg font-black text-orange-100/50">
                      {gear.subCategory.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{gear.name}</p>
                      <StatusBadge status={gear.status as any} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}