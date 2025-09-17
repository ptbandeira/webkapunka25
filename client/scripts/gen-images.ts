import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TARGET_WIDTHS = [320, 640, 960, 1280, 1600];
const repoRoot = path.resolve(__dirname, '..', '..');
const siteContentDir = path.join(repoRoot, 'site', 'content');
const publicDir = path.join(repoRoot, 'client', 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const manifestFile = path.join(publicDir, 'content', '_images.json');

const imagePaths = new Set<string>();

function isDraft(status: unknown): boolean {
  if (typeof status === 'string') return status.toLowerCase().trim() === 'draft';
  if (typeof status === 'boolean') return !status;
  return false;
}

function collectImagesFromObject(value: unknown) {
  if (!value) return;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\/?(images|uploads)\//i.test(trimmed)) {
      const ext = path.extname(trimmed).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext)) {
        if (!/-\d{3,4}\.[a-z]+$/i.test(path.basename(trimmed))) {
          imagePaths.add(trimmed.startsWith('/') ? trimmed : `/${trimmed}`);
        }
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(collectImagesFromObject);
    return;
  }
  if (typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach(collectImagesFromObject);
  }
}

function readJSON(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function collectFromPages(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const filePath = path.join(dir, entry);
    if (fs.statSync(filePath).isDirectory()) {
      collectFromPages(filePath);
    } else if (entry.endsWith('.json')) {
      try {
        const data = readJSON(filePath);
        if (data && typeof data === 'object') {
          if (!isDraft((data as any).status)) {
            collectImagesFromObject((data as any).sections);
          }
        }
      } catch (err) {
        console.warn('[gen-images] Failed parsing', filePath, (err as Error).message);
      }
    }
  }
}

function collectFromProducts(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const data = readJSON(path.join(dir, file));
    if (data && typeof data === 'object') {
      if (isDraft((data as any).status)) continue;
      const images = Array.isArray((data as any).images) ? (data as any).images : [];
      images.forEach(img => collectImagesFromObject(typeof img === 'object' && img ? (img as any).image || img : img));
    }
  }
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function getMimeType(ext: string) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.avif':
      return 'image/avif';
    default:
      return 'image/jpeg';
  }
}

function buildOutputName(relPath: string, width: number) {
  const cleaned = relPath.replace(/^\/+/, '');
  const ext = path.extname(cleaned);
  const base = path.basename(cleaned, ext);
  const dirName = path.dirname(cleaned);
  const prefix = dirName && dirName !== '.' ? dirName.replace(/[\\/]+/g, '-') + '-' : '';
  return `${prefix}${base}-${width}${ext}`.replace(/--+/g, '-');
}

async function processImage(srcPath: string, originalKey: string, relativeKey: string, manifest: Record<string, any>) {
  try {
    const metadata = await sharp(srcPath).metadata();
    const ext = path.extname(srcPath);
    const sizes: { width: number; src: string }[] = [];
    ensureDir(uploadsDir);
    for (const width of TARGET_WIDTHS) {
      if (metadata.width && metadata.width < width) continue;
      const outputName = buildOutputName(relativeKey, width);
      const outputPath = path.join(uploadsDir, outputName);
      await sharp(srcPath)
        .resize(width, undefined, { withoutEnlargement: true })
        .toFile(outputPath);
      sizes.push({ width, src: `/uploads/${outputName}` });
    }
    if (!sizes.length) {
      // still copy original if no resize needed
      const outputName = buildOutputName(relativeKey, metadata.width || TARGET_WIDTHS[TARGET_WIDTHS.length - 1]);
      const outputPath = path.join(uploadsDir, outputName);
      fs.copyFileSync(srcPath, outputPath);
      sizes.push({ width: metadata.width || TARGET_WIDTHS[TARGET_WIDTHS.length - 1], src: `/uploads/${outputName}` });
    }
    const lqipBuffer = await sharp(srcPath).resize(32, undefined, { withoutEnlargement: true }).toBuffer();
    const lqip = `data:${getMimeType(ext)};base64,${lqipBuffer.toString('base64')}`;
    manifest[originalKey] = { sizes, lqip };
  } catch (err) {
    console.warn('[gen-images] Failed processing', srcPath, (err as Error).message);
  }
}

async function main() {
  collectFromPages(path.join(siteContentDir, 'pages'));
  collectFromPages(path.join(siteContentDir, 'en', 'pages'));
  collectFromPages(path.join(siteContentDir, 'pt', 'pages'));
  collectFromPages(path.join(siteContentDir, 'es', 'pages'));
  collectFromProducts(path.join(siteContentDir, 'products'));

  const extraImages = [
    '/images/banner-image.jpg',
    '/images/banner-image1.jpg',
    '/images/banner-image2.jpg',
  ];
  extraImages.forEach(p => imagePaths.add(p));

  const manifest: Record<string, any> = {};
  for (const key of Array.from(imagePaths)) {
    const rel = key.replace(/^\/+/, '');
    const candidates = [
      path.join(publicDir, rel),
      path.join(repoRoot, 'site', rel),
      path.join(repoRoot, 'site', 'static', rel),
    ];
    const srcPath = candidates.find(p => fs.existsSync(p));
    if (!srcPath) {
      console.warn('[gen-images] Source not found for', key);
      continue;
    }
    await processImage(srcPath, key, rel, manifest);
  }

  ensureDir(path.dirname(manifestFile));
  const sorted = Object.keys(manifest).sort().reduce<Record<string, any>>((acc, curr) => {
    acc[curr] = manifest[curr];
    return acc;
  }, {});
  fs.writeFileSync(manifestFile, JSON.stringify(sorted, null, 2));
  console.log('[gen-images] Wrote manifest ->', path.relative(repoRoot, manifestFile));
}

main().catch(err => {
  console.error('[gen-images] Failed:', err);
  process.exitCode = 1;
});
