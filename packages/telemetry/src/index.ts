export type TelemetrySurface = 'web' | 'android' | 'studio';
export interface TelemetryContext { readonly surface: TelemetrySurface; readonly buildVersion: string; }
export function createTelemetryContext(surface: TelemetrySurface, buildVersion = '0.1.0'): TelemetryContext { return { surface, buildVersion }; }
