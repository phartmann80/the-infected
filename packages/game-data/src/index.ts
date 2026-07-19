export interface GameFoundationMetadata {
  readonly project: 'the-infected';
  readonly contentVersion: string;
  readonly canonicalContentApproved: false;
  readonly note: string;
}

export const gameFoundationMetadata: GameFoundationMetadata = {
  project: 'the-infected',
  contentVersion: '0.1.0-foundation',
  canonicalContentApproved: false,
  note: 'Foundation shell only. Lore, timeline, characters, enemies, weapons, and permanent 3D assets are not approved yet.'
};

export type LandingChapter = {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly signal: string;
  readonly copy: string;
};

/**
 * Directional landing copy shared by the web surface and future runtime
 * integrations. This is intentionally not canonical game lore or content.
 */
export const landingChapters = [
  {
    id: 'outbreak',
    number: '02',
    name: 'The Outbreak',
    signal: 'Trace the collapse',
    copy: 'Follow the evidence left behind: a checkpoint that stopped answering, a broadcast cut short, and a city still lit by emergency power.',
  },
  {
    id: 'survivors',
    number: '03',
    name: 'Survivors',
    signal: 'Keep the light alive',
    copy: 'Introduce a human presence before a biography: a light behind a curtain, a hand on a radio, a choice to keep moving.',
  },
  {
    id: 'infected',
    number: '04',
    name: 'The Infected',
    signal: 'Something moved out there',
    copy: 'Let danger arrive as behavior before it arrives as a name: a distant movement, a wrong silhouette, a sound that does not belong.',
  },
  {
    id: 'arsenal',
    number: '05',
    name: 'Arsenal',
    signal: 'Nothing is disposable',
    copy: 'Every tool should feel practical, scarce, and consequential. The pressure comes first; the equipment reveal follows.',
  },
  {
    id: 'mission',
    number: '06',
    name: 'The Mission',
    signal: 'Follow the signal',
    copy: 'A signal gives the player a direction. The objective is to make the next street matter, then make the next decision harder.',
  },
] as const satisfies readonly LandingChapter[];

export type GameDirectionCard = {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly copy: string;
  readonly status: 'direction' | 'prototype';
};

/**
 * The first game-information surface deliberately describes direction and
 * production gates instead of inventing a final roster, economy, or lore.
 */
export const gameDirectionCards = [
  {
    id: 'world',
    eyebrow: 'World',
    title: 'Every object asks a question.',
    copy: 'Ruined streets, abandoned vehicles, empty checkpoints, emergency light, smoke, and traces of evacuation should make the city feel observed rather than explained.',
    status: 'direction',
  },
  {
    id: 'threat',
    eyebrow: 'Threat',
    title: 'Fear arrives before contact.',
    copy: 'Distant movement, partial silhouettes, sound before sight, broken posture, and unnatural stillness establish the threat language before a final infected design is approved.',
    status: 'direction',
  },
  {
    id: 'mission',
    eyebrow: 'Mission',
    title: 'Follow the next signal.',
    copy: 'The landing experience points toward a survival objective without locking the project into unapproved factions, names, progression systems, or economy values.',
    status: 'prototype',
  },
  {
    id: 'production',
    eyebrow: 'Production',
    title: 'Build the gate before the roster.',
    copy: 'The hero candidate, engine decision, and Android technical prototype remain the next review gates. Temporary media is useful for testing, never canon by accident.',
    status: 'prototype',
  },
] as const satisfies readonly GameDirectionCard[];

export type GameDataExportV1 = {
  readonly schemaVersion: 1;
  readonly format: 'the-infected.game-data';
  readonly project: 'the-infected';
  readonly contentVersion: string;
  readonly canonicalContentApproved: false;
  readonly note: string;
  readonly content: {
    readonly landingChapters: readonly LandingChapter[];
    readonly gameDirectionCards: readonly GameDirectionCard[];
  };
};

/**
 * Builds a deterministic JSON-safe snapshot for non-TypeScript runtimes.
 * Keep timestamps and web-only presentation values out of this contract so
 * drift checks remain stable and Android can consume it without translation.
 */
export function createGameDataExportV1(): GameDataExportV1 {
  return {
    schemaVersion: 1,
    format: 'the-infected.game-data',
    project: gameFoundationMetadata.project,
    contentVersion: gameFoundationMetadata.contentVersion,
    canonicalContentApproved: gameFoundationMetadata.canonicalContentApproved,
    note: gameFoundationMetadata.note,
    content: {
      landingChapters: landingChapters.map((chapter) => ({ ...chapter })),
      gameDirectionCards: gameDirectionCards.map((card) => ({ ...card })),
    },
  };
}
