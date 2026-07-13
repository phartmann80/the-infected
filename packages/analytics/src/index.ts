export interface AnalyticsEventEnvelope {
  readonly name: string;
  readonly version: string;
  readonly timestampIso: string;
  readonly payload: Record<string, unknown>;
}

export function createAnalyticsEvent(name: string, payload: Record<string, unknown> = {}): AnalyticsEventEnvelope {
  return { name, version: '0.1.0', timestampIso: new Date().toISOString(), payload };
}
