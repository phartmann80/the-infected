import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-5 py-10 text-stone-200 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100/70 hover:text-white">← Return to The Infected</Link>
        <p className="mt-16 text-xs uppercase tracking-[0.42em] text-orange-100/60">Project / Contact</p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-0.07em] text-white">Stay in contact</h1>
        <div className="mt-8 space-y-6 text-lg leading-8 text-stone-400">
          <p>The Infected is in active development. Until the public support channel is established, project questions and issue reports can be submitted through the authoritative repository.</p>
          <p><a className="text-orange-100 underline decoration-orange-100/30 underline-offset-4 hover:text-white" href="https://github.com/phartmann80/the-infected/issues">Open the project issue tracker</a></p>
          <p>Do not submit passwords, private keys, payment details, or other sensitive information through an issue.</p>
        </div>
      </div>
    </main>
  );
}
