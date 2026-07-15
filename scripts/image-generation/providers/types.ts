export interface ImageGenerationRequest {
  provider: string;
  model: string;
  prompt: string;
  negative_prompt?: string;
  reference_image_path?: string;
  resolution?: number;
  aspect_ratio?: string;
  count?: number;
  intended_use?: string;
  output_directory?: string;
}

export interface ImageGenerationResult {
  asset_id: string;
  provider: string;
  model: string;
  returned_images: Array<{ path: string; hash: string; width: number; height: number }>;
  provider_request_id?: string;
  seed?: string | number;
  cost?: number | null;
}

export interface ImageProvider {
  readonly id: string;
  readonly model: string;

  validateConfiguration(): Promise<void>;
  estimateCost(request: ImageGenerationRequest): Promise<number | null>;
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResult>;
}
