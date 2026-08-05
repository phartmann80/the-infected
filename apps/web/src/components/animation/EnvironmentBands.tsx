'use client';

import { LazyVideo } from './CinematicMotion';

type EnvBandProps = {
  mp4: string;
  webm: string;
  poster: string;
  label: string;
  caption: string;
};

function EnvBand({ mp4, webm, poster, label, caption }: EnvBandProps) {
  return (
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <div className="relative aspect-[21/9] overflow-hidden rounded-[1.5rem] border border-white/8 sm:aspect-[16/6]">
        <LazyVideo
          srcMp4={mp4}
          srcWebm={webm}
          poster={poster}
          className="absolute inset-0 h-full w-full"
          overlayClassName="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]/40"
        />
        <div className="absolute bottom-4 left-5 z-10 sm:bottom-6 sm:left-8">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-orange-100/50">{label}</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-[-0.03em] text-white/70 sm:text-base">{caption}</p>
        </div>
      </div>
    </div>
  );
}

/* Environmental video bands placed between major chapters */
export function EnvironmentBands() {
  return (
    <>
      {/* Between story and world/survivors */}
      <div className="py-8">
        <EnvBand
          mp4="/assets/cinematic/env/env-ruined-street.mp4"
          webm="/assets/cinematic/env/env-ruined-street.webm"
          poster="/assets/cinematic/env/env-ruined-street.jpg"
          label="Environment / Ruined district"
          caption="The streets stopped being streets."
        />
      </div>

      {/* Between survivors and infected */}
      <div className="py-8">
        <EnvBand
          mp4="/assets/cinematic/env/env-quarantine-checkpoint.mp4"
          webm="/assets/cinematic/env/env-quarantine-checkpoint.webm"
          poster="/assets/cinematic/env/env-quarantine-checkpoint.jpg"
          label="Environment / Quarantine line"
          caption="Nobody left. Nobody got in."
        />
      </div>

      {/* Between infected and arsenal */}
      <div className="py-8">
        <EnvBand
          mp4="/assets/cinematic/env/env-abandoned-building.mp4"
          webm="/assets/cinematic/env/env-abandoned-building.webm"
          poster="/assets/cinematic/env/env-abandoned-building.jpg"
          label="Environment / Abandoned interior"
          caption="Every room has a story you do not want to read."
        />
      </div>

      {/* Between gear and combat */}
      <div className="py-8">
        <EnvBand
          mp4="/assets/cinematic/env/env-industrial-zone.mp4"
          webm="/assets/cinematic/env/env-industrial-zone.webm"
          poster="/assets/cinematic/env/env-industrial-zone.jpg"
          label="Environment / Industrial zone"
          caption="The machines kept running after the people stopped."
        />
      </div>

      {/* Between combat and audio/android */}
      <div className="py-8">
        <EnvBand
          mp4="/assets/cinematic/env/env-underground-tunnel.mp4"
          webm="/assets/cinematic/env/env-underground-tunnel.webm"
          poster="/assets/cinematic/env/env-underground-tunnel.jpg"
          label="Environment / Underground"
          caption="The signal comes from below."
        />
      </div>
    </>
  );
}