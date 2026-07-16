import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://theinfected.app',
      lastModified: '2026-07-15',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://theinfected.app/contact',
      lastModified: '2026-07-16',
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: 'https://theinfected.app/legal/privacy',
      lastModified: '2026-07-16',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://theinfected.app/legal/terms',
      lastModified: '2026-07-16',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://theinfected.app/legal/cookies',
      lastModified: '2026-07-16',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
