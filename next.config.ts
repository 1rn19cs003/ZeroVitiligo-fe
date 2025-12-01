/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side rendering mode (required for middleware/proxy)
  // Server-side rendering mode (required for middleware/proxy)
  basePath: process.env.IS_GH_PAGES ? '/ZeroVitiligo-fe' : '',

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  trailingSlash: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_API_SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  }
};

module.exports = nextConfig;