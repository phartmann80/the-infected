import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://theinfected.app';
const description = 'The Infected is a cinematic 3D zombie-survival Android game set in a city that remembers what happened.';
const socialImage = '/assets/branding/og-image-approved-v2.jpg';
const twitterImage = '/assets/branding/twitter-card-approved-v2.jpg';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'The Infected',
      description,
    },
    {
      '@type': 'VideoGame',
      '@id': `${siteUrl}/#game`,
      url: siteUrl,
      name: 'The Infected',
      description,
      applicationCategory: 'Game',
      gamePlatform: 'Android',
      genre: ['Survival', 'Horror'],
      inLanguage: 'en',
      image: `${siteUrl}${socialImage}`,
      isPartOf: { '@id': `${siteUrl}/#website` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'The Infected',
  category: 'game',
  creator: 'The Infected',
  publisher: 'The Infected',
  keywords: ['The Infected', 'survival game', 'zombie survival', 'Android game'],
  title: {
    default: 'The Infected | Coming Soon',
    template: '%s | The Infected',
  },
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'The Infected',
    title: 'The Infected | Coming Soon',
    description,
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'The Infected' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Infected | Coming Soon',
    description,
    images: [twitterImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/branding/favicon-approved-v2.png',
    apple: '/assets/branding/apple-touch-icon-approved-v2.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#030405',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script id="game-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}