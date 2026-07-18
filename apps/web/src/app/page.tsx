import { CinematicHero } from '@/components/CinematicHero';
import { LandingChapters } from '@/components/LandingChapters';

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-orange-500 focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:text-black focus:outline-none focus:ring-2 focus:ring-orange-100"
      >
        Skip to content
      </a>
      <main id="main-content">
        <CinematicHero />
        <LandingChapters />
      </main>
    </>
  );
}
