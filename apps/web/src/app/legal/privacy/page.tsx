import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'Prototype privacy notice for The Infected Early Access registration flow, pending final public review.',
  alternates: { canonical: '/legal/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      activePage="privacy"
      eyebrow="Legal / Privacy"
      title="Privacy notice"
      summary="This draft explains the intended Early Access data boundary. Public registration remains closed until the retention, deletion, and support process is reviewed."
    >
      <section aria-labelledby="privacy-collection-heading">
        <h2 id="privacy-collection-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">What the preview collects</h2>
        <p className="mt-4">The Early Access form is feature-flagged closed in this preview, so no registration is currently stored. When enabled after review, it will collect the email address, consent timestamp, and the page source that submitted the form.</p>
      </section>
      <section aria-labelledby="privacy-use-heading">
        <h2 id="privacy-use-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">How the data is intended to be used</h2>
        <p className="mt-4">Records are stored outside the Git checkout in the server application-data directory and are used only for development updates and Early Access communication. The implementation does not expose submitted addresses in API responses.</p>
      </section>
      <section aria-labelledby="privacy-review-heading">
        <h2 id="privacy-review-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Before registration opens</h2>
        <p className="mt-4">Final retention, deletion, and private data-request contact details must be published before public registration is enabled. This notice remains a product contract draft until that review is complete.</p>
      </section>
    </LegalPageShell>
  );
}
