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

type VideoSourceKey = 'desktop-mp4' | 'desktop-webm' | 'mobile-mp4' | 'mobile-webm' | 'auto';

const VIDEO_SOURCES: Record<VideoSourceKey, { src: string; type: string }[]> = {
  'desktop-mp4': [{ src: '/assets/cinematic/hero-cinematic-desktop-v1.mp4', type: 'video/mp4' }],
  'desktop-webm': [{ src: '/assets/cinematic/hero-cinematic-desktop-v1.webm', type: 'video/webm' }],
  'mobile-mp4': [{ src: '/assets/cinematic/hero-cinematic-mobile-v1.mp4', type: 'video/mp4' }],
  'mobile-webm': [{ src: '/assets/cinematic/hero-cinematic-mobile-v1.webm', type: 'video/webm' }],
  'auto': [
    { src: '/assets/cinematic/hero-cinematic-desktop-v1.mp4', type: 'video/mp4' },
    { src: '/assets/cinematic/hero-cinematic-desktop-v1.webm', type: 'video/webm' },
    { src: '/assets/cinematic/hero-cinematic-v5.mp4', type: 'video/mp4' },
  ],
};

type DebugInfo = {
  currentSrc: string;
  paused: boolean;
  currentTime: number;
  duration: number;
  readyState: number;
  networkState: number;
  videoWidth: number;
  videoHeight: number;
  error: MediaError | null;
  visibilityState: string;
  reducedMotion: boolean;
  saveData: boolean | undefined;
  effectiveType: string | undefined;
  decodedFrames: number | undefined;
  droppedFrames: number | undefined;
  playbackEvents: string[];
};

export function CinematicHero() {
  // --- Mounted state pattern: server and first client render must match ---
  const [mounted, setMounted] = useState(false);
  const reduceMotionRaw = useReducedMotion();
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
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);

  // --- Debug mode: activated by ?heroDebug=1 URL param ---
  const [heroDebug, setHeroDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [selectedSource, setSelectedSource] = useState<VideoSourceKey>('auto');
  const [debugEvents, setDebugEvents] = useState<string[]>([]);

  const sceneActive = Boolean(!reduceMotion && !lowBandwidth && webglAvailable && heroVisible && pageVisible);
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

    // Check for heroDebug URL param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setHeroDebug(params.get('heroDebug') === '1');
    }

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

  const logDebugEvent = useCallback((event: string) => {
    setDebugEvents((prev) => {
      const time = new Date().toLocaleTimeString();
      const entry = `[${time}] ${event}`;
      const next = [...prev, entry];
      return next.slice(-20);
    });
  }, []);

  // --- Video playback effect: aggressive autoplay with retry ---
  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;
    if (videoActive) {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.then(() => {
          setHasPlayed(true);
          setPlayError(null);
          if (heroDebug) logDebugEvent('play() succeeded');
        }).catch((err) => {
          if (heroDebug) logDebugEvent(`play() rejected: ${err.name} - ${err.message}`);
          setPlayError(`${err.name}: ${err.message}`);
          video.muted = true;
          video.volume = 0;
          video.play().then(() => {
            setHasPlayed(true);
            setPlayError(null);
            if (heroDebug) logDebugEvent('retry play() succeeded (muted)');
          }).catch((err2) => {
            if (heroDebug) logDebugEvent(`retry play() rejected: ${err2.name}`);
            setPlayError(`${err2.name}: ${err2.message}`);
            setTimeout(() => {
              video.play().then(() => {
                setHasPlayed(true);
                setPlayError(null);
                if (heroDebug) logDebugEvent('delayed retry play() succeeded');
              }).catch((err3) => {
                if (heroDebug) logDebugEvent(`delayed retry rejected: ${err3.name}`);
                setPlayError(`${err3.name}: ${err3.message}`);
                setAutoplayFailed(true);
              });
            }, 100);
          });
        });
      }
    } else {
      video.pause();
    }
  }, [mounted, videoActive, heroDebug, logDebugEvent, selectedSource]);

  // Additional retry: listen for first user interaction to start video
  useEffect(() => {
    if (!mounted || !videoActive) return;
    const video = videoRef.current;
    if (!video || !video.paused) return;

    const tryPlayOnInteraction = () => {
      if (video.paused) {
        video.play().then(() => {
          setHasPlayed(true);
          setAutoplayFailed(false);
          if (heroDebug) logDebugEvent('play() on user interaction succeeded');
        }).catch((err) => {
          if (heroDebug) logDebugEvent(`play() on interaction rejected: ${err.name}`);
        });
      }
    };

    const events = ["click", "touchstart", "keydown", "mousemove", "scroll"];
    events.forEach(e => document.addEventListener(e, tryPlayOnInteraction, { once: true, passive: true }));

    return () => {
      events.forEach(e => document.removeEventListener(e, tryPlayOnInteraction));
    };
  }, [mounted, videoActive, heroDebug, logDebugEvent]);

  const manuallyPlayVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.play().then(() => {
      setHasPlayed(true);
      setAutoplayFailed(false);
      setPlayError(null);
      if (heroDebug) logDebugEvent('manual play() succeeded');
    }).catch((err) => {
      setPlayError(`${err.name}: ${err.message}`);
      if (heroDebug) logDebugEvent(`manual play() rejected: ${err.name} - ${err.message}`);
    });
  }, [heroDebug, logDebugEvent]);

  // --- Debug info polling: update once per second ---
  useEffect(() => {
    if (!mounted || !heroDebug) return;
    const video = videoRef.current;
    if (!video) return;

    const updateInfo = () => {
      const quality = video.getVideoPlaybackQuality?.();
      const conn = (navigator as Navigator & { connection?: ConnectionInformation }).connection;
      setDebugInfo({
        currentSrc: video.currentSrc || '(none)',
        paused: video.paused,
        currentTime: video.currentTime,
        duration: video.duration,
        readyState: video.readyState,
        networkState: video.networkState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        error: video.error,
        visibilityState: document.visibilityState,
        reducedMotion: reduceMotion,
        saveData: conn?.saveData,
        effectiveType: conn?.effectiveType,
        decodedFrames: quality?.totalVideoFrames,
        droppedFrames: quality?.droppedVideoFrames,
        playbackEvents: debugEvents,
      });
    };

    updateInfo();
    const interval = setInterval(updateInfo, 1000);
    return () => clearInterval(interval);
  }, [mounted, heroDebug, reduceMotion, debugEvents]);

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

  // --- Deterministic rendering ---
  const showVideo = true;
  const videoAutoPlay = !reduceMotion && !lowBandwidth;
  const videoPreload = reduceMotion || lowBandwidth ? 'none' : 'auto';
  const showAutoplayFallback = (autoplayFailed || (heroDebug && !hasPlayed)) && !reduceMotion && !lowBandwidth && mounted;
  const showScene = sceneActive && mounted;

  // Determine which video sources to use
  const videoSources = useMemo(() => {
    if (heroDebug && selectedSource !== 'auto') {
      return VIDEO_SOURCES[selectedSource];
    }
    if (!mounted || !isMobile) {
      return [
        { src: '/assets/cinematic/hero-cinematic-desktop-v1.mp4', type: 'video/mp4' },
        { src: '/assets/cinematic/hero-cinematic-desktop-v1.webm', type: 'video/webm' },
      ];
    }
    return [
      { src: '/assets/cinematic/hero-cinematic-mobile-v1.mp4', type: 'video/mp4' },
      { src: '/assets/cinematic/hero-cinematic-mobile-v1.webm', type: 'video/webm' },
    ];
  }, [heroDebug, selectedSource, mounted, isMobile]);

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
          controls={heroDebug}
          aria-hidden={!heroDebug}
          onPlaying={() => { setHasPlayed(true); setAutoplayFailed(false); setPlayError(null); if (heroDebug) logDebugEvent('playing event fired'); }}
          onPause={() => { if (heroDebug) logDebugEvent('pause event fired'); }}
          onError={(e) => { if (heroDebug) logDebugEvent(`error event: ${e.currentTarget.error?.code} - ${e.currentTarget.error?.message}`); }}
          onStalled={() => { if (heroDebug) logDebugEvent('stalled event fired'); }}
          onWaiting={() => { if (heroDebug) logDebugEvent('waiting event fired'); }}
          onCanPlay={() => { if (heroDebug) logDebugEvent('canplay event fired'); }}
          onLoadedData={() => { if (heroDebug) logDebugEvent('loadeddata event fired'); }}
          onLoadedMetadata={() => { if (heroDebug) logDebugEvent('loadedmetadata event fired'); }}
        >
          {videoSources.map((source, i) => (
            <source key={i} src={source.src} type={source.type} />
          ))}
        </video>

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

        {playError && heroDebug && (
          <div className="absolute left-1/2 top-[calc(50%+3rem)] z-20 -translate-x-1/2 rounded-lg bg-red-900/80 px-4 py-2 text-xs text-red-100">
            play() rejection: {playError}
          </div>
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

            {/* Right column removed: the gameplay screenshot image was broken (file does not exist)
                and was covering the zombie video. The video itself is the hero visual. */}
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

      {/* --- Debug panel: only visible when ?heroDebug=1 --- */}
      {heroDebug && mounted && (
        <div className="fixed bottom-4 right-4 z-[100] max-h-[60vh] w-96 overflow-y-auto rounded-lg border border-orange-500/30 bg-black/90 p-4 font-mono text-xs text-green-400 shadow-2xl">
          <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-orange-400">HERO DEBUG PANEL</span>
            <span className="text-white/40">updates 1/s</span>
          </div>

          {/* Source selector */}
          <div className="mb-3 border-b border-white/10 pb-2">
            <div className="mb-1 text-white/60">Video Source (A/B test):</div>
            <div className="flex flex-wrap gap-1">
              {(['auto', 'desktop-mp4', 'desktop-webm', 'mobile-mp4', 'mobile-webm'] as VideoSourceKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setSelectedSource(key); setHasPlayed(false); setAutoplayFailed(false); setPlayError(null); }}
                  className={`rounded px-2 py-1 text-[10px] ${selectedSource === key ? 'bg-orange-500 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Live video diagnostics */}
          {debugInfo && (
            <div className="space-y-0.5">
              <div className="mb-1 text-white/60">Video State:</div>
              <div>currentSrc: <span className="text-yellow-300">{debugInfo.currentSrc}</span></div>
              <div>paused: <span className={debugInfo.paused ? 'text-red-400' : 'text-green-400'}>{String(debugInfo.paused)}</span></div>
              <div>currentTime: <span className="text-cyan-300">{debugInfo.currentTime.toFixed(2)}s</span></div>
              <div>duration: <span className="text-cyan-300">{debugInfo.duration ? debugInfo.duration.toFixed(2) : '?'}s</span></div>
              <div>readyState: <span className="text-yellow-300">{debugInfo.readyState}</span> ({['nothing','metadata','current','future'][debugInfo.readyState] || '?'})</div>
              <div>networkState: <span className="text-yellow-300">{debugInfo.networkState}</span> ({['empty','idle','loading','no_source'][debugInfo.networkState] || '?'})</div>
              <div>videoWidth x Height: <span className="text-cyan-300">{debugInfo.videoWidth} x {debugInfo.videoHeight}</span></div>
              <div>error: <span className={debugInfo.error ? 'text-red-400' : 'text-green-400'}>{debugInfo.error ? `${debugInfo.error.code}: ${debugInfo.error.message}` : 'null'}</span></div>
              <div>visibilityState: <span className="text-yellow-300">{debugInfo.visibilityState}</span></div>
              <div>reducedMotion: <span className={debugInfo.reducedMotion ? 'text-red-400' : 'text-green-400'}>{String(debugInfo.reducedMotion)}</span></div>
              <div>saveData: <span className="text-yellow-300">{String(debugInfo.saveData)}</span></div>
              <div>effectiveType: <span className="text-yellow-300">{debugInfo.effectiveType || '?'}</span></div>
              <div>decodedFrames: <span className="text-cyan-300">{debugInfo.decodedFrames ?? 'N/A'}</span></div>
              <div>droppedFrames: <span className={debugInfo.droppedFrames ? 'text-red-400' : 'text-green-400'}>{debugInfo.droppedFrames ?? 'N/A'}</span></div>
              <div>hasPlayed: <span className={hasPlayed ? 'text-green-400' : 'text-red-400'}>{String(hasPlayed)}</span></div>
              {playError && <div>playError: <span className="text-red-400">{playError}</span></div>}
            </div>
          )}

          {/* Playback events log */}
          <div className="mt-3 border-t border-white/10 pt-2">
            <div className="mb-1 text-white/60">Playback Events:</div>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {debugEvents.length === 0 ? (
                <div className="text-white/30">(no events yet)</div>
              ) : (
                debugEvents.map((evt, i) => (
                  <div key={i} className="text-[10px] text-green-300">{evt}</div>
                ))
              )}
            </div>
          </div>

          {/* Manual play button */}
          <div className="mt-3 border-t border-white/10 pt-2">
            <button
              type="button"
              onClick={manuallyPlayVideo}
              className="w-full rounded bg-orange-500 px-3 py-2 text-xs font-bold text-black hover:bg-orange-400"
            >
              Force Play (muted, playsInline)
            </button>
          </div>
        </div>
      )}

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