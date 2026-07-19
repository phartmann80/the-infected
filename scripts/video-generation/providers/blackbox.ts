import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { VideoGenerationRequest, VideoGenerationResult, VideoProvider } from './types';

type JsonRecord = Record<string, unknown>;

const DEFAULT_BASE_URL = 'https://api.blackbox.ai';
const DEFAULT_VIDEO_MODEL = 'blackboxai/google/veo-3-fast';

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

function extractUrls(value: unknown, depth = 0): string[] {
  if (depth > 5 || value == null) return [];
  if (typeof value === 'string') {
    return [...value.matchAll(/https?:\/\/[^\s"'<>]+/g)]
      .map(match => match[0].replace(/[),.;]+$/, ''));
  }
  if (Array.isArray(value)) return value.flatMap(item => extractUrls(item, depth + 1));
  if (!isRecord(value)) return [];
  return Object.values(value).flatMap(item => extractUrls(item, depth + 1));
}

function extensionFor(contentType: string | null, outputUrl: string): { extension: string; mimeType: string } {
  const byContentType: Record<string, { extension: string; mimeType: string }> = {
    'video/mp4': { extension: '.mp4', mimeType: 'video/mp4' },
    'video/webm': { extension: '.webm', mimeType: 'video/webm' },
    'video/quicktime': { extension: '.mov', mimeType: 'video/quicktime' },
  };
  if (contentType && byContentType[contentType.toLowerCase()]) return byContentType[contentType.toLowerCase()];
  try {
    const extension = path.extname(new URL(outputUrl).pathname).toLowerCase();
    if (extension === '.webm') return { extension, mimeType: 'video/webm' };
    if (extension === '.mov') return { extension, mimeType: 'video/quicktime' };
  } catch {
    // Use MP4 as the safe default.
  }
  return { extension: '.mp4', mimeType: 'video/mp4' };
}

function safeRequestId(requestId: string): string {
  return requestId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'request';
}

function mimeTypeForImage(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.webp') return 'image/webp';
  return 'image/png';
}

async function imageContent(referencePath: string): Promise<{ type: 'image_url'; image_url: { url: string } }> {
  if (/^https?:\/\//i.test(referencePath)) {
    return { type: 'image_url', image_url: { url: referencePath } };
  }
  const bytes = await fs.readFile(referencePath);
  const encoded = Buffer.from(bytes).toString('base64');
  return {
    type: 'image_url',
    image_url: { url: `data:${mimeTypeForImage(referencePath)};base64,${encoded}` },
  };
}

export default class BlackboxVideoProvider implements VideoProvider {
  readonly id = 'blackbox';
  readonly model: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly endpoint: string;

  constructor() {
    this.apiKey = process.env.BLACKBOX_API_KEY || process.env.BLACKBOX_AI_API || '';
    this.baseUrl = process.env.BLACKBOX_ENDPOINT_URL || DEFAULT_BASE_URL;
    this.endpoint = process.env.BLACKBOX_VIDEO_ENDPOINT || 'chat/completions';
    this.model = process.env.BLACKBOX_VIDEO_MODEL || DEFAULT_VIDEO_MODEL;
  }

  async validateConfiguration(): Promise<void> {
    if (!this.apiKey) throw new Error('Blackbox API key not set in BLACKBOX_API_KEY or BLACKBOX_AI_API');
  }

  async estimateCost(request: VideoGenerationRequest): Promise<number | null> {
    void request;
    const configuredValue = process.env.BLACKBOX_ESTIMATED_COST_USD?.trim();
    if (!configuredValue) return null;
    const configured = Number(configuredValue);
    return Number.isFinite(configured) && configured >= 0 ? configured : null;
  }

  private async requestJson(url: string, body: JsonRecord): Promise<JsonRecord> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let parsed: unknown = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = null; }
    if (!response.ok) throw new Error(`Blackbox video request failed with HTTP ${response.status}.`);
    if (!isRecord(parsed)) throw new Error('Blackbox returned an invalid JSON response.');
    return parsed;
  }

  private async downloadOutput(url: string, outputDirectory: string, filenameBase: string): Promise<{ path: string; hash: string; mimeType: string }> {
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); } catch { throw new Error('Blackbox returned an invalid video URL.'); }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Blackbox returned an unsupported video URL scheme.');
    const response = await fetch(parsedUrl);
    if (!response.ok) throw new Error(`Blackbox video download failed with HTTP ${response.status}.`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const format = extensionFor(response.headers.get('content-type')?.split(';')[0] || null, url);
    const filePath = path.join(outputDirectory, `${filenameBase}${format.extension}`);
    await fs.writeFile(filePath, buffer);
    return {
      path: filePath,
      hash: crypto.createHash('sha256').update(buffer).digest('hex'),
      mimeType: format.mimeType,
    };
  }

  async generate(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    await this.validateConfiguration();
    if (!request.output_directory) throw new Error('Blackbox provider requires request.output_directory.');
    await fs.mkdir(request.output_directory, { recursive: true });

    const messageContent: Array<Record<string, unknown>> = [{ type: 'text', text: request.prompt }];
    if (request.reference_image_path) messageContent.push(await imageContent(request.reference_image_path));

    const configuredParameters = process.env.BLACKBOX_VIDEO_PARAMETERS_JSON?.trim();
    let parameters: JsonRecord = {};
    if (configuredParameters) {
      try {
        const parsed: unknown = JSON.parse(configuredParameters);
        if (!isRecord(parsed)) throw new Error('not an object');
        parameters = parsed;
      } catch {
        throw new Error('BLACKBOX_VIDEO_PARAMETERS_JSON must be a JSON object.');
      }
    }

    const response = await this.requestJson(endpointUrl(this.baseUrl, this.endpoint), {
      ...parameters,
      model: this.model,
      messages: [{ role: 'user', content: messageContent.length === 1 ? request.prompt : messageContent }],
      stream: false,
    });
    const urls = [...new Set(extractUrls(response))];
    if (urls.length === 0) throw new Error('Blackbox returned no downloadable video URL.');

    const requestId = stringValue(response.id) || stringValue(response.request_id);
    const base = safeRequestId(requestId || `completed-${Date.now()}`);
    const returnedVideos = [];
    for (const [index, url] of urls.entries()) {
      returnedVideos.push(await this.downloadOutput(url, request.output_directory, `blackbox_${base}_${index + 1}`));
    }
    return {
      asset_id: `blackbox_${base}`,
      provider: this.id,
      model: this.model,
      returned_videos: returnedVideos,
      provider_request_id: requestId || undefined,
      cost: numberValue(response.cost) ?? numberValue(response.usage && isRecord(response.usage) ? response.usage.cost : null),
    };
  }
}
