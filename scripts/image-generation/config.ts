export const config = {
  defaultProvider: process.env.IMAGE_PROVIDER || 'xai',
  defaultModel: process.env.IMAGE_MODEL || 'grok-imagine-image-quality',
  defaultResolution: Number(process.env.IMAGE_OUTPUT_RESOLUTION || 1024),
  allowedProviders: ['xai','logicc']
}
