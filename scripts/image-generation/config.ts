import dotenv from 'dotenv';

// Standalone scripts do not run through Next.js, so load the local env files
// explicitly. Existing process environment values still take precedence.
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ path: '.env', quiet: true });

export const config = {
  defaultProvider:
    process.env.IMAGE_PROVIDER ||
    (process.env.MUAPI_API_KEY || process.env.MUAPI_API ? 'muapi' : 'xai'),
  defaultModel: process.env.IMAGE_MODEL || 'grok-imagine-image-quality',
  defaultResolution: Number(process.env.IMAGE_OUTPUT_RESOLUTION || 1024),
  allowedProviders: ['xai', 'logicc', 'muapi'],
}
