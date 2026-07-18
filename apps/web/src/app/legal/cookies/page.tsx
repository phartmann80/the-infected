import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/LegalPageShell';

export const metadata: Metadata = {
  title: 'Cookie notice',
  description: 'Prototype cookie notice for The Infected website capabilities and future consent review.',
  alternates: { canonical: '/legal/cookies' },
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      activePage="cookies"
      eyebrow="Legal / Cookies"
      title="Cookie notice"
      summary="This private prototype preview keeps storage intentionally limited. Analytics and marketing storage remain disabled pending a documented consent review."
    >
      <section aria-labelledby="cookies-current-heading">
        <h2 id="cookies-current-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Current preview behavior</h2>
        <p className="mt-4">This private prototype preview does not currently use advertising cookies or third-party tracking cookies. The site may use browser capabilities required to play media and remember temporary interface state during a visit.</p>
      </section>
      <section aria-labelledby="cookies-future-heading">
        <h2 id="cookies-future-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Future storage</h2>
        <p className="mt-4">Analytics and marketing storage will not be enabled without a documented purpose, consent behavior, retention period, and an updated privacy notice.</p>
      </section>
      <section aria-labelledby="cookies-review-heading">
        <h2 id="cookies-review-heading" className="text-2xl font-black uppercase tracking-[-0.04em] text-white">Review status</h2>
        <p className="mt-4">This notice is a prototype surface and will be reviewed before public launch.</p>
      </section>
    </LegalPageShell>
  );
}
