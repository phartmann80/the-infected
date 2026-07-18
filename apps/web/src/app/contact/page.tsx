import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact and issue-reporting information for The Infected development project.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <LegalPageShell
      activePage="contact"
      eyebrow="Project / Contact"
      title="Stay in contact"
      summary="The Infected is in active development. Until a public support channel is established, project questions and issue reports can be submitted through the authoritative repository."
    >
      <section aria-labelledby="contact-issues-heading">
        <h2 id="contact-issues-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Project questions and issues</h2>
        <p className="mt-4">Use the project issue tracker for development questions, reproducible bugs, and feedback about the preview.</p>
        <p className="mt-5"><a className="inline-flex min-h-11 items-center rounded-full bg-orange-500 px-5 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-200" href="https://github.com/phartmann80/the-infected/issues">Open the issue tracker</a></p>
      </section>
      <section aria-labelledby="contact-safety-heading">
        <h2 id="contact-safety-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Keep reports safe</h2>
        <p className="mt-4">Do not submit passwords, private keys, payment details, or other sensitive information through an issue. A private data-request channel will be published before Early Access registration is enabled.</p>
      </section>
    </LegalPageShell>
  );
}
