import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'The Infected | Coming Soon', description: 'A cinematic 3D zombie-survival Android game. Landing page foundation in production.', metadataBase: new URL('https://theinfected.app') };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
