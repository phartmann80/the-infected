import Image from 'next/image';
import Link from 'next/link';

const exploreLinks = [
  { href: '/story', label: 'Story' },
  { href: '/infected', label: 'Infected' },
  { href: '/survivors', label: 'Survivors' },
  { href: '/weapons', label: 'Weapons' },
  { href: '/gear', label: 'Gear' },
  { href: '/combat', label: 'Combat' },
] as const;

const worldLinks = [
  { href: '/levels', label: 'Levels' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/progression', label: 'Progression' },
  { href: '/media', label: 'Media' },
  { href: '/android', label: 'Android' },
] as const;

const projectLinks = [
  { href: '/early-access', label: 'Early Access' },
  { href: '/contact', label: 'Contact' },
] as const;

const legalLinks = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/cookies', label: 'Cookies' },
] as const;

const footerLinkClass =
  'w-fit rounded-md py-1 text-sm text-stone-300 transition hover:text-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080807]';

export function ProductionFooter() {
  return (
    <footer id="site-footer" aria-labelledby="footer-heading" className="relative scroll-mt-28 overflow-hidden border-t border-white/10 bg-[#080807] px-5 py-14 sm:scroll-mt-20 sm:px-8 sm:py-20 lg:px-12">
      <div aria-hidden className="absolute -left-44 bottom-0 h-96 w-96 rounded-full border border-orange-200/10" />
      <div aria-hidden className="absolute -left-28 bottom-16 h-72 w-72 rounded-full border border-orange-200/10" />
      <div aria-hidden className="absolute right-[-12rem] top-[-14rem] h-[34rem] w-[34rem] rounded-full bg-orange-950/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 border-b border-white/10 pb-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(32rem,0.85fr)] lg:gap-20 lg:pb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/branding/the-infected-logo-approved-v2.png"
                alt="The Infected logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg"
                priority={false}
              />
              <div>
                <p className="text-lg font-black uppercase tracking-[-0.04em] text-white">The Infected</p>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/55">Survival Horror</p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-7 text-stone-400">
              A cinematic 3D zombie-survival Android game set in a city that remembers what happened. Built with Godot 4.7.1. Android-first, offline, no ads.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <nav aria-label="Explore">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-500">Explore</p>
              <ul className="mt-4 space-y-2">
                {exploreLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className={footerLinkClass}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="World">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-500">World</p>
              <ul className="mt-4 space-y-2">
                {worldLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className={footerLinkClass}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Project">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-500">Project</p>
              <ul className="mt-4 space-y-2">
                {projectLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className={footerLinkClass}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Legal">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-stone-500">Legal</p>
              <ul className="mt-4 space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className={footerLinkClass}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">The Infected is in development. All content is subject to change.</p>
          <p className="text-xs text-stone-500">Built with Godot 4.7.1 and Next.js.</p>
        </div>
      </div>
    </footer>
  );
}