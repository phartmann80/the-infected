'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EarlyAccessForm } from './EarlyAccessForm';
import { SceneBoundary } from './hero/SceneBoundary';

type EnvironmentalSceneComponentProps = {
  active: boolean;
  reducedDetail?: boolean;
};

type ConnectionInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

const EnvironmentalScene = dynamic<EnvironmentalSceneComponentProps>(
  () => import('./hero/EnvironmentalScene').then((mod) => mod.EnvironmentalScene),
  { ssr: false, loading: () => null }
);

const narrationText = 'The world went quiet before it fell. Out of the smoke, the survivors learned one rule. Stay together, or become one of the infected.';

function hasWebGLSupport() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function prefersLowBandwidth() {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: ConnectionInformation }).connection;
  return Boolean(connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g');
}

export function CinematicHero() {
  // --- Mounted state pattern: server and first client render must match ---
  // All browser-specific values default to deterministic values that are
  // identical on server and first client render. They are updated only
  // after mount via useEffect, which runs exclusively on the client.
  const [mounted, setMounted] = useState(false);
  const reduceMotionRaw = useReducedMotion();
  // useReducedMotion returns null on server, boolean on client. Normalize to false until mounted.
  const reduceMotion = mounted ? Boolean(reduceMotionRaw) : false;

  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const signupTriggerRef = useRef<HTMLButtonElement>(null);
  const signupDialogRef = useRef<HTMLDivElement>(null);
  const signupEmailRef = useRef<HTMLInputElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [narrationState, setNarrationState] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [signupOpen, setSignupOpen] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const trailerVideoRef = useRef<HTMLVideoElement>(null);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  const sceneActive = Boolean(!reduceMotion && !lowBandwidth && webglAvailable && heroVisible && pageVisible);
  // Video plays on both desktop and mobile; only blocked by reduceMotion or genuine low-bandwidth (2g/saveData)
  const videoActive = Boolean(!reduceMotion && !lowBandwidth && heroVisible && pageVisible);

  // --- Mount effect: set all browser-specific state after hydration ---
  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebglAvailable(hasWebGLSupport());
    const media = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    setLowBandwidth(prefersLowBandwidth());
    media.addEventListener('change', updateMobile);
    return () => media.removeEventListener('change', updateMobile);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const closeSignup = useCallback(() => {
    setSignupOpen(false);
  }, []);

  useEffect(() => {
    if (!signupOpen) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = signupTriggerRef.current;
    document.body.style.overflow = 'hidden';
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusFirstField = () => signupEmailRef.current?.focus();
    const focusFrame = window.requestAnimationFrame(focusFirstField);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSignup();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = signupDialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.requestAnimationFrame(() => trigger?.focus());
    };
  }, [closeSignup, signupOpen]);

  // --- Video playback effect: only attempt play after mount ---
  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;
    if (videoActive) {
      void video.play().catch(() => {
        setAutoplayFailed(true);
      });
    } else {
      video.pause();
    }
  }, [mounted, videoActive]);

  const manuallyPlayVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().then(() => setAutoplayFailed(false)).catch(() => undefined);
  }, []);

  useEffect(() => {
    const ambient = ambientRef.current;
    const narration = narrationRef.current;
    if (!pageVisible || !heroVisible || lowBandwidth) {
      ambient?.pause();
      narration?.pause();
      return;
    }
    if (soundEnabled) void ambient?.play().catch(() => undefined);
  }, [heroVisible, lowBandwidth, pageVisible, soundEnabled]);

  const playNarration = useCallback(() => {
    const narration = narrationRef.current;
    if (!narration) return;
    narration.currentTime = 0;
    void narration.play().then(() => setNarrationState('playing')).catch(() => undefined);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        void ambientRef.current?.play().catch(() => undefined);
        void narrationRef.current?.play().then(() => setNarrationState('playing')).catch(() => undefined);
      } else {
        ambientRef.current?.pause();
        narrationRef.current?.pause();
      }
      return next;
    });
  }, []);

  const audioStatus = useMemo(() => {
    if (lowBandwidth) return 'Low-bandwidth mode. Media paused to protect your connection.';
    if (!soundEnabled) return 'Audio muted. Click "Enter with Sound" to enable.';
    if (narrationState === 'playing') return 'Narration playing...';
    if (narrationState === 'complete') return 'Narration complete.';
    return 'Ambient sound active.';
  }, [lowBandwidth, narrationState, soundEnabled]);

  // --- Deterministic rendering: server and first client render must produce identical HTML ---
  // Until mounted, we render a deterministic default: desktop sources, autoplay on, no fallback image.
  // After mount, we apply browser-specific logic.
  const showVideo = true; // video always rendered
  const videoAutoPlay = !reduceMotion && !lowBandwidth; // deterministic until mounted updates reduceMotion/lowBandwidth
  const videoPreload = reduceMotion || lowBandwidth ? 'none' : 'auto';
  const showPosterImage = (reduceMotion || lowBandwidth) && mounted;
  const showAutoplayFallback = autoplayFailed && !reduceMotion && !lowBandwidth && mounted;
  const showScene = sceneActive && mounted;

  return (
    <>
      <section ref={heroRef} aria-labelledby="hero-heading" className="relative min-h-[100svh] w-full overflow-hidden bg-[#030405]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-90 saturate-[0.74] contrast-[1.08]"
          autoPlay={videoAutoPlay}
          muted
          loop
          playsInline
          preload={videoPreload}
          poster="/assets/cinematic/hero-poster-light.jpg"
          aria-hidden
          onPlaying={() => { if (process.env.NODE_ENV !== 'production') console.log('[CinematicHero] video: playing'); setAutoplayFailed(false); }}
          onPause={() => { if (process.env.NODE_ENV !== 'production') console.log('[CinematicHero] video: paused'); }}
          onError={(e) => { if (process.env.NODE_ENV !== 'production') console.error('[CinematicHero] video: error', e); }}
          onStalled={() => { if (process.env.NODE_ENV !== 'production') console.log('[CinematicHero] video: stalled'); }}
          onWaiting={() => { if (process.env.NODE_ENV !== 'production') console.log('[CinematicHero] video: waiting'); }}
        >
          {/* Before mount, render desktop sources (deterministic). After mount, switch based on isMobile. */}
          {!mounted || !isMobile ? (
            <>
              <source src="/assets/cinematic/hero-cinematic-desktop-v1.mp4" type="video/mp4" />
              <source src="/assets/cinematic/hero-cinematic-desktop-v1.webm" type="video/webm" />
            </>
          ) : (
            <>
              <source src="/assets/cinematic/hero-cinematic-mobile-v1.mp4" type="video/mp4" />
              <source src="/assets/cinematic/hero-cinematic-mobile-v1.webm" type="video/webm" />
            </>
          )}
          <source src="/assets/cinematic/hero-cinematic-v5.mp4" type="video/mp4" />
        </video>
        {showPosterImage && (
          <Image
            src="/assets/cinematic/hero-poster-light.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
        )}
        {showAutoplayFallback && (
          <button
            type="button"
            onClick={manuallyPlayVideo}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center gap-2 rounded-full border border-orange-200/30 bg-black/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur transition hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
            Play Cinematic
          </button>
        )}
        {showAutoplayFallback && (
          <Image
            src="/assets/cinematic/hero-poster-light.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-50"
            aria-hidden
          />
        )}
        <audio ref={ambientRef} src="/assets/audio/temporary-ambient-loop-noncanonical.webm" loop preload="none" />
        <audio
          ref={narrationRef}
          src="/assets/audio/temporary-narration-noncanonical.mp3"
          preload="none"
          onEnded={() => setNarrationState('complete')}
        />

        {showScene && (
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <EnvironmentalScene active={sceneActive} reducedDetail={isMobile || lowBandwidth} />
            </Suspense>
          </SceneBoundary>
        )}

        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_77%_64%,rgba(255,73,24,0.18),transparent_22%),radial-gradient(circle_at_18%_18%,rgba(38,74,104,0.18),transparent_30%),linear-gradient(90deg,rgba(3,4,5,0.92)_0%,rgba(3,4,5,0.62)_31%,rgba(3,4,5,0.12)_61%,rgba(3,4,5,0.72)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />

        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-50 mix-blend-screen"
          animate={showScene ? { x: [0, -10, 0], y: [0, 8, 0], opacity: [0.32, 0.54, 0.32] } : undefined}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at 74% 68%, rgba(255,93,31,.22), transparent 19%), radial-gradient(circle at 28% 48%, rgba(91,119,137,.13), transparent 28%)' }}
        />

        <div className="relative z-10 grid min-h-[100svh] grid-rows-[1fr_auto] px-5 py-6 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-6 pt-12 md:grid-cols-[minmax(0,0.82fr)_minmax(360px,1.18fr)] md:pt-0">
            <motion.div
              className="max-w-xl"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={false}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 1.45, delay: 0.1, ease: 'easeOut' }}
                className="relative mb-6 w-72 sm:w-96 lg:w-[28rem]"
              >
                <div aria-hidden className="absolute -inset-8 rounded-full bg-orange-500/18 blur-3xl" />
                <Image
                  src="/assets/branding/the-infected-logo-approved-v2.png"
                  alt="The Infected official logo"
                  width={448}
                  height={1024}
                  priority
                  className="relative h-auto w-full"
                />
              </motion.div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-500/80">
                Enter the Quarantine Zone
              </p>
              <motion.h1
                id="hero-heading"
                className="text-balance text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                Survive the <span className="text-orange-500">Quarantine Zone</span>
              </motion.h1>

              <motion.p
                className="mt-4 max-w-md text-base leading-relaxed text-white/70 sm:text-lg"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                A top-down survival horror shooter. Scavenge, shoot, and stay alive across 10 escalating levels of the infected horde.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-4"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  ref={signupTriggerRef}
                  onClick={() => {
                    setSignupOpen(true);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_70px_rgba(255,74,28,.28)] transition hover:scale-[1.02] hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  Join the Survivors
                </button>
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
                  Watch Trailer
                </button>
                <a
                  href="#download"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download APK
                </a>
              </motion.div>

              <motion.div
                className="mt-6 flex items-center gap-3 text-xs text-white/40"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.75, delay: 2.25 }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Alpha Build
                </span>
                <span aria-hidden>|</span>
                <span>Offline Play</span>
                <span aria-hidden>|</span>
                <span>No Ads</span>
              </motion.div>

              <button
                type="button"
                onClick={toggleSound}
                className="mt-4 inline-flex items-center gap-2 text-xs text-white/50 transition hover:text-white/80"
              >
                {soundEnabled ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.54 8.46a5 5 0 010 7.07" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19.07 4.93a10 10 0 010 14.14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23 9l-6 6M17 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {soundEnabled ? 'Sound On' : 'Enter with Sound'}
              </button>
            </motion.div>

            <motion.div
              className="relative hidden md:block"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src="/assets/screenshots/gameplay-screenshot-01.jpg"
                  alt="The Infected gameplay screenshot"
                  fill
                  sizes="(min-width: 768px) 448px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/80">Quarantine Zone</p>
                  <p className="text-sm text-white/60">Level 1: The Outbreak</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col items-center gap-3 pb-2 pt-4 text-center"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 2.5 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/30">Scroll to explore</p>
            <motion.div
              aria-hidden
              animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1"
            >
              <span className="h-2 w-1 rounded-full bg-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {signupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            ref={signupDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-title"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0b0d] p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={closeSignup}
              aria-label="Close"
              className="absolute right-4 top-4 text-white/40 transition hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
            <h2 id="signup-title" className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
              Join the Survivors
            </h2>
            <p className="mb-6 text-sm text-white/60">
              Get early access to The Infected alpha build and be the first to know about new levels and updates.
            </p>
            <EarlyAccessForm
              idPrefix="hero-signup"
              source="hero"
              heading="Join the Survivors"
              description="Get early access to The Infected alpha build and be the first to know about new levels and updates."
              registrationEnabled={true}
              onCancel={closeSignup}
              ref={signupEmailRef}
            />
          </div>
        </div>
      )}

      {trailerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setTrailerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setTrailerOpen(false)}
            className="absolute right-6 top-6 text-white/60 transition hover:text-white"
            aria-label="Close trailer"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
          <video
            ref={trailerVideoRef}
            className="max-h-[80vh] w-full max-w-4xl rounded-lg"
            controls
            autoPlay
            playsInline
          >
            <source src="/assets/cinematic/hero-cinematic-desktop-v1.mp4" type="video/mp4" />
            <source src="/assets/cinematic/hero-cinematic-desktop-v1.webm" type="video/webm" />
          </video>
        </div>
      )}
    </>
  );
}