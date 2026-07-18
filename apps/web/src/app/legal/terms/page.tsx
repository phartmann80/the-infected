import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'Prototype terms of use for The Infected landing page and pre-release development preview, pending final review.',
  alternates: { canonical: '/legal/terms' },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      activePage="terms"
      eyebrow="Legal / Terms"
      title="Terms of use"
      summary="The Infected landing page is a private prototype preview. Availability, imagery, game systems, and Android plans can change before release."
    >
      <section aria-labelledby="terms-preview-heading">
        <h2 id="terms-preview-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Prototype access</h2>
        <p className="mt-4">This site presents work in progress. It does not promise a release date, final feature set, product availability, or compatibility with any particular device.</p>
      </section>
      <section aria-labelledby="terms-content-heading">
        <h2 id="terms-content-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Project content</h2>
        <p className="mt-4">Cinematic media, gameplay descriptions, character studies, environments, and system details may change as the project moves through review. Internal-review and prototype labels are part of the content boundary.</p>
      </section>
      <section aria-labelledby="terms-release-heading">
        <h2 id="terms-release-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Before public distribution</h2>
        <p className="mt-4">Final terms will be reviewed and published before public distribution. Nothing on this preview should be treated as a purchase offer, service commitment, or final game specification.</p>
      </section>
    </LegalPageShell>
  );
}
