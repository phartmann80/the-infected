import { NextResponse } from 'next/server';
import { consumeRateLimit, isEarlyAccessEnabled, normalizeEmail, normalizeSource, registerEarlyAccess } from '@/lib/early-access';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function response(body: Record<string, string>, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requestKey(request: Request) {
  return request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

export async function POST(request: Request) {
  if (!isEarlyAccessEnabled()) {
    return response({ error: 'registration_unavailable', message: 'Early Access registration is not open.' }, 503);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return response({ error: 'unsupported_media_type', message: 'Use application/json.' }, 415);
  }

  if (!consumeRateLimit(requestKey(request))) {
    return response({ error: 'rate_limited', message: 'Try again later.' }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return response({ error: 'invalid_request', message: 'Request body must be valid JSON.' }, 400);
  }

  if (!isRecord(payload) || payload.consent !== true) {
    return response({ error: 'invalid_request', message: 'A valid email and consent are required.' }, 400);
  }

  const email = normalizeEmail(payload.email);
  if (!email) {
    return response({ error: 'invalid_request', message: 'A valid email and consent are required.' }, 400);
  }

  try {
    await registerEarlyAccess(email, normalizeSource(payload.source));
    return response({ status: 'accepted' }, 202);
  } catch (error) {
    console.error('Early Access storage unavailable.', { code: (error as NodeJS.ErrnoException).code ?? 'unknown' });
    return response({ error: 'storage_unavailable', message: 'Registration is temporarily unavailable.' }, 503);
  }
}
