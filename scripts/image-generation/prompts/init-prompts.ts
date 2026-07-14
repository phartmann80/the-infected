import fs from 'fs';
import path from 'path';

const promptsDir = path.join(__dirname, 'prompts');
if(!fs.existsSync(promptsDir)) fs.mkdirSync(promptsDir, { recursive: true });

const files = {
  'golden_prompt.txt': `Photorealistic cinematic key art, AAA production still. PBR materials, ultra-detailed textures: fabric weave, realistic skin pores, weathered metal scratches, wet grime and mud, realistic subsurface scattering on skin. Filmic lighting (teal-orange grade), volumetric fog and light rays, dense smoke/ash/embers, visible particles. Camera: 35mm lens feel, shallow DOF (f/2.8), film grain, subtle chromatic aberration. Mood: solemn hope; horror grounded in realism. Include evacuation signage, relay tower elements, emergency lighting, and a faint pulsing radio beacon. Avoid painterly/illustrative styles.`,
  'negative_prompt.txt': `no painterly brushstrokes, no comic-book style, no watercolor, no low-poly look, no toon shading, no exaggerated anatomy, no fantasy creatures, avoid oversaturated neon, avoid flat lighting, avoid desaturated gray-only palettes`,
  'camera_default.txt': `35mm, f/2.8, shallow depth of field, cinematic lens, slight film grain`,
  'lighting_default.txt': `teal-orange cinematic grade, warm rim/backlight, subtle volumetric shafts, controlled contrast`,
  'atmosphere_default.txt': `dense smoke, ash particles, embers, subtle fog near ground, visible light rays`,
  'material_default.txt': `wet asphalt reflections, rusted metal, torn fabric with frays, dirt accumulation in seams, realistic skin SSS`,
  'hero-key-art-001.txt': `rooftop at dawn, survivor just finished reconnecting a battered field radio, radio beacon emitting faint pulse, relay tower in skyline, small distant infected discoverable`,
}

for(const [k,v] of Object.entries(files)){
  fs.writeFileSync(path.join(promptsDir, k), v);
}

console.log('Default prompt layers written to', promptsDir);
