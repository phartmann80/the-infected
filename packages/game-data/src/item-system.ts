import audioCueCatalogData from '../data/audio-cues.v1.json';
import itemCatalogData from '../data/item-catalog.v1.json';
import shopCatalogData from '../data/shop-catalog.v1.json';

export const ITEM_SYSTEM_SCHEMA_VERSION = 1 as const;

export type ContentStatus = 'prototype' | 'internal-review' | 'approved' | 'canonical' | 'released';
export type ItemCategory = 'weapon' | 'gear' | 'consumable' | 'cosmetic';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic';
export type AssetReferenceStatus = 'placeholder' | 'internal-review' | 'approved' | 'canonical';
export type OfferStatus = 'not_for_sale' | 'available' | 'suspended' | 'retired';
export type PriceStatus = 'pending_review' | 'active' | 'retired';

export interface ItemAssetReference {
  readonly id: string;
  readonly status: AssetReferenceStatus;
  readonly registryId: string | null;
}

export interface ItemAssetSet {
  readonly previewImage: ItemAssetReference;
  readonly previewModel: ItemAssetReference & { readonly lodPolicy: 'mobile-three-tier' };
  readonly animations: readonly ItemAssetReference[];
}

export interface ItemAudioReferences {
  readonly select: string;
  readonly showcase: string;
  readonly equip: string;
  readonly fire?: string;
  readonly reload?: string;
}

export interface BaseItemDefinition {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly category: ItemCategory;
  readonly subCategory: string;
  readonly description: string;
  readonly purpose: string;
  readonly rarity: ItemRarity;
  readonly requiredLevel: number | null;
  readonly status: 'prototype';
  readonly canonical: false;
  readonly shopOfferId: string;
  readonly tags: readonly string[];
  readonly visualIdentity: string;
  readonly soundIdentity: string;
  readonly assets: ItemAssetSet;
  readonly audio: ItemAudioReferences;
}

export interface WeaponDefinition extends BaseItemDefinition {
  readonly category: 'weapon';
  readonly stats: {
    readonly damage: number;
    readonly fireRateRpm: number;
    readonly rangeMeters: number;
    readonly magazineCapacity: number;
    readonly handling: number;
  };
  readonly ammo: {
    readonly type: string;
    readonly capacity: number;
  };
  readonly reload: {
    readonly behavior: 'magazine' | 'per-round' | 'break-action';
    readonly durationSeconds: number;
  };
  readonly audio: ItemAudioReferences & {
    readonly fire: string;
    readonly reload: string;
  };
}

export interface GearEffect {
  readonly stat: string;
  readonly operation: 'add' | 'multiply';
  readonly value: number;
  readonly unit: 'points' | 'percent' | 'slots' | 'seconds' | 'meters';
}

export interface GearDefinition extends BaseItemDefinition {
  readonly category: 'gear';
  readonly stats: {
    readonly protection: number;
    readonly utility: number;
    readonly mobility: number;
    readonly capacity: number;
  };
  readonly effects: readonly GearEffect[];
}

export type ItemDefinition = WeaponDefinition | GearDefinition;

export interface ItemCatalog {
  readonly schemaVersion: 1;
  readonly contentVersion: string;
  readonly status: 'prototype';
  readonly canonical: false;
  readonly provenance: {
    readonly creator: string;
    readonly model: string;
    readonly reviewStatus: 'prototype';
    readonly notes: string;
  };
  readonly items: readonly ItemDefinition[];
}

export interface ShopOffer {
  readonly id: string;
  readonly itemId: string;
  readonly entitlementId: string;
  readonly status: OfferStatus;
  readonly price: {
    readonly status: PriceStatus;
    readonly currency: 'USD';
    readonly unitAmountMinor: number | null;
  };
  readonly purchaseLimit: number;
}

export interface ShopCatalog {
  readonly schemaVersion: 1;
  readonly catalogVersion: string;
  readonly status: 'prototype';
  readonly provider: 'unassigned';
  readonly offers: readonly ShopOffer[];
}

export interface AudioCueDefinition {
  readonly id: string;
  readonly purpose: string;
  readonly status: 'placeholder';
  readonly assetRegistryId: null;
  readonly playback: {
    readonly bus: 'music' | 'ui' | 'weapons' | 'gear';
    readonly loop: boolean;
    readonly spatial: boolean;
    readonly volumeDb: number;
  };
  readonly soundIdentity: string;
}

export interface AudioCueCatalog {
  readonly schemaVersion: 1;
  readonly contentVersion: string;
  readonly status: 'prototype';
  readonly cues: readonly AudioCueDefinition[];
}

export type OwnershipStatus = 'owned' | 'revoked';
export type UnlockStatus = 'locked' | 'unlocked';
export type PurchaseState = 'not_purchased' | 'pending' | 'purchased' | 'refunded' | 'revoked';
export type EntitlementState = 'pending' | 'active' | 'revoked' | 'refunded';

export interface PlayerOwnedItem {
  readonly itemId: string;
  readonly entitlementId: string | null;
  readonly ownershipStatus: OwnershipStatus;
  readonly unlockStatus: UnlockStatus;
  readonly purchaseState: PurchaseState;
  readonly quantity: number;
  readonly equippedSlot: string | null;
  readonly acquiredAt: string;
}

export interface PlayerInventoryState {
  readonly schemaVersion: 1;
  readonly revision: number;
  readonly items: readonly PlayerOwnedItem[];
}

export interface PurchaseEntitlement {
  readonly id: string;
  readonly playerId: string;
  readonly itemId: string;
  readonly offerId: string;
  readonly state: EntitlementState;
  readonly providerEventReference: string;
  readonly grantedAt: string | null;
  readonly updatedAt: string;
}

export const itemCatalog = itemCatalogData as unknown as ItemCatalog;
export const shopCatalog = shopCatalogData as unknown as ShopCatalog;
export const audioCueCatalog = audioCueCatalogData as unknown as AudioCueCatalog;

export function getItemDefinition(itemId: string) {
  return itemCatalog.items.find((item) => item.id === itemId);
}

export function getShopOffer(offerId: string) {
  return shopCatalog.offers.find((offer) => offer.id === offerId);
}
