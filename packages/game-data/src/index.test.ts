import { describe, expect, it } from 'vitest';
import { createGameDataExportV1, gameDirectionCards, gameFoundationMetadata, landingChapters } from './index';

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

  it('creates a deterministic engine-neutral v1 export', () => {
    const runtimeExport = createGameDataExportV1();

    expect(runtimeExport.schemaVersion).toBe(1);
    expect(runtimeExport.format).toBe('the-infected.game-data');
    expect(runtimeExport.canonicalContentApproved).toBe(false);
    expect(runtimeExport.content.landingChapters[0]).toEqual({
      id: 'outbreak',
      number: '02',
      name: 'The Outbreak',
      signal: 'Trace the collapse',
      copy: 'Follow the evidence left behind: a checkpoint that stopped answering, a broadcast cut short, and a city still lit by emergency power.',
    });
    expect(JSON.stringify(runtimeExport)).not.toContain('bg-[');
  });
});
