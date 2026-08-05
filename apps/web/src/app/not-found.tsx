import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#060606] px-6 text-center">
      <div className="mb-8">
        <span className="text-7xl font-black uppercase tracking-tighter text-orange-100/20 sm:text-9xl">404</span>
      </div>
      <h1 className="mb-4 text-2xl font-bold uppercase tracking-[0.2em] text-white sm:text-3xl">
        Area Unreachable
      </h1>
      <p className="mb-8 max-w-md text-sm text-stone-400">
        The sector you are trying to reach has been overrun or does not exist.
        Return to safe ground.
      </p>
      <Link
        href="/"
        className="rounded-full border border-orange-200/30 bg-orange-100/10 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-100 transition hover:bg-orange-100/20"
      >
        Return to Base
      </Link>
    </div>
  );
}
