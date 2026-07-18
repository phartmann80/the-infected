import Image from 'next/image';
import Link from 'next/link';

const exploreLinks = [
  { href: '#story', label: 'Story' },
  { href: '#world', label: 'World' },
  { href: '#survivors', label: 'Survivor' },
  { href: '#infected', label: 'Infected' },
  { href: '#arsenal', label: 'Weapons' },
  { href: '#mission', label: 'Mission' },
] as const;

const projectLinks = [
  { href: '#join', label: 'Early Access' },
  { href: '#review', label: 'Performance gates' },
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
                src="/assets/branding/the-infected-logo.png"
                alt=""
                width={112}
                height={112}
                loading="lazy"
                aria-hidden
                className="h-20 w-20 object-contain drop-shadow-[0_0_34px_rgba(255,74,28,0.35)] sm:h-24 sm:w-24"
              />
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.34em] text-orange-100/70">The Infected</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-400">A survival signal in development</p>
              </div>
            </div>

            <h2 id="footer-heading" className="mt-10 max-w-[11ch] text-4xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-white sm:text-6xl">
              The signal is still out there.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-400 sm:text-lg">
              Follow the route as one environment, one survivor, and one infected become a playable first chapter on Android.
            </p>

            <dl className="mt-9 grid max-w-xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <div className="bg-black/35 p-4">
                <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-stone-400">Development</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-orange-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" aria-hidden />Active
                </dd>
              </div>
              <div className="bg-black/35 p-4">
                <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-stone-400">Platform</dt>
                <dd className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-stone-200">Android</dd>
              </div>
              <div className="bg-black/35 p-4">
                <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-stone-400">Release</dt>
                <dd className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-stone-200">Coming soon</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:pt-5">
            <nav aria-labelledby="footer-explore-heading">
              <h3 id="footer-explore-heading" className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-orange-100/70">Explore</h3>
              <ul className="mt-5 grid gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}><Link className={footerLinkClass} href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-project-heading">
              <h3 id="footer-project-heading" className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-orange-100/70">Project</h3>
              <ul className="mt-5 grid gap-2.5">
                {projectLinks.map((link) => (
                  <li key={link.href}><Link className={footerLinkClass} href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-legal-heading">
              <h3 id="footer-legal-heading" className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-orange-100/70">Legal</h3>
              <ul className="mt-5 grid gap-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}><Link className={footerLinkClass} href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-xs uppercase tracking-[0.16em] text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl leading-6">The Infected is an independent survival game in active development. Features and availability may change before release.</p>
          <Link
            href="#main-content"
            className="inline-flex min-h-11 w-fit shrink-0 items-center rounded-full border border-white/15 px-5 font-bold text-stone-200 transition hover:border-orange-200/40 hover:text-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
          >
            Back to the signal <span className="ml-2" aria-hidden>&uarr;</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
