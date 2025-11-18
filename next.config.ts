/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. **Crucial:** Enables static HTML export
  output: 'export',

  // 2. **Crucial:** Sets the base path for assets (CSS, JS, images)
  //    Replace 'YOUR_REPO_NAME' with the actual name of your GitHub repository.
  basePath: '/ZeroVitiligo-fe',

  // 3. Optional: Disables Next.js Image Optimization
  //    This is because GitHub Pages does not run a server to perform this optimization.
  images: {
    unoptimized: true,
  },

  // 4. Optional: Add a trailing slash to all URLs (Recommended for static export)
  trailingSlash: false,
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SERVER_URL_WEB_SOCKET:process.env.NEXT_PUBLIC_SERVER_URL_WEB_SOCKET
  }
};

module.exports = nextConfig;