import { describe, expect, it } from 'vitest';
import { gameDirectionCards, gameFoundationMetadata, landingChapters } from './index';

describe('game foundation content boundary', () => {
  it('keeps the shared content explicitly non-canonical', () => {
    expect(gameFoundationMetadata.canonicalContentApproved).toBe(false);
    expect(landingChapters).toHaveLength(5);
    expect(gameDirectionCards).toHaveLength(4);
  });

  it('provides stable anchors for the web and future runtime consumers', () => {
    expect(landingChapters.map((chapter) => chapter.id)).toEqual([
      'outbreak',
      'survivors',
      'infected',
      'arsenal',
      'mission',
    ]);
    expect(gameDirectionCards.map((card) => card.id)).toEqual(['world', 'threat', 'mission', 'production']);
  });
});
