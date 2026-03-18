import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mui/icons-material'],
  },
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium', '@axe-core/puppeteer'],
};

export default nextConfig;
