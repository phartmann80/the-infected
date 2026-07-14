// logicc.ts - provider adapter for Logicc (stubbed)
import { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './types';

export default class LogiccProvider implements ImageProvider {
  constructor(){
    // read env vars in real impl
  }
  async validateConfiguration(): Promise<void> {
    // confirm API keys exist
  }
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    throw new Error('Logicc live generation not implemented in stub. Use dry-run.');
  }
  async estimateCost(request: ImageGenerationRequest): Promise<number | null> {
    return null; // subscription-based, cannot estimate generically
  }
}
