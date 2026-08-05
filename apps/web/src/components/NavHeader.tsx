'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Game',
    items: [
      { href: '/story', label: 'Story' },
      { href: '/survivors', label: 'Survivors' },
      { href: '/infected', label: 'Infected' },
      { href: '/levels', label: 'Levels' },
      { href: '/combat', label: 'Combat' },
    ],
  },
  {
    label: 'Loadout',
    items: [
      { href: '/weapons', label: 'Weapons' },
      { href: '/gear', label: 'Gear' },
      { href: '/inventory', label: 'Inventory' },
      { href: '/progression', label: 'Progression' },
    ],
  },
  {
    label: 'Media',
    items: [
      { href: '/media', label: 'Gallery' },
      { href: '/media', label: 'Videos' },
      { href: '/media', label: 'Screenshots' },
      { href: '/media', label: '3D Characters' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/android', label: 'Android' },
      { href: '/early-access', label: 'Early Access' },
    ],
  },
];

const allLinks = navGroups.flatMap((g) => g.items.map((i) => i.href));

export function NavHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href;

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
          <Link href="/" className="flex items-center gap-3 py-4" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/branding/header-logo-approved-v2.png"
              alt="The Infected"
              width={48}
              height={48}
              className="h-10 w-auto sm:h-12"
              priority
            />
            <span className="hidden rounded-full border border-orange-200/20 bg-orange-100/10 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.2em] text-orange-100/70 sm:inline">
              Survival Horror
            </span>
          </Link>

          {/* Desktop nav with dropdowns */}
          <div ref={dropdownRef} className="hidden items-center gap-1 lg:flex">
            {navGroups.map((group) => {
              const hasActive = group.items.some((i) => isActive(i.href));
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(group.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                    className={`relative rounded-md px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] transition ${
                      hasActive || openDropdown === group.label
                        ? 'text-orange-100'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {group.label}
                    <svg
                      className={`ml-1 inline-block h-2 w-2 transition-transform ${openDropdown === group.label ? 'rotate-180' : ''}`}
                      viewBox="0 0 8 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M2 3l2 2 2-2" />
                    </svg>
                    {hasActive && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-orange-300/70" aria-hidden />
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {openDropdown === group.label && (
                    <div className="absolute left-0 top-full pt-1">
                      <div className="min-w-[160px] overflow-hidden rounded-xl border border-white/10 bg-[#0a0a09]/95 py-1 shadow-2xl backdrop-blur-xl">
                        {group.items.map((item, i) => (
                          <Link
                            key={`${item.href}-${i}`}
                            href={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] transition ${
                              isActive(item.href)
                                ? 'bg-orange-100/10 text-orange-100'
                                : 'text-stone-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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

        {/* Mobile menu with grouped sections */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#060606]/95 backdrop-blur-xl lg:hidden">
            <div className="mx-auto max-w-7xl px-5 py-4">
              {navGroups.map((group) => (
                <div key={group.label} className="mb-4">
                  <p className="mb-2 text-[0.58rem] font-bold uppercase tracking-[0.28em] text-orange-100/50">{group.label}</p>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item, i) => (
                      <Link
                        key={`${item.href}-${i}`}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-[0.1em] transition ${
                          isActive(item.href)
                            ? 'bg-orange-100/10 text-orange-100'
                            : 'text-stone-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
      <div className="h-16" aria-hidden />
    </>
  );
}