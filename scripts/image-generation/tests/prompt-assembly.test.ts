import { describe, it, expect } from 'vitest';
import { assemblePrompt } from '../generate';

describe('prompt assembly', () => {
  it('includes golden prompt content', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).toContain('Photorealistic cinematic key art');
  });

  it('includes camera layer', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).toContain('shallow depth of field');
  });

  it('includes lighting layer', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).toContain('teal-orange cinematic grade');
  });

  it('includes atmosphere layer', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).toContain('ash particles');
  });

  it('includes material layer', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).toContain('wet asphalt reflections');
  });

  it('includes brief-specific layer', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).toContain('rooftop at dawn');
  });

  it('assembles layers in deterministic order', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    // Use unique markers for each layer to avoid cross-layer substring matches
    const goldenIdx = prompt.indexOf('Photorealistic cinematic key art');
    const cameraIdx = prompt.indexOf('shallow depth of field');
    const lightingIdx = prompt.indexOf('teal-orange cinematic grade');
    const atmosphereIdx = prompt.indexOf('ash particles');
    const materialIdx = prompt.indexOf('wet asphalt reflections');
    const briefIdx = prompt.indexOf('rooftop at dawn');
    expect(goldenIdx).toBeLessThan(cameraIdx);
    expect(cameraIdx).toBeLessThan(lightingIdx);
    expect(lightingIdx).toBeLessThan(atmosphereIdx);
    expect(atmosphereIdx).toBeLessThan(materialIdx);
    expect(materialIdx).toBeLessThan(briefIdx);
  });

  it('includes reference when provided', () => {
    const prompt = assemblePrompt('hero-key-art-001', 'path/to/ref.png');
    expect(prompt).toContain('Reference: path/to/ref.png');
  });

  it('omits reference line when not provided', () => {
    const prompt = assemblePrompt('hero-key-art-001');
    expect(prompt).not.toContain('Reference:');
  });

  it('rejects empty brief', () => {
    expect(() => assemblePrompt('')).toThrow('Missing creative brief');
  });

  it('rejects missing required layer', () => {
    expect(() => assemblePrompt('nonexistent-brief-xyz')).toThrow('Missing required prompt layer');
  });
});
