/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      's.yimg.com',
      'techcrunch.com',
      'media.zenfs.com',
      's.aolcdn.com',
    ],
  },
};

module.exports = nextConfig;
