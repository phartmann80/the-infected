import PageShell from '@/components/PageShell';
import { PageHeader, SectionMarker } from '@/components/shared';
import { LazyVideo, ScrollReveal } from '@/components/animation/CinematicMotion';

const storyBeats = [
  { time: 'Day 0', title: 'The Signal', text: 'A distress signal from the city. One channel. One voice. It says: come.' },
  { time: 'Day 1', title: 'The Arrival', text: 'The road is blocked. The checkpoint is abandoned. The city is silent.' },
  { time: 'Day 3', title: 'First Contact', text: 'They were people. Now they are not. They move fast and they do not stop.' },
  { time: 'Day 7', title: 'The Relay', text: 'The signal leads deeper. Every level brings you closer to the source.' },
  { time: 'Day ?', title: 'The Source', text: 'What waits at the end is not what you expect. The truth is the hardest thing to survive.' },
];

export const metadata = { title: 'Story' };

export default function StoryPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Story"
        title="The Outbreak"
        description="A signal. A city. A choice. The Infected is a survival horror game about what you do when the world stops answering."
        videoSrc="/assets/cinematic/env/env-ruined-street.mp4"
        poster="/assets/cinematic/env/env-ruined-street.jpg"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Story beats — visual timeline */}
          {storyBeats.map((beat, i) => (
            <ScrollReveal key={beat.time} delay={i * 0.05}>
              <div className="relative pl-8 sm:pl-12">
                {/* Timeline line */}
                {i < storyBeats.length - 1 && (
                  <div className="absolute left-3 top-8 h-full w-px bg-gradient-to-b from-orange-200/30 to-transparent sm:left-4" aria-hidden />
                )}
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-orange-200/30 bg-[#060606] sm:h-8 sm:w-8">
                  <div className="absolute inset-1.5 rounded-full bg-orange-500/20" />
                </div>
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-orange-100/50">{beat.time}</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white sm:text-3xl">{beat.title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-400 sm:text-base">{beat.text}</p>
              </div>
            </ScrollReveal>
          ))}

          {/* Environment video */}
          <ScrollReveal>
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-white/10">
              <LazyVideo
                srcMp4="/assets/cinematic/env/env-quarantine-checkpoint.mp4"
                srcWebm="/assets/cinematic/env/env-quarantine-checkpoint.webm"
                poster="/assets/cinematic/env/env-quarantine-checkpoint.jpg"
                className="absolute inset-0 h-full w-full"
                overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent"
              />
              <div className="absolute bottom-4 left-5">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-orange-100/50">The Quarantine Zone</p>
                <p className="mt-1 text-sm font-bold text-white">Where the line was drawn. And crossed.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageShell>
  );
}