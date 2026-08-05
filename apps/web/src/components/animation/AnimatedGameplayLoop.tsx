'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type LoopStep = {
  step: string;
  label: string;
  title: string;
  description: string;
};

export function AnimatedGameplayLoop({ steps }: { steps: readonly LoopStep[] }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [reduceMotion, inView, steps.length]);

  return (
    <div ref={ref}>
      <ol aria-label="Android prototype gameplay loop" className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((item, i) => {
          const isActive = i === activeStep;
          return (
            <li
              key={item.step}
              className={`relative bg-[#0b0b0a] p-5 transition-all duration-500 sm:p-6 ${isActive && !reduceMotion ? 'bg-orange-950/20' : ''}`}
            >
              <p className="text-4xl font-black tracking-[-0.08em] text-orange-100/20" aria-hidden>{item.step}</p>
              <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{item.label}</p>
              <h4 className="mt-3 text-xl font-black uppercase leading-none tracking-[-0.05em] text-white">{item.title}</h4>
              <p className="mt-4 text-sm leading-7 text-stone-400">{item.description}</p>
              {isActive && !reduceMotion && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-orange-400"
                  layoutId="loop-indicator"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Flow arrows */}
      {!reduceMotion && (
        <div className="mt-4 flex items-center justify-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-stone-500">
          <span>Explore</span>
          <span className="text-orange-400/60">→</span>
          <span>Fight</span>
          <span className="text-orange-400/60">→</span>
          <span>Loot</span>
          <span className="text-orange-400/60">→</span>
          <span>Equip</span>
          <span className="text-orange-400/60">→</span>
          <span>Save</span>
          <span className="text-orange-400/60">→</span>
          <span className="text-orange-300">Continue</span>
        </div>
      )}
    </div>
  );
}