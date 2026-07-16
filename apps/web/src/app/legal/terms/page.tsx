import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-5 py-16 text-stone-200 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <Link className="text-xs uppercase tracking-[0.2em] text-orange-200" href="/">Back to The Infected</Link>
        <p className="mt-16 text-xs uppercase tracking-[0.42em] text-orange-100/60">Legal / Terms</p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.07em] text-white">Terms of use</h1>
        <p className="mt-8 text-lg leading-8 text-stone-400">The Infected landing page is a private prototype preview. Availability, imagery, game systems, and Android plans can change before release. Final terms will be reviewed and published before public distribution.</p>
      </article>
    </main>
  );
}
