import type { MetadataRoute } from 'next';
import { GUIDES, INGREDIENTS } from '@/lib/data';
import { absoluteUrl, LAST_UPDATED, STATIC_PATHS } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const dyn = [...INGREDIENTS.map((i) => `/ingredients/${i.slug}/`), ...GUIDES.map((g) => `/guides/${g.slug}/`)];
  return [...STATIC_PATHS, ...dyn].map((path) => ({
    url: absoluteUrl(path),
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : dyn.includes(path) ? 0.6 : 0.8,
  }));
}
