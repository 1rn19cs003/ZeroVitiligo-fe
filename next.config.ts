/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side rendering mode (required for middleware/proxy)
  basePath: process.env.IS_GH_PAGES ? '/ZeroVitiligo-fe' : '',

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  trailingSlash: false,
  reactStrictMode: true,

  // Enable compression
  compress: true,

  // Performance optimizations
  swcMinify: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },

  env: {
    NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_API_SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  }
};

module.exports = nextConfig;