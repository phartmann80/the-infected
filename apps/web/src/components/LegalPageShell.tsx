import Link from 'next/link';
import type { ReactNode } from 'react';

type LegalPage = 'privacy' | 'terms' | 'cookies' | 'contact';

const pageLinks: Array<{ href: string; label: string; page: LegalPage }> = [
  { href: '/legal/privacy', label: 'Privacy', page: 'privacy' },
  { href: '/legal/terms', label: 'Terms', page: 'terms' },
  { href: '/legal/cookies', label: 'Cookies', page: 'cookies' },
  { href: '/contact', label: 'Contact', page: 'contact' },
];

type LegalPageShellProps = {
  activePage: LegalPage;
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function LegalPageShell({ activePage, eyebrow, title, summary, children }: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-[#060606] text-stone-200">
      <a
        href="#legal-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-orange-500 focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:text-black focus:outline-none focus:ring-2 focus:ring-orange-100"
      >
        Skip to page content
      </a>

      <header className="border-b border-white/10 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="w-fit rounded-full px-2 py-1 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:text-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200">
            The Infected
          </Link>
          <nav aria-label="Legal and project pages" className="flex flex-wrap gap-x-5 gap-y-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stone-500">
            {pageLinks.map((link) => (
              <Link
                key={link.page}
                href={link.href}
                aria-current={activePage === link.page ? 'page' : undefined}
                className={`rounded-full px-2 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 ${activePage === link.page ? 'bg-orange-200/10 text-orange-100' : 'hover:text-orange-200'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div aria-hidden className="absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-orange-950/20 blur-3xl" />
        <article id="legal-content" className="relative mx-auto max-w-3xl" aria-labelledby="legal-page-title" aria-describedby="legal-page-summary">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/20 bg-orange-100/[0.04] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-orange-100/75">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-300" aria-hidden />
            Prototype review surface
          </div>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.42em] text-orange-100/60">{eyebrow}</p>
          <h1 id="legal-page-title" className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl">{title}</h1>
          <p id="legal-page-summary" className="mt-7 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">{summary}</p>
          <div className="mt-14 space-y-10 border-t border-white/10 pt-10 text-base leading-8 text-stone-400 sm:text-lg">
            {children}
          </div>
        </article>
      </div>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs uppercase tracking-[0.16em] text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Draft copy — review required before public launch.</p>
          <Link href="/" className="w-fit rounded-full text-orange-100/75 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200">Return to the signal</Link>
        </div>
      </footer>
    </main>
  );
}
