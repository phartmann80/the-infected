import Image from 'next/image';
import Link from 'next/link';

export type RegistryStatus = 'approved' | 'prototype' | 'placeholder' | 'blocked' | 'internal-review' | 'planned' | 'in-development';

const statusStyles: Record<RegistryStatus, string> = {
  approved: 'border-green-200/30 bg-green-100/10 text-green-100',
  prototype: 'border-orange-200/30 bg-orange-100/10 text-orange-100',
  placeholder: 'border-stone-200/20 bg-stone-100/5 text-stone-100/70',
  blocked: 'border-red-200/30 bg-red-100/10 text-red-100',
  'internal-review': 'border-orange-200/30 bg-orange-100/10 text-orange-100',
  planned: 'border-slate-200/20 bg-slate-100/5 text-slate-100/80',
  'in-development': 'border-amber-200/20 bg-amber-100/5 text-amber-100/80',
};

const statusLabels: Record<RegistryStatus, string> = {
  approved: 'Available',
  prototype: 'Playable',
  placeholder: 'Coming Soon',
  blocked: 'Coming Soon',
  'internal-review': 'In Development',
  planned: 'Planned',
  'in-development': 'In Development',
};

export function StatusBadge({ status }: { status: RegistryStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function SectionMarker({ chapter, eyebrow, title, description, headingId }: { chapter?: string; eyebrow: string; title: string; description?: string; headingId?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
        <span className="h-px w-8 bg-orange-300/70" aria-hidden />
        {chapter ? `${chapter} / ` : ''}{eyebrow}
      </p>
      <h2 id={headingId} className="mt-5 text-4xl font-black uppercase leading-[0.92] tracking-[-0.07em] text-white sm:text-5xl lg:text-6xl">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">{description}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, image, imageAlt, videoSrc, poster }: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  videoSrc?: string;
  poster?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/10">
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : image ? (
        <div className="absolute inset-0">
          <Image src={image} alt={imageAlt ?? ''} fill priority sizes="100vw" className="object-cover opacity-30" />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/60 via-[#060606]/80 to-[#030405]" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
          <span className="h-px w-8 bg-orange-300/70" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">{title}</h1>
        {description && <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">{description}</p>}
      </div>
    </header>
  );
}

export function BackLink({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-orange-100">
      <span aria-hidden>←</span> Back to hub
    </Link>
  );
}