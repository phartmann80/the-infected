'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode, useEffect, useRef, useState } from 'react';

/* ScrollReveal — wraps children with a fade/slide-in when scrolled into view */
type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function ScrollReveal({ children, delay = 0, y = 40, className }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* StaggerContainer — staggered reveal of children */
type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function StaggerContainer({ children, className, stagger = 0.08 }: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* StaggerItem — child of StaggerContainer */
type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ParallaxSection — subtle parallax on scroll */
type ParallaxSectionProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export function ParallaxSection({ children, className, speed = 0.15 }: ParallaxSectionProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const center = rect.top + rect.height / 2;
          const dist = center - windowHeight / 2;
          setOffset(dist * speed);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, speed]);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  );
}

/* LazyVideo — lazy-loaded looping video with poster, pauses when offscreen */
type LazyVideoProps = {
  srcMp4: string;
  srcWebm?: string;
  poster: string;
  className?: string;
  overlayClassName?: string;
};

export function LazyVideo({ srcMp4, srcWebm, poster, className, overlayClassName }: LazyVideoProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (visible && !reduceMotion) {
      if (!loaded) setLoaded(true);
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [visible, reduceMotion, loaded]);

  if (reduceMotion) {
    return (
      <div ref={containerRef} className={className}>
        <img src={poster} alt="" className="h-full w-full object-cover" />
        {overlayClassName && <div className={overlayClassName} />}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {loaded && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          <source src={srcMp4} type="video/mp4" />
        </video>
      )}
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
}

/* SmokeOverlay — CSS-based drifting smoke layer */
export function SmokeOverlay({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      <div className="anim-smoke absolute -left-20 top-1/4 h-48 w-96 rounded-full bg-stone-500/8 blur-3xl" />
      <div className="anim-smoke delay-2 absolute right-0 top-1/3 h-40 w-80 rounded-full bg-stone-600/6 blur-3xl" />
      <div className="anim-smoke delay-4 absolute left-1/3 bottom-0 h-32 w-72 rounded-full bg-orange-900/5 blur-3xl" />
    </div>
  );
}

/* EmberOverlay — CSS-based floating ember particles */
export function EmberOverlay({ className, count = 12 }: { className?: string; count?: number }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  const embers = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 8.3 + Math.random() * 5) % 100}%`,
    delay: `${(i * 0.3 + Math.random() * 2).toFixed(1)}s`,
    duration: `${(3 + Math.random() * 2).toFixed(1)}s`,
    size: `${(2 + Math.random() * 3).toFixed(0)}px`,
  }));
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      {embers.map((e) => (
        <span
          key={e.id}
          className="anim-ember absolute bottom-0 rounded-full bg-orange-400/60"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDelay: e.delay,
            animationDuration: e.duration,
            boxShadow: '0 0 4px rgba(255, 120, 40, 0.5)',
          }}
        />
      ))}
    </div>
  );
}

/* EmergencyLights — flickering emergency light overlay */
export function EmergencyLights({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      <div className="anim-flicker absolute -top-10 left-1/4 h-32 w-64 rounded-full bg-red-600/15 blur-3xl" />
      <div className="anim-flicker delay-3 absolute -top-10 right-1/4 h-28 w-56 rounded-full bg-orange-500/12 blur-3xl" />
    </div>
  );
}

/* AnimatedWaveform — radio signal pulse bars */
export function AnimatedWaveform({ className, bars = 20 }: { className?: string; bars?: number }) {
  const reduceMotion = useReducedMotion();
  const heights = [18, 34, 12, 52, 28, 72, 44, 88, 22, 56, 31, 64, 18, 42, 26, 76, 38, 54, 20, 48];
  return (
    <div className={`flex items-end gap-1 ${className ?? ''}`} aria-label="Signal activity visualization">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`flex-1 bg-orange-300/45 ${reduceMotion ? '' : 'anim-signal'}`}
          style={{
            height: '2.5rem',
            transform: `scaleY(${heights[i % heights.length] / 100})`,
            transformOrigin: 'bottom',
            animationDelay: reduceMotion ? undefined : `${(i * 0.06).toFixed(2)}s`,
          }}
          aria-hidden
        />
      ))}
    </div>
  );
}

/* SectionDivider — animated divider between chapters */
export function SectionDivider({ label }: { label?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12" aria-hidden>
      <div className="flex items-center gap-4 py-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-900/30 to-orange-700/40" />
        {label && (
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.3em] text-orange-100/30">{label}</span>
        )}
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-orange-900/30 to-orange-700/40" />
      </div>
    </div>
  );
}