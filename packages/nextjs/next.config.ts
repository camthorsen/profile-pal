import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig = {
  reactStrictMode: true,
  webpack: (config: WebpackConfig) => {
    config.resolve = config.resolve ?? {};
    // Support explicit file extensions.
    // See https://github.com/vercel/next.js/discussions/32237#discussioncomment-4793595
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };

    return config;
  },
} satisfies NextConfig;

export default nextConfig;
