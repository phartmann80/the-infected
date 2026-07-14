import { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './types';

export default class XAIProvider implements ImageProvider {
  readonly id = 'xai';
  readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.XAI_BASE_URL || 'https://api.x.ai/v1';
    this.apiKey = process.env.XAI_API_KEY || '';
    this.model = process.env.XAI_IMAGE_MODEL || 'grok-imagine-image-quality';
  }

  async validateConfiguration(): Promise<void> {
    if (!this.apiKey) throw new Error('XAI API key not set in XAI_API_KEY');
  }

  async estimateCost(request: ImageGenerationRequest): Promise<number | null> {
    if (this.model.includes('quality')) return 0.05 * (request.count || 1);
    return 0.02 * (request.count || 1);
  }

  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    if (!this.apiKey) throw new Error('XAI API key missing');
    // Log request model for traceability before throwing
    void request.model;
    throw new Error('Live generation disabled in this environment by default. Use dry-run or enable explicitly.');
  }
}
