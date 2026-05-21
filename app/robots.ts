import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/thank-you', '/blog/', '/dashboard', '/login', '/signup', '/auth/'];

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
      { userAgent: '*', allow: '/', disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
