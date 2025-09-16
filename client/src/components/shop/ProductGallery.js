'use client';

import { buildImageSources } from '../../lib/image-sources';

export default function ProductGallery({ image, alt, imageManifest = {} }){
  const sources = buildImageSources(imageManifest, image);
  const placeholderStyle = sources?.lqip ? {
    backgroundImage: `url(${sources.lqip})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : null;
  return (
    <div className="image-holder zoom-effect" style={{ aspectRatio: '1 / 1', width: '100%', ...(placeholderStyle || {}) }}>
      <img
        src={sources?.src || image}
        srcSet={sources?.srcSet}
        sizes="(min-width: 1200px) 40vw, (min-width: 768px) 60vw, 100vw"
        alt={alt}
        className="img-fluid zoom-in"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
