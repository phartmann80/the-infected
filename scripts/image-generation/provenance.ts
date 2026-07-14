import fs from 'fs';

export function saveProvenance(path: string, meta: any){
  fs.writeFileSync(path, JSON.stringify(meta, null, 2));
}
