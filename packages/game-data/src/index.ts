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
  readonly glow: string;
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
    glow: 'bg-[radial-gradient(circle_at_72%_28%,rgba(255,91,37,0.34),transparent_26%),linear-gradient(135deg,#101719,#050606_65%)]',
  },
  {
    id: 'survivors',
    number: '03',
    name: 'Survivors',
    signal: 'Keep the light alive',
    copy: 'Introduce a human presence before a biography: a light behind a curtain, a hand on a radio, a choice to keep moving.',
    glow: 'bg-[radial-gradient(circle_at_30%_60%,rgba(238,171,83,0.28),transparent_24%),linear-gradient(145deg,#17130f,#050606_68%)]',
  },
  {
    id: 'infected',
    number: '04',
    name: 'The Infected',
    signal: 'Something moved out there',
    copy: 'Let danger arrive as behavior before it arrives as a name: a distant movement, a wrong silhouette, a sound that does not belong.',
    glow: 'bg-[radial-gradient(circle_at_68%_66%,rgba(156,45,29,0.42),transparent_25%),linear-gradient(135deg,#130d0d,#050606_66%)]',
  },
  {
    id: 'arsenal',
    number: '05',
    name: 'Arsenal',
    signal: 'Nothing is disposable',
    copy: 'Every tool should feel practical, scarce, and consequential. The pressure comes first; the equipment reveal follows.',
    glow: 'bg-[radial-gradient(circle_at_42%_30%,rgba(87,111,126,0.35),transparent_25%),linear-gradient(145deg,#10171a,#050606_70%)]',
  },
  {
    id: 'mission',
    number: '06',
    name: 'The Mission',
    signal: 'Follow the signal',
    copy: 'A signal gives the player a direction. The objective is to make the next street matter, then make the next decision harder.',
    glow: 'bg-[radial-gradient(circle_at_76%_42%,rgba(221,107,51,0.3),transparent_24%),linear-gradient(135deg,#17110d,#050606_68%)]',
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
