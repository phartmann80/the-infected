export interface VideoGenerationRequest {
  provider: string;
  model: string;
  prompt: string;
  reference_image_path?: string;
  duration_seconds?: number;
  aspect_ratio?: string;
  output_directory?: string;
}

export interface VideoGenerationResult {
  asset_id: string;
  provider: string;
  model: string;
  returned_videos: Array<{ path: string; hash: string; mime_type: string }>;
  provider_request_id?: string;
  cost?: number | null;
}

export interface VideoProvider {
  readonly id: string;
  readonly model: string;

  validateConfiguration(): Promise<void>;
  estimateCost(request: VideoGenerationRequest): Promise<number | null>;
  generate(request: VideoGenerationRequest): Promise<VideoGenerationResult>;
}
