import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './scripts/image-generation/tests/global-setup.ts',
  },
});
