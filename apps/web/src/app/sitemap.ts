import type { MetadataRoute } from 'next';

const routes = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/story', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/infected', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/survivors', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/weapons', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/gear', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/combat', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/levels', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/inventory', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/progression', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/media', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/android', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/early-access', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/legal/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/legal/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/legal/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://theinfected.app${route.path}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}