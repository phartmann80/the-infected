import PageShell from '@/components/PageShell';
import { PageHeader, StatusBadge, SectionMarker } from '@/components/shared';
import { LazyVideo } from '@/components/animation/CinematicMotion';
import { SmokeOverlay, EmergencyLights, AnimatedWaveform } from '@/components/animation/CinematicMotion';

const storyBeats = [
  { number: '01', label: 'The first silence', title: 'The city stopped answering.', description: 'Sirens became static. The emergency network kept repeating one location after every other channel went dark.' },
  { number: '02', label: 'The change', title: 'The streets learned to move.', description: 'Something crossed the quarantine line. The people who stayed behind stopped behaving like people.' },
  { number: '03', label: 'The signal', title: 'One transmission remains.', description: 'A weak pulse is still coming from inside the dead zone. Following it means leaving the last safe room behind.' },
];

export const metadata = { title: 'Story — The Outbreak' };

export default function StoryPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="The Outbreak"
        title="Story"
        description="The world went quiet before it fell. This is how it started."
        videoSrc="/assets/cinematic/env/env-ruined-street.mp4"
        poster="/assets/cinematic/env/env-ruined-street.jpg"
      />

      <div className="relative px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <SmokeOverlay className="pointer-events-none absolute inset-0 z-0 opacity-30" />
        <EmergencyLights className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1" />

        <div className="relative mx-auto max-w-7xl">
          {/* Story beats */}
          <div className="space-y-12">
            {storyBeats.map((beat) => (
              <div key={beat.number} className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
                <div className="flex lg:flex-col lg:items-start">
                  <span className="text-6xl font-black leading-none tracking-[-0.08em] text-orange-100/20 sm:text-8xl">{beat.number}</span>
                </div>
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-orange-100/60">{beat.label}</p>
                  <h2 className="mt-3 text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">{beat.title}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">{beat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency broadcast */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-[#0a0a09] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-red-200/30 bg-red-100/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-red-100">
                Emergency Broadcast
              </span>
              <AnimatedWaveform bars={16} className="flex-1" />
            </div>
            <p className="mt-6 text-sm leading-7 text-stone-300">
              &quot;This is a priority emergency transmission. The quarantine line has been breached. All remaining personnel are advised to seek shelter immediately. Do not approach individuals displaying signs of infection. The signal source has been identified. Follow it. Do not stop.&quot;
            </p>
            <p className="mt-4 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-stone-500">Transmission repeats. Signal degrading.</p>
          </div>

          {/* Environment video */}
          <div className="mt-12">
            <div className="relative aspect-[21/9] overflow-hidden rounded-[1.5rem] border border-white/8 sm:aspect-[16/6]">
              <LazyVideo
                srcMp4="/assets/cinematic/env/env-quarantine-checkpoint.mp4"
                srcWebm="/assets/cinematic/env/env-quarantine-checkpoint.webm"
                poster="/assets/cinematic/env/env-quarantine-checkpoint.jpg"
                className="absolute inset-0 h-full w-full"
                overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]/40"
              />
              <div className="absolute bottom-4 left-5 z-10 sm:bottom-6 sm:left-8">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-orange-100/50">Environment / Quarantine checkpoint</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-[-0.03em] text-white/70 sm:text-base">The line did not hold.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}