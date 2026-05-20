import type { MetadataRoute } from 'next';
import { getAllCampuses } from '@/lib/campuses';
import { SITE, STATIC_ROUTES } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const campuses = await getAllCampuses();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/pricing' || route === '/for-dealers' ? 0.9 : 0.7,
  }));

  for (const c of campuses) {
    entries.push({
      url: `${SITE.url}/campuses/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: c.status === 'live' ? 0.8 : 0.5,
    });
  }

  return entries;
}
