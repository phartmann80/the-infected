import fs from 'fs';

export function saveProvenance(path: string, meta: Record<string, unknown>){
  fs.writeFileSync(path, JSON.stringify(meta, null, 2));
}
