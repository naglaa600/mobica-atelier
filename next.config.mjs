/** @type {import('next').NextConfig} */
const nextConfig = {
  // All assets are served from /public — no external image domains needed
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
