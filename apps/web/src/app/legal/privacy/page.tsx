import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-5 py-16 text-stone-200 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <Link className="text-xs uppercase tracking-[0.2em] text-orange-200" href="/">Back to The Infected</Link>
        <p className="mt-16 text-xs uppercase tracking-[0.42em] text-orange-100/60">Legal / Privacy</p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.07em] text-white">Privacy notice</h1>
        <div className="mt-8 space-y-6 text-lg leading-8 text-stone-400">
          <p>The Early Access form is feature-flagged closed in this preview, so no registration is currently stored. When enabled after review, it will collect the email address, consent timestamp, and the page source that submitted the form.</p>
          <p>Records are stored outside the Git checkout in the server application-data directory and are used only for development updates and Early Access communication. The implementation does not expose submitted addresses in API responses.</p>
          <p>Final retention, deletion, and private data-request contact details must be published before public registration is enabled. This notice remains a product contract draft until that review is complete.</p>
        </div>
      </article>
    </main>
  );
}
