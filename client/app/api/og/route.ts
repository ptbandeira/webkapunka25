import { ImageResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

function getParam(params: URLSearchParams, key: string, fallback = '') {
  const value = params.get(key);
  return value ? decodeURIComponent(value) : fallback;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = getParam(searchParams, 'title', 'Kapunka');
  const category = getParam(searchParams, 'category');
  const imgParam = searchParams.get('img');

  let imageUrl: string | null = null;
  if (imgParam) {
    try {
      imageUrl = new URL(imgParam, req.nextUrl.origin).toString();
    } catch {
      imageUrl = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: 'flex',
          flexDirection: 'row',
          background: 'linear-gradient(135deg, #f2ede7 0%, #d8cfc4 45%, #f9f6f2 100%)',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          color: '#1b1a1a',
        }}
      >
        <div
          style={{
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            gap: '28px',
          }}
        >
          {category ? (
            <div
              style={{
                display: 'inline-flex',
                padding: '12px 20px',
                borderRadius: '999px',
                background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                fontSize: '28px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {category}
            </div>
          ) : null}
          <div style={{ fontSize: '80px', fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: '28px', opacity: 0.75 }}>kapunkargan.com</div>
        </div>
        {imageUrl ? (
          <div
            style={{
              flex: '0 0 38%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: '60px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '80%',
                borderRadius: '36px',
                overflow: 'hidden',
                boxShadow: '0 35px 60px rgba(0,0,0,0.3)',
                border: '6px solid rgba(255,255,255,0.85)',
                background: '#f4f0ea',
                display: 'flex',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ) : null}
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    }
  );
}

