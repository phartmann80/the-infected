import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-5 py-16 text-stone-200 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <Link className="text-xs uppercase tracking-[0.2em] text-orange-200" href="/">Back to The Infected</Link>
        <p className="mt-16 text-xs uppercase tracking-[0.42em] text-orange-100/60">Legal / Privacy</p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.07em] text-white">Privacy notice</h1>
        <p className="mt-8 text-lg leading-8 text-stone-400">This prototype does not currently persist early-access submissions. A final privacy notice, retention policy, and contact address will be published before a production signup backend is enabled.</p>
      </article>
    </main>
  );
}
