import fs from 'fs';
import path from 'path';

function removeIfEmpty(directory: string): void {
  if (!fs.existsSync(directory)) return;
  if (fs.readdirSync(directory).length === 0) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

export function setup(): () => void {
  return () => {
    removeIfEmpty(path.join(process.cwd(), '.tmp', 'image-generation'));
    removeIfEmpty(path.join(process.cwd(), '.tmp'));
  };
}
