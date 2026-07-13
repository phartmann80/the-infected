'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { gameFoundationMetadata } from '@the-infected/game-data';
export function CinematicHero() {
  return <section className="relative min-h-screen overflow-hidden bg-infected-black text-stone-100">
    <div aria-hidden className="absolute inset-0 placeholder-grid opacity-30" />
    <motion.div aria-hidden className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-infected-blood/40 blur-3xl" animate={{ opacity: [0.22, 0.48, 0.22], scale: [1, 1.12, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div aria-hidden className="absolute bottom-[-10rem] right-[-4rem] h-[34rem] w-[34rem] rounded-full bg-infected-ember/25 blur-3xl" animate={{ opacity: [0.18, 0.4, 0.18], y: [0, -24, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />
    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,74,28,0.18),transparent_32%),linear-gradient(180deg,rgba(3,4,5,0.25),#030405_88%)]" />
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-20 lg:px-8">
      <motion.p className="mb-6 max-w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-stone-300 backdrop-blur" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>Technical hero foundation · placeholder background</motion.p>
      <motion.div className="mb-8 w-56 sm:w-72" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }}>
        <Image src="/assets/branding/the-infected-logo.png" alt="The Infected official logo" width={1024} height={1024} priority className="h-auto w-full drop-shadow-[0_0_35px_rgba(255,74,28,0.35)]" />
      </motion.div>
      <motion.div className="max-w-4xl" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2 }}>
        <h1 className="text-balance text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">The outbreak begins on Android.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">A production-grade landing-page shell for a cinematic 3D zombie-survival game. No fictional lore, enemies, weapons, or permanent 3D assets are approved yet.</p>
      </motion.div>
      <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}>
        <a className="rounded-full bg-infected-ember px-7 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black shadow-ember transition hover:scale-[1.02]" href="#foundation">Coming Soon</a>
        <a className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur transition hover:bg-white/10" href="#foundation">View Foundation</a>
      </motion.div>
      <motion.div id="foundation" className="mt-16 grid gap-4 border-t border-white/10 pt-8 text-sm text-stone-400 md:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.55 }}>
        <div><p className="font-semibold uppercase tracking-[0.2em] text-stone-200">Game-first data</p><p className="mt-2">Web consumes shared contracts from packages/game-data.</p></div>
        <div><p className="font-semibold uppercase tracking-[0.2em] text-stone-200">Asset discipline</p><p className="mt-2">Only the official logo is registered as approved IP in this scaffold.</p></div>
        <div><p className="font-semibold uppercase tracking-[0.2em] text-stone-200">Content status</p><p className="mt-2">{gameFoundationMetadata.note}</p></div>
      </motion.div>
    </main>
  </section>;
}
