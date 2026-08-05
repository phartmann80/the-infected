import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      project: 'the-infected',
      source: 'github-vercel',
      repository: 'phartmann80/the-infected',
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      builtAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
