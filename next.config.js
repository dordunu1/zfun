/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'], // Be more specific in production
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/twitter-embed/:path*',
        destination: 'https://platform.twitter.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 