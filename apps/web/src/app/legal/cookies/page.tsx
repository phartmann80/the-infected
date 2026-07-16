import Link from 'next/link';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-5 py-10 text-stone-200 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100/70 hover:text-white">← Return to The Infected</Link>
        <p className="mt-16 text-xs uppercase tracking-[0.42em] text-orange-100/60">Legal / Cookies</p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.07em] text-white">Cookie notice</h1>
        <div className="mt-8 space-y-6 text-lg leading-8 text-stone-400">
          <p>This private prototype preview does not currently use advertising cookies or third-party tracking cookies. The site may use browser capabilities required to play media and remember temporary interface state during a visit.</p>
          <p>Analytics and marketing storage will not be enabled without a documented purpose, consent behavior, retention period, and an updated privacy notice.</p>
          <p>This notice is a prototype surface and will be reviewed before public launch.</p>
        </div>
      </div>
    </main>
  );
}
