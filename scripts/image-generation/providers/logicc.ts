import { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './types';

export default class LogiccProvider implements ImageProvider {
  readonly id = 'logicc';
  readonly model = 'logicc-default';

  async validateConfiguration(): Promise<void> {
    // confirm API keys exist in real implementation
  }

  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    void request.model;
    throw new Error('Logicc live generation not implemented in stub. Use dry-run.');
  }

  async estimateCost(request: ImageGenerationRequest): Promise<number | null> {
    void request.provider;
    return null; // subscription-based, cannot estimate generically
  }
}
