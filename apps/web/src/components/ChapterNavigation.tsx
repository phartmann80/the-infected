'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const chapters = [
  { id: 'story', label: 'Story' },
  { id: 'world', label: 'World' },
  { id: 'survivors', label: 'People' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'mission', label: 'Mission' },
  { id: 'review', label: 'Review gates' },
  { id: 'join', label: 'Join' },
] as const;

const textLinkClass = 'whitespace-nowrap rounded-full px-2 py-1 transition hover:text-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200';
const actionLinkClass = 'shrink-0 rounded-full border border-orange-200/25 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-orange-100 transition hover:border-orange-200/60 hover:bg-orange-200/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200';

export function ChapterNavigation() {
  const [activeChapter, setActiveChapter] = useState('story');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]) setActiveChapter(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-y border-white/10 bg-[#060606]/85 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-12" aria-label="Landing page chapters">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center justify-between gap-6">
          <Link href="#story" className="shrink-0 rounded-full px-2 py-1 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:text-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200">
            The Infected
          </Link>
          <Link href="#join" className={`${actionLinkClass} sm:hidden`}>
            Early access
          </Link>
        </div>
        <div className="chapter-link-scroll min-w-0 overflow-x-auto pb-1 sm:order-none sm:flex-1 sm:pb-0">
          <ul className="flex min-w-max items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-stone-500 sm:justify-center">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`#${chapter.id}`}
                  className={`${textLinkClass} ${activeChapter === chapter.id ? 'bg-orange-200/10 text-orange-100' : ''}`}
                  aria-current={activeChapter === chapter.id ? 'location' : undefined}
                >
                  {chapter.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="#join" className={`${actionLinkClass} hidden sm:inline-flex`}>
          Early access
        </Link>
      </div>
    </nav>
  );
}
