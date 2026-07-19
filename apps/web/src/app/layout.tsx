import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://theinfected.app';
const description = 'The Infected is a cinematic 3D zombie-survival Android game set in a city that remembers what happened.';
const socialImage = '/assets/cinematic/temporary-cinematic-poster-noncanonical.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'The Infected',
  category: 'games',
  keywords: ['The Infected', 'cinematic survival game', 'Android game'],
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
    images: [{ url: socialImage, width: 1280, height: 720, alt: 'The Infected ruined city cinematic scene' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Infected | Coming Soon',
    description,
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/branding/the-infected-logo.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#030405',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
