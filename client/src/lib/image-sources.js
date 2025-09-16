export function buildImageSources(manifest, original) {
  if (!manifest || !original) return null;
  const entry = manifest[original];
  if (!entry) return null;
  const sizes = Array.isArray(entry.sizes) ? entry.sizes.slice().sort((a, b) => a.width - b.width) : [];
  const src = sizes.length ? sizes[sizes.length - 1].src : original;
  const srcSet = sizes.length ? sizes.map(s => `${s.src} ${s.width}w`).join(', ') : undefined;
  return {
    src,
    srcSet,
    widths: sizes,
    lqip: entry.lqip || null,
  };
}
