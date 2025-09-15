/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  // Only require full static export in production builds; keep dev flexible
  output: isProd ? 'export' : undefined,
  images: { unoptimized: true },
};

module.exports = nextConfig;
