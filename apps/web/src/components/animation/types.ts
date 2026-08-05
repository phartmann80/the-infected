export type RegistryStatus = 'approved' | 'prototype' | 'placeholder' | 'blocked' | 'internal-review' | 'planned' | 'in-development';

export type RegistryEntry = {
  code: string;
  label: string;
  title: string;
  description: string;
  status: RegistryStatus;
  image?: string;
  imageAlt?: string;
};