'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SceneBoundary } from './hero/SceneBoundary';

type EnvironmentalSceneComponentProps = {
  active: boolean;
  reducedDetail?: boolean;
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

export function CinematicHero() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [narrationState, setNarrationState] = useState<'idle' | 'playing' | 'complete'>('idle');
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupStatus, setSignupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const sceneActive = Boolean(!reduceMotion && webglAvailable && heroVisible && pageVisible);
  const videoActive = Boolean(!reduceMotion && heroVisible && pageVisible);

  useEffect(() => {
    setWebglAvailable(hasWebGLSupport());
    const media = window.matchMedia('(max-width: 767px)');
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoActive) void video.play().catch(() => undefined);
    else video.pause();
  }, [videoActive]);

  useEffect(() => {
    const ambient = ambientRef.current;
    const narration = narrationRef.current;
    if (!pageVisible || !heroVisible) {
      ambient?.pause();
      narration?.pause();
      return;
    }
    if (soundEnabled) void ambient?.play().catch(() => undefined);
  }, [pageVisible, heroVisible, soundEnabled]);

  const playNarrationOnce = useCallback(async () => {
    const narration = narrationRef.current;
    if (!narration || narrationState !== 'idle') return;
    narration.volume = 0.92;
    try {
      setNarrationState('playing');
      await narration.play();
    } catch {
      setNarrationState('idle');
    }
  }, [narrationState]);

  const toggleSound = useCallback(async () => {
    const ambient = ambientRef.current;
    if (!ambient) return;
    if (soundEnabled) {
      ambient.pause();
      setSoundEnabled(false);
      return;
    }
    ambient.volume = 0.34;
    try {
      await ambient.play();
      setSoundEnabled(true);
      await playNarrationOnce();
    } catch {
      setSoundEnabled(false);
    }
  }, [playNarrationOnce, soundEnabled]);

  const submitSignup = useCallback((formData: FormData) => {
    const email = String(formData.get('email') ?? '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setSignupStatus('error');
      return;
    }
    setSignupStatus('success');
  }, []);

  const audioStatus = useMemo(() => {
    if (!soundEnabled) return 'Sound muted. Narration captions available.';
    if (narrationState === 'playing') return 'Ambient sound active. Narration playing.';
    if (narrationState === 'complete') return 'Ambient sound active. Narration complete.';
    return 'Ambient sound active.';
  }, [narrationState, soundEnabled]);

  return (
    <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-[#030405] text-stone-100">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 saturate-[0.82]"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/cinematic/temporary-cinematic-poster-noncanonical.jpg"
        aria-hidden
      >
        <source src="/assets/cinematic/temporary-cinematic-loop-noncanonical.mp4" type="video/mp4" />
      </video>
      {reduceMotion && <div aria-hidden className="absolute inset-0 bg-[url('/assets/cinematic/temporary-cinematic-poster-noncanonical.jpg')] bg-cover bg-center" />}
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
            <EnvironmentalScene active={sceneActive} reducedDetail={isMobile} />
          </Suspense>
        </SceneBoundary>
      )}

      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(255,74,28,0.22),transparent_26%),linear-gradient(90deg,rgba(3,4,5,0.96)_0%,rgba(3,4,5,0.82)_35%,rgba(3,4,5,0.38)_66%,rgba(3,4,5,0.74)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 to-transparent" />

      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-40 mix-blend-screen"
        animate={sceneActive ? { x: [0, -18, 0], y: [0, 10, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle at 72% 52%, rgba(255,110,45,.24), transparent 18%), radial-gradient(circle at 58% 65%, rgba(160,160,150,.11), transparent 24%)' }}
      />

      <main className="relative z-10 grid min-h-[100svh] grid-rows-[1fr_auto] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 pt-12 md:grid-cols-[minmax(0,0.92fr)_minmax(320px,1.08fr)] md:pt-0">
          <motion.div
            className="max-w-2xl"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/assets/branding/the-infected-logo.png"
              alt="The Infected official logo"
              width={1024}
              height={1024}
              priority
              className="mb-5 h-auto w-36 drop-shadow-[0_0_45px_rgba(255,74,28,0.42)] sm:w-44 lg:w-52"
            />
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-orange-200/80 sm:text-sm">
              Cinematic Android survival
            </p>
            <h1 className="text-balance text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Outlast the silence after the fall.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-stone-300 sm:text-lg lg:text-xl lg:leading-8">
              A premium reveal for The Infected, built as the first reusable production surface for the Android game universe.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => {
                  setSignupOpen(true);
                  setSignupStatus('idle');
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_70px_rgba(255,74,28,.28)] transition hover:scale-[1.02] hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                Join the Survivors
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-pressed={soundEnabled}
                aria-describedby="audio-status narration-caption"
              >
                {soundEnabled ? 'Mute' : 'Enter with Sound'}
              </button>
            </div>
            <p className="mt-5 text-sm uppercase tracking-[0.26em] text-stone-400">Coming Soon to Android</p>
            <p id="narration-caption" className="mt-4 max-w-xl rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-stone-300 backdrop-blur">
              <span className="font-semibold text-orange-200">Caption:</span> {narrationText}
            </p>
          </motion.div>

          <motion.div
            className="relative min-h-[34svh] md:min-h-[70svh]"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          >
            <div className="absolute bottom-[12%] right-[8%] h-48 w-48 rounded-full bg-orange-500/20 blur-3xl sm:h-80 sm:w-80" />
            <div className="absolute bottom-[16%] right-[16%] h-72 w-28 -skew-x-6 rounded-[50%] border border-orange-200/10 bg-black/22 shadow-[0_0_90px_rgba(255,74,28,.18)] backdrop-blur-[2px] sm:h-96 sm:w-36" />
          </motion.div>
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 pb-2 pt-4 text-xs uppercase tracking-[0.22em] text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Scroll to enter the outbreak</span>
          <span id="audio-status" role="status" aria-live="polite">{audioStatus}</span>
          <span>Android reveal in production</span>
        </div>
      </main>

      {signupOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/78 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <form
            className="w-full max-w-md rounded-3xl border border-white/12 bg-[#0b0b0a] p-6 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              submitSignup(new FormData(event.currentTarget));
            }}
          >
            <h2 id="signup-title" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Join the Survivors</h2>
            <p className="mt-3 text-sm leading-6 text-stone-300">Enter an email to reserve early access updates. Prototype only; Supabase submission follows after review.</p>
            <label className="mt-5 block text-xs font-bold uppercase tracking-[0.2em] text-stone-400" htmlFor="survivor-email">Email</label>
            <input
              id="survivor-email"
              name="email"
              type="email"
              required
              placeholder="survivor@example.com"
              className="mt-2 min-h-12 w-full rounded-2xl border border-white/14 bg-white/8 px-4 text-white outline-none focus:ring-2 focus:ring-orange-300"
            />
            {signupStatus === 'success' && <p className="mt-4 text-sm text-orange-200" role="status">You are on the early-access prototype list.</p>}
            {signupStatus === 'error' && <p className="mt-4 text-sm text-red-300" role="alert">Enter a valid email address.</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="min-h-11 rounded-full bg-orange-500 px-5 text-sm font-black uppercase tracking-[0.16em] text-black">Submit</button>
              <button type="button" onClick={() => setSignupOpen(false)} className="min-h-11 rounded-full border border-white/14 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white">Close</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
