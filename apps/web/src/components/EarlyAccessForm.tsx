'use client';

import Link from 'next/link';
import { forwardRef, useId, useState } from 'react';

type EarlyAccessSource = 'hero' | 'landing';
type SignupStatus = 'idle' | 'submitting' | 'success' | 'error' | 'unavailable';

type EarlyAccessFormProps = {
  idPrefix: string;
  source: EarlyAccessSource;
  heading: string;
  description: string;
  className?: string;
  onCancel?: () => void;
};

function getStatusMessage(status: SignupStatus) {
  switch (status) {
    case 'submitting':
      return { text: 'Sending registration…', role: 'status' as const };
    case 'success':
      return { text: 'Registration received. Watch for the next transmission.', role: 'status' as const };
    case 'error':
      return { text: 'Enter a valid email and agree to the Privacy notice.', role: 'alert' as const };
    case 'unavailable':
      return { text: 'Early Access registration is not open in this preview.', role: 'alert' as const };
    default:
      return null;
  }
}

export const EarlyAccessForm = forwardRef<HTMLInputElement, EarlyAccessFormProps>(function EarlyAccessForm(
  { idPrefix, source, heading, description, className = '', onCancel },
  emailRef,
) {
  const reactId = useId().replace(/:/g, '');
  const emailId = `${idPrefix}-${reactId}-email`;
  const consentId = `${idPrefix}-${reactId}-consent`;
  const statusId = `${idPrefix}-${reactId}-status`;
  const headingId = `${idPrefix}-signup-title`;
  const descriptionId = `${idPrefix}-signup-description`;
  const [status, setStatus] = useState<SignupStatus>('idle');
  const statusMessage = getStatusMessage(status);

  async function submitSignup(formData: FormData) {
    const email = String(formData.get('email') ?? '').trim();
    const consent = formData.get('consent') === 'on';
    if (!/^\S+@\S+\.\S+$/.test(email) || !consent) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, source }),
      });
      if (response.status === 503) {
        setStatus('unavailable');
        return;
      }
      if (!response.ok) {
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setStatus('unavailable');
    }
  }

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        void submitSignup(new FormData(event.currentTarget));
      }}
      aria-describedby={statusMessage ? `${descriptionId} ${statusId}` : descriptionId}
    >
      <h2 id={headingId} className="text-2xl font-black uppercase tracking-[-0.04em] text-white">{heading}</h2>
      <p id={descriptionId} className="mt-3 text-sm leading-6 text-stone-300">{description}</p>
      <label className="mt-5 block text-xs font-bold uppercase tracking-[0.2em] text-stone-400" htmlFor={emailId}>Email</label>
      <input
        id={emailId}
        ref={emailRef}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="survivor@example.com"
        aria-invalid={status === 'error' ? true : undefined}
        className="mt-2 min-h-12 w-full rounded-2xl border border-white/14 bg-white/8 px-4 text-white outline-none placeholder:text-stone-600 focus:ring-2 focus:ring-orange-300"
      />
      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-stone-400" htmlFor={consentId}>
        <input id={consentId} name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-orange-400" />
        <span>I agree to receive development updates and have read the <Link className="text-orange-100 underline underline-offset-4" href="/legal/privacy">Privacy notice</Link>.</span>
      </label>
      {statusMessage && <p id={statusId} className={`mt-4 text-sm ${status === 'success' ? 'text-orange-200' : status === 'submitting' ? 'text-stone-300' : 'text-red-300'}`} role={statusMessage.role}>{statusMessage.text}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={status === 'submitting'} className="min-h-11 rounded-full bg-orange-500 px-5 text-sm font-black uppercase tracking-[0.16em] text-black disabled:cursor-wait disabled:opacity-60">Submit</button>
        {onCancel && <button type="button" onClick={onCancel} className="min-h-11 rounded-full border border-white/14 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white" aria-label="Close early access dialog">Close</button>}
      </div>
    </form>
  );
});
