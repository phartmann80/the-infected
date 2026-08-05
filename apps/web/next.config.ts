import type { NextConfig } from 'next';
import { execSync } from 'child_process';

let commitSha = process.env.DEPLOY_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '';
if (!commitSha) {
  try {
    commitSha = execSync('git rev-parse HEAD').toString().trim();
  } catch {
    commitSha = 'unknown';
  }
}

const buildTimestamp = process.env.BUILD_TIMESTAMP || new Date().toISOString();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'theinfected.app' },
      { protocol: 'https', hostname: 'www.theinfected.app' },
    ],
  },
  env: {
    DEPLOY_COMMIT_SHA: commitSha,
    BUILD_TIMESTAMP: buildTimestamp,
  },
};

export default nextConfig;