import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/image-generation/tests/**/*.test.ts'],
    globalSetup: ['scripts/image-generation/tests/global-setup.ts'],
  },
});
