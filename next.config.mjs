/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib', 'scripts'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
