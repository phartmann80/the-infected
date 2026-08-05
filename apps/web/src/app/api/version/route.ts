import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      project: 'the-infected',
      source: 'github-server',
      repository: 'phartmann80/the-infected',
      commit: process.env.DEPLOY_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      builtAt: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}