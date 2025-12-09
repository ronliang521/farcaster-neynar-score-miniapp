/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure API routes work correctly
  async headers() {
    return [
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
  // Ensure proper routing
  trailingSlash: false,
  // Optimize for Vercel deployment
  swcMinify: true,
  // Ensure static files are generated correctly
  generateEtags: true,
  // Disable static optimization for dynamic content
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
