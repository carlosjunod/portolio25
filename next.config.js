/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint validation during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type-checking during production builds (no TS setup)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;