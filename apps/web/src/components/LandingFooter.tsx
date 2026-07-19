type LandingFooterProps = {
  onJoin: () => void;
};

export function LandingFooter({ onJoin }: LandingFooterProps) {
  return (
    <footer id="footer" className="border-t border-white/10 bg-[#030405] px-5 py-10 text-stone-400 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a href="#arrival" className="text-sm font-black uppercase tracking-[0.3em] text-white transition hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200/70">
              The Infected
            </a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">A cinematic 3D survival experience for Android. The world is still in production.</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-[0.18em]">
            <a href="#chapters" className="transition hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200/70">Chapters</a>
            <a href="#field-manual" className="transition hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200/70">Field manual</a>
            <a href="#arrival" className="transition hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200/70">Back to arrival</a>
            <button type="button" onClick={onJoin} className="text-left transition hover:text-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200/70">Join the survivors</button>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-4 text-[0.68rem] uppercase tracking-[0.2em] text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <span>Prototype landing page / production in progress</span>
          <span>Early-access submissions are not stored</span>
        </div>
      </div>
    </footer>
  );
}
