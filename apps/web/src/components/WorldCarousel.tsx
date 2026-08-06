'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

type Slide = {
  src: string;
  alt: string;
  label: string;
};

export function WorldCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel viewport */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a09]">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover saturate-[0.85]"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100/70">{slide.label}</p>
            </div>
          </div>
        ))}

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/75 hover:border-orange-200/30"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/75 hover:border-orange-200/30"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation dots */}
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-orange-400' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}