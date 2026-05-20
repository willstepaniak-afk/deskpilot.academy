import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    'GPTBot',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
    'anthropic-ai',
    'OAI-SearchBot',
    'CCBot',
    'Applebot-Extended',
  ];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you', '/blog/'] },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/thank-you', '/blog/'],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
