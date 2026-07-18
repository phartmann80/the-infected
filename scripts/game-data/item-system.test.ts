import { describe, expect, it } from 'vitest';
import {
  audioCueCatalog,
  getItemDefinition,
  getShopOffer,
  itemCatalog,
  shopCatalog,
} from '../../packages/game-data/src/index';

describe('item-system foundation', () => {
  it('keeps the approved milestone scope exact', () => {
    expect(itemCatalog.items).toHaveLength(30);
    expect(itemCatalog.items.filter((item) => item.category === 'weapon')).toHaveLength(10);
    expect(itemCatalog.items.filter((item) => item.category === 'gear')).toHaveLength(20);
  });

  it('resolves the Raven-12 definition and its disabled offer', () => {
    const item = getItemDefinition('weapon.raven12');
    expect(item?.name).toBe('Raven-12 Tactical Shotgun');
    expect(item?.status).toBe('prototype');
    expect(item?.canonical).toBe(false);

    const offer = getShopOffer(item?.shopOfferId ?? '');
    expect(offer?.itemId).toBe(item?.id);
    expect(offer?.status).toBe('not_for_sale');
    expect(offer?.price.unitAmountMinor).toBeNull();
  });

  it('keeps ownership and purchase state out of static item definitions', () => {
    for (const item of itemCatalog.items) {
      expect(item).not.toHaveProperty('ownershipStatus');
      expect(item).not.toHaveProperty('unlockStatus');
      expect(item).not.toHaveProperty('purchaseState');
      expect(item).not.toHaveProperty('owned');
    }
  });

  it('keeps provider identifiers and live prices out of repository offers', () => {
    expect(shopCatalog.provider).toBe('unassigned');
    for (const offer of shopCatalog.offers) {
      expect(offer.status).toBe('not_for_sale');
      expect(offer.price.status).toBe('pending_review');
      expect(offer.price.unitAmountMinor).toBeNull();
      expect(JSON.stringify(offer).toLowerCase()).not.toContain('stripe');
      expect(JSON.stringify(offer).toLowerCase()).not.toContain('price_');
    }
  });

  it('resolves every item audio reference to a placeholder cue', () => {
    const cues = new Map(audioCueCatalog.cues.map((cue) => [cue.id, cue]));
    for (const item of itemCatalog.items) {
      const cueIds = Object.values(item.audio).filter((value): value is string => typeof value === 'string');
      for (const cueId of cueIds) {
        expect(cues.get(cueId)?.status).toBe('placeholder');
        expect(cues.get(cueId)?.assetRegistryId).toBeNull();
      }
    }
  });
});
