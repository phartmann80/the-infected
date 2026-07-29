import type { NextConfig } from 'next';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const nextConfig: NextConfig = {
  transpilePackages: ['@the-infected/game-data', '@the-infected/config'],
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
