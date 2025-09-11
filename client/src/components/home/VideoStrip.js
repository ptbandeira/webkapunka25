'use client';

// Not wired yet. Static video banner matching legacy layout
// (we will hook it into Home after verifying Best‑Sellers).

export default function VideoStrip(){
  return (
    <section
      className="video-section d-flex align-items-center justify-content-center"
      style={{
        background: 'url(/images/video-image.jpg) no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '825px',
      }}
    >
      <div className="video-player text-center">
        <a
          href="https://www.youtube.com/watch?v=Gr9cKIjsyJk"
          className="play-btn position-relative"
          target="_blank"
          rel="noreferrer"
        >
          <svg
            className="position-absolute top-0 bottom-0 start-0 end-0 m-auto"
            width="41"
            height="41"
            aria-hidden="true"
          >
            <use xlinkHref="#play"></use>
          </svg>
          <svg className="text-pattern" width="260" height="260" viewBox="0 0 260 260" aria-hidden>
            <defs>
              <path
                id="kapunkaCircleReact"
                d="M130,130 m-100,0 a100,100 0 1,1 200,0 a100,100 0 1,1 -200,0"
              />
            </defs>
            <text fontSize="16" letterSpacing="4" fill="currentColor">
              <textPath href="#kapunkaCircleReact">
                KAPUNKA • PURE ARGAN OIL • COLD-PRESSED • SKIN • HAIR • NAILS •
              </textPath>
            </text>
          </svg>
        </a>
      </div>
    </section>
  );
}

