import PageShell from '@/components/PageShell';
import { PageHeader } from '@/components/shared';
import { EarlyAccessForm } from '@/components/EarlyAccessForm';

export const metadata = { title: 'Early Access' };

export default function EarlyAccessPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Early Access"
        title="Join the Outbreak"
        description="Follow the development. Get build updates, new infected reveals, and the first playable prototype."
        image="/assets/cinematic/infected-001-v3-portrait.png"
        imageAlt="Infected portrait"
      />

      <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-orange-200/15 bg-[#0a0a09] p-6 sm:p-8">
            <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.38em] text-orange-100/65">
              <span className="h-px w-8 bg-orange-300/70" aria-hidden />
              Registration
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em] text-white">Leave your signal.</h2>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              The registration contract is defined, but this preview keeps persistence closed until privacy, contact, retention, and deployment review are complete.
            </p>
            <div className="mt-8">
              <EarlyAccessForm
                idPrefix="early-access-page"
                source="landing"
                heading="Register for early access"
                registrationEnabled={false}
                description="The form is ready for the reviewed backend. This preview returns an unavailable state and stores nothing while registration is closed."
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Build Updates', desc: 'Get notified when new APK builds are available.' },
              { label: 'Infected Reveals', desc: 'See new infected types before they go public.' },
              { label: 'First Playable', desc: 'Be among the first to play the prototype.' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-[#0a0a09] p-5">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-orange-100/60">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-stone-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}