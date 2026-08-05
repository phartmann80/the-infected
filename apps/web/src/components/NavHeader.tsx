'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/story', label: 'Story' },
  { href: '/infected', label: 'Infected' },
  { href: '/survivors', label: 'Survivors' },
  { href: '/weapons', label: 'Weapons' },
  { href: '/gear', label: 'Gear' },
  { href: '/combat', label: 'Combat' },
  { href: '/levels', label: 'Levels' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/progression', label: 'Progression' },
  { href: '/media', label: 'Media' },
  { href: '/android', label: 'Android' },
  { href: '/early-access', label: 'Early Access' },
];

export function NavHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation by listening to popstate
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  // Close on link click via onClick handler in the mobile menu
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-[#060606]/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-[#060606]/40 backdrop-blur-sm'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3 py-4" onClick={handleNavClick}>
            <span className="text-lg font-black uppercase tracking-[-0.04em] text-white sm:text-xl">
              THE INFECTED
            </span>
            <span className="hidden rounded-full border border-orange-200/20 bg-orange-100/10 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.2em] text-orange-100/70 sm:inline">
              Survival Horror
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-md px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition ${
                    active
                      ? 'text-orange-100'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-orange-300/70" aria-hidden />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-stone-300 transition hover:text-white lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#060606]/95 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-5 py-4 sm:grid-cols-3">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-[0.1em] transition ${
                      active
                        ? 'bg-orange-100/10 text-orange-100'
                        : 'text-stone-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
      <div className="h-16" aria-hidden />
    </>
  );
}