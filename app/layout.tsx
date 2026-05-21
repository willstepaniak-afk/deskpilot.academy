import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { JsonLd } from '@/components/seo/JsonLd';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { SITE } from '@/lib/site';
import { LOCKED_META_DESCRIPTION, LOCKED_OG_DESCRIPTION } from '@/lib/copy';
import {
  buildEducationalOrganizationLd,
  buildOrganizationLd,
  buildPersonLd,
  buildWebsiteLd,
} from '@/lib/seo';
import { getAllFaculty } from '@/lib/faculty';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Operator-Built Automotive Sales Training`,
    template: `%s · ${SITE.name}`,
  },
  description: LOCKED_META_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.founderName, url: SITE.founderUrl }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Operator-Built Automotive Sales Training`,
    description: LOCKED_OG_DESCRIPTION,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Operator-Built Automotive Sales Training`,
    description: LOCKED_OG_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  alternates: { canonical: SITE.url },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0f0f1a',
  width: 'device-width',
  initialScale: 1,
};

// Root layout owns the html/body shell, providers, sitewide JSON-LD, and
// analytics ONLY. Marketing chrome (Header/Footer) lives in (marketing)/layout;
// the dashboard and auth route groups render their own shells.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const faculty = await getAllFaculty();
  const will = faculty.find((m) => m.id === 'will-stepaniak');

  const sitewideJsonLd = [
    buildOrganizationLd(),
    buildEducationalOrganizationLd(faculty),
    buildWebsiteLd(),
    ...(will ? [buildPersonLd(will)] : []),
  ];

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen font-sans">
        <PostHogProvider>{children}</PostHogProvider>
        <JsonLd data={sitewideJsonLd} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
