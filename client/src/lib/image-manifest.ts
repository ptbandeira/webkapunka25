import fs from 'fs';
import path from 'path';

export type ImageVariant = {
  width: number;
  src: string;
};

export type ImageManifestEntry = {
  sizes?: ImageVariant[];
  lqip?: string;
};

export type ImageManifest = Record<string, ImageManifestEntry>;

let cache: ImageManifest | null = null;

export function getImageManifest(): ImageManifest {
  if (cache) return cache;
  const file = path.join(process.cwd(), 'public', 'content', '_images.json');
  try {
    const raw = fs.readFileSync(file, 'utf8');
    cache = JSON.parse(raw) as ImageManifest;
  } catch {
    cache = {};
  }
  return cache;
}

export function clearImageManifestCache() {
  cache = null;
}

