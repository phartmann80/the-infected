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
  const reduceMotion = useReducedMotion();
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

  const sceneActive = Boolean(!reduceMotion && !lowBandwidth && webglAvailable && heroVisible && pageVisible);
  // Video plays on both desktop and mobile; only blocked by reduceMotion or genuine low-bandwidth (2g/saveData)
  const videoActive = Boolean(!reduceMotion && !lowBandwidth && heroVisible && pageVisible);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoActive) {
      void video.play().catch(() => {
        setAutoplayFailed(true);
      });
    } else {
      video.pause();
    }
  }, [videoActive]);

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

  return (
    <>
      <section ref={heroRef} aria-labelledby="hero-heading" className="relative min-h-[100svh] w-full overflow-hidden bg-[#030405]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-90 saturate-[0.85] contrast-[1.05]"
          autoPlay={!reduceMotion && !lowBandwidth}
          muted
          loop
          playsInline
          preload={reduceMotion || lowBandwidth ? 'none' : 'auto'}
          poster="/assets/cinematic/hero-poster-v5.jpg"
          aria-hidden
        >
          {isMobile ? (
            <>
              <source src="/assets/cinematic/hero-cinematic-mobile-v1.mp4" type="video/mp4" />
              <source src="/assets/cinematic/hero-cinematic-mobile-v1.webm" type="video/webm" />
            </>
          ) : (
            <>
              <source src="/assets/cinematic/hero-cinematic-desktop-v1.mp4" type="video/mp4" />
              <source src="/assets/cinematic/hero-cinematic-desktop-v1.webm" type="video/webm" />
            </>
          )}
          <source src="/assets/cinematic/hero-cinematic-v5.mp4" type="video/mp4" />
        </video>
        {(reduceMotion || lowBandwidth || autoplayFailed) && (
          <Image
            src="/assets/cinematic/hero-poster-v5.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
        )}
        {autoplayFailed && !reduceMotion && !lowBandwidth && (
          <button
            type="button"
            onClick={manuallyPlayVideo}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center gap-2 rounded-full border border-orange-200/30 bg-black/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur transition hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
            Play Cinematic
          </button>
        )}
        <audio ref={ambientRef} src="/assets/audio/temporary-ambient-loop-noncanonical.webm" loop preload="none" />
        <audio
          ref={narrationRef}
          src="/assets/audio/temporary-narration-noncanonical.mp3"
          preload="none"
          onEnded={() => setNarrationState('complete')}
        />

        {sceneActive && (
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <EnvironmentalScene active={sceneActive} reducedDetail={isMobile || lowBandwidth} />
            </Suspense>
          </SceneBoundary>
        )}

        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_77%_64%,rgba(255,73,24,0.18),transparent_22%),radial-gradient(circle_at_18%_18%,rgba(38,74,104,0.18),transparent_30%),linear-gradient(90deg,rgba(3,4,5,0.92)_0%,rgba(3,4,5,0.62)_31%,rgba(3,4,5,0.12)_61%,rgba(3,4,5,0.72)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/78 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/90 via-black/40 to-transparent" />

        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-50 mix-blend-screen"
          animate={sceneActive ? { x: [0, -10, 0], y: [0, 8, 0], opacity: [0.32, 0.54, 0.32] } : undefined}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at 74% 68%, rgba(255,93,31,.22), transparent 19%), radial-gradient(circle at 28% 48%, rgba(91,119,137,.13), transparent 28%)' }}
        />

        <div className="relative z-10 grid min-h-[100svh] grid-rows-[1fr_auto] px-5 py-6 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-6 pt-12 md:grid-cols-[minmax(0,0.82fr)_minmax(360px,1.18fr)] md:pt-0">
            <motion.div
              className="max-w-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 1.15, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, filter: 'blur(10px)', scale: 0.96 }}
                animate={reduceMotion ? undefined : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 1.45, delay: 0.1, ease: 'easeOut' }}
                className="relative mb-6 w-52 sm:w-64 lg:w-80"
              >
                <div aria-hidden className="absolute -inset-8 rounded-full bg-orange-500/18 blur-3xl" />
                <Image
                  src="/assets/branding/the-infected-logo-approved-v2.png"
                  alt="The Infected official logo"
                  width={1024}
                  height={1024}
                  priority
                  className="relative h-auto w-full drop-shadow-[0_0_55px_rgba(255,74,28,0.55)]"
                />
              </motion.div>

              <motion.p
                className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-orange-100/75 sm:text-xs"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={reduceMotion ? undefined : { opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Enter the quarantine zone
              </motion.p>

              <motion.h1
                id="hero-heading"
                className="max-w-[11ch] text-balance text-5xl font-black uppercase leading-[0.82] tracking-[-0.075em] text-white sm:text-7xl lg:text-8xl"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.22, ease: [0.16, 1, 0.3, 1] }}
              >
                The silence...
                <span className="block text-orange-100">was only</span>
                <span className="block">the beginning.</span>
              </motion.h1>

              <motion.p
                className="mt-6 max-w-md text-pretty text-base leading-7 text-stone-300/88 sm:text-lg"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.85 }}
              >
                A broken city. One signal left. Survive long enough to answer it.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 2.25 }}
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-orange-200/30 bg-orange-100/10 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur transition hover:bg-orange-100/20 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
                  Watch Trailer
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-black/35 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-pressed={soundEnabled}
                  aria-describedby="audio-status narration-caption"
                  disabled={lowBandwidth}
                >
                  {lowBandwidth ? 'Low-bandwidth mode' : soundEnabled ? 'Mute' : 'Enter with Sound'}
                </button>
              </motion.div>

              <p className="mt-5 text-xs uppercase tracking-[0.32em] text-stone-400">Coming Soon to Android</p>
              <p id="narration-caption" className="mt-4 max-w-xl rounded-2xl border border-white/10 bg-black/34 p-4 text-sm leading-6 text-stone-300/90 backdrop-blur">
                <span className="font-semibold text-orange-200">Caption:</span> {narrationText}
              </p>
            </motion.div>

            <div className="relative min-h-[34svh] md:min-h-[70svh]" aria-hidden>
              <motion.div
                className="absolute bottom-[18%] right-[28%] h-72 w-24 -skew-x-3 rounded-[48%] bg-black/45 shadow-[0_0_80px_rgba(255,74,28,.12)] blur-[1px] sm:h-[26rem] sm:w-32"
                animate={sceneActive ? { x: [0, 5, 0], opacity: [0.34, 0.48, 0.34] } : undefined}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-[22%] right-[14%] h-48 w-12 -skew-x-6 rounded-[48%] bg-black/40 blur-[1px] sm:h-64 sm:w-16"
                animate={sceneActive ? { y: [0, -4, 0], opacity: [0.22, 0.38, 0.22] } : undefined}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute bottom-[10%] right-[2%] h-56 w-56 rounded-full bg-orange-500/18 blur-3xl sm:h-96 sm:w-96" />
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 pb-2 pt-4 text-xs uppercase tracking-[0.22em] text-stone-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Descend into the city</span>
            <span id="audio-status" role="status" aria-live="polite">{audioStatus}</span>
            <span>{lowBandwidth ? 'Media paused to protect your connection' : 'Hero composition in internal review'}</span>
          </div>
        </div>

        {signupOpen && (
          <div
            ref={signupDialogRef}
            className="fixed inset-0 z-50 grid place-items-center bg-black/78 p-5 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-signup-title"
            aria-describedby="hero-signup-description"
            tabIndex={-1}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeSignup();
            }}
          >
            <EarlyAccessForm
              ref={signupEmailRef}
              idPrefix="hero"
              source="hero"
              heading="Join the Survivors"
              registrationEnabled={false}
              description="The registration contract is wired into this preview. It remains closed until the reviewed storage and privacy configuration is enabled."
              className="w-full max-w-md rounded-3xl border border-white/12 bg-[#0b0b0a] p-6 shadow-2xl"
              onCancel={closeSignup}
            />
          </div>
        )}
      </section>

      {/* Trailer modal */}
      {trailerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setTrailerOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setTrailerOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Cinematic trailer player"
        >
          <button
            type="button"
            onClick={() => setTrailerOpen(false)}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-white/20"
            aria-label="Close trailer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
          </button>
          <div className="relative w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
            <video
              ref={trailerVideoRef}
              className="aspect-video w-full rounded-2xl border border-white/10 bg-black shadow-2xl"
              controls
              autoPlay
              playsInline
              poster="/assets/cinematic/hero-trailer-poster.jpg"
            >
              <source src="/assets/cinematic/hero-trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

    </>
  );
}