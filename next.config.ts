/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side rendering mode (required for middleware/proxy)
  basePath: '/ZeroVitiligo-fe',

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  trailingSlash: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SERVER_URL_WEB_SOCKET: process.env.NEXT_PUBLIC_SERVER_URL_WEB_SOCKET
  }
};

module.exports = nextConfig;