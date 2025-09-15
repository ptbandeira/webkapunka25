'use client';

export default function ProductGallery({ image, alt }){
  return (
    <div className="image-holder zoom-effect" style={{ aspectRatio: '1 / 1', width: '100%' }}>
      <img src={image} alt={alt} className="img-fluid zoom-in" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

