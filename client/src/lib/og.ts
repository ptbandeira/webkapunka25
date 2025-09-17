import { site } from './config';

export type OgOptions = {
  title: string;
  image?: string | null;
  category?: string | null;
};

function encode(value: string | null | undefined) {
  return value ? encodeURIComponent(value) : null;
}

export function buildOgUrl({ title, image, category }: OgOptions): string {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (image) params.set('img', image);
  if (category) params.set('category', category);
  const base = (site.url || '').replace(/\/$/, '');
  const path = '/api/og';
  const query = params.toString();
  return `${base}${path}${query ? `?${query}` : ''}` || `${path}${query ? `?${query}` : ''}`;
}

