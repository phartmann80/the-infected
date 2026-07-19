import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { ImageGenerationRequest, ImageGenerationResult, ImageProvider } from './types';

type JsonRecord = Record<string, unknown>;

const DEFAULT_BASE_URL = 'https://api.muapi.ai/api/v1';
const DEFAULT_POLL_INTERVAL_MS = 3000;
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function endpointUrl(baseUrl: string, endpoint: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
}

function modelEndpoint(model: string): string {
  const aliases: Record<string, string> = {
    'flux-dev': 'flux-dev-image',
    'flux-schnell': 'flux-schnell-image',
    grok: 'grok-imagine-text-to-image',
  };
  return aliases[model] || model;
}

function aspectDimensions(resolution: number, aspectRatio: string | undefined): { width: number; height: number } {
  const match = aspectRatio?.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return { width: resolution, height: resolution };

  const widthRatio = Number(match[1]);
  const heightRatio = Number(match[2]);
  if (!widthRatio || !heightRatio) return { width: resolution, height: resolution };
  return { width: resolution, height: Math.max(1, Math.round(resolution * heightRatio / widthRatio)) };
}

function outputUrl(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (!isRecord(value)) return null;
  for (const key of ['url', 'image_url', 'file_url', 'value']) {
    const url = stringValue(value[key]);
    if (url) return url;
  }
  return null;
}

function outputUrls(result: JsonRecord): string[] {
  const values = result.outputs ?? result.output ?? result.image_url;
  const items = Array.isArray(values) ? values : values == null ? [] : [values];
  return items.map(outputUrl).filter((url): url is string => !!url);
}

function extensionFor(contentType: string | null, outputUrlValue: string): string {
  const byContentType: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  if (contentType && byContentType[contentType.toLowerCase()]) return byContentType[contentType.toLowerCase()];
  try {
    const extension = path.extname(new URL(outputUrlValue).pathname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(extension)) return extension;
  } catch {
    // Use a safe generic extension below.
  }
  return '.png';
}

function safeRequestId(requestId: string): string {
  return requestId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'request';
}

async function sleep(milliseconds: number): Promise<void> {
  if (milliseconds <= 0) return;
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

export default class MuAPIProvider implements ImageProvider {
  readonly id = 'muapi';
  readonly model: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    // MUAPI_API is retained for compatibility with the current project env file.
    this.apiKey = process.env.MUAPI_API_KEY || process.env.MUAPI_API || '';
    this.baseUrl = process.env.MUAPI_BASE_URL || DEFAULT_BASE_URL;
    this.model = process.env.MUAPI_IMAGE_MODEL || process.env.IMAGE_MODEL || 'flux-dev-image';
  }

  async validateConfiguration(): Promise<void> {
    if (!this.apiKey) throw new Error('MuAPI API key not set in MUAPI_API_KEY or MUAPI_API');
  }

  async estimateCost(request: ImageGenerationRequest): Promise<number | null> {
    void request;
    const configuredValue = process.env.MUAPI_ESTIMATED_COST_USD?.trim();
    if (!configuredValue) return null;
    const configured = Number(configuredValue);
    return Number.isFinite(configured) && configured >= 0 ? configured : null;
  }

  private async requestJson(url: string, init: RequestInit): Promise<JsonRecord> {
    const response = await fetch(url, init);
    const text = await response.text();
    let parsed: unknown = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = null; }
    if (!response.ok) throw new Error(`MuAPI request failed with HTTP ${response.status}.`);
    if (!isRecord(parsed)) throw new Error('MuAPI returned an invalid JSON response.');
    return parsed;
  }

  private async uploadReference(referencePath: string): Promise<string> {
    const bytes = await fs.readFile(referencePath);
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(bytes)]), path.basename(referencePath));
    const response = await fetch(endpointUrl(this.baseUrl, 'upload_file'), {
      method: 'POST',
      headers: { 'x-api-key': this.apiKey },
      body: form,
    });
    if (!response.ok) throw new Error(`MuAPI reference upload failed with HTTP ${response.status}.`);
    const data: unknown = await response.json();
    if (isRecord(data)) {
      for (const key of ['url', 'file_url', 'upload_url']) {
        const url = stringValue(data[key]);
        if (url) return url;
      }
      if (isRecord(data.data)) {
        for (const key of ['url', 'file_url', 'upload_url']) {
          const url = stringValue(data.data[key]);
          if (url) return url;
        }
      }
    }
    throw new Error('MuAPI reference upload returned no file URL.');
  }

  private async waitForResult(requestId: string): Promise<JsonRecord> {
    const pollInterval = Math.max(0, Number(process.env.MUAPI_POLL_INTERVAL_MS || DEFAULT_POLL_INTERVAL_MS));
    const timeout = Math.max(1000, Number(process.env.MUAPI_TIMEOUT_MS || DEFAULT_TIMEOUT_MS));
    const deadline = Date.now() + timeout;
    while (Date.now() <= deadline) {
      const result = await this.requestJson(
        endpointUrl(this.baseUrl, `predictions/${encodeURIComponent(requestId)}/result`),
        { headers: { 'x-api-key': this.apiKey } },
      );
      const status = (stringValue(result.status) || '').toLowerCase();
      if (outputUrls(result).length > 0 && (!status || ['completed', 'succeeded', 'success', 'done'].includes(status))) return result;
      if (['failed', 'error', 'cancelled', 'canceled'].includes(status)) throw new Error('MuAPI image generation failed.');
      await sleep(pollInterval);
    }
    throw new Error(`MuAPI image generation timed out after ${timeout}ms.`);
  }

  private async downloadOutput(url: string, outputDirectory: string, filenameBase: string): Promise<{ path: string; hash: string }> {
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); } catch { throw new Error('MuAPI returned an invalid output URL.'); }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('MuAPI returned an unsupported output URL scheme.');
    const response = await fetch(parsedUrl);
    if (!response.ok) throw new Error(`MuAPI output download failed with HTTP ${response.status}.`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const extension = extensionFor(response.headers.get('content-type')?.split(';')[0] || null, url);
    const filePath = path.join(outputDirectory, `${filenameBase}${extension}`);
    await fs.writeFile(filePath, buffer);
    return { path: filePath, hash: crypto.createHash('sha256').update(buffer).digest('hex') };
  }

  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
    await this.validateConfiguration();
    if (!request.output_directory) throw new Error('MuAPI provider requires request.output_directory.');
    await fs.mkdir(request.output_directory, { recursive: true });
    const payload: JsonRecord = {
      prompt: request.prompt,
      num_images: request.count || 1,
      aspect_ratio: request.aspect_ratio || '16:9',
    };
    if (request.reference_image_path) {
      const referenceUrl = /^https?:\/\//i.test(request.reference_image_path)
        ? request.reference_image_path
        : await this.uploadReference(request.reference_image_path);
      const referenceField = process.env.MUAPI_IMAGE_REFERENCE_FIELD || 'images_list';
      payload[referenceField] = referenceField === 'image_url' ? referenceUrl : [referenceUrl];
    }
    const endpoint = modelEndpoint(process.env.MUAPI_IMAGE_ENDPOINT || this.model);
    const submission = await this.requestJson(endpointUrl(this.baseUrl, endpoint), {
      method: 'POST',
      headers: { 'x-api-key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const requestId = stringValue(submission.request_id) || stringValue(submission.id);
    const result = requestId ? await this.waitForResult(requestId) : submission;
    const urls = outputUrls(result);
    if (urls.length === 0) throw new Error('MuAPI returned no image outputs.');
    const dimensions = aspectDimensions(request.resolution || 1024, request.aspect_ratio);
    const returnedImages: ImageGenerationResult['returned_images'] = [];
    const base = safeRequestId(requestId || `completed-${Date.now()}`);
    for (const [index, url] of urls.entries()) {
      const downloaded = await this.downloadOutput(url, request.output_directory, `muapi_${base}_${index + 1}`);
      returnedImages.push({ ...downloaded, width: dimensions.width, height: dimensions.height });
    }
    return {
      asset_id: `muapi_${base}`,
      provider: this.id,
      model: endpoint,
      returned_images: returnedImages,
      provider_request_id: requestId || undefined,
      cost: numberValue(result.cost) ?? numberValue(result.price) ?? numberValue(result.total_cost),
    };
  }
}
