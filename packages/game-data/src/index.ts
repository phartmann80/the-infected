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

export * from './item-system';
