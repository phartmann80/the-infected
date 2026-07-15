import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://theinfected.app',
      lastModified: '2026-07-15',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
