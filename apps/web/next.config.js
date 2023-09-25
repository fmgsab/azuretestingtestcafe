const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  distDir: 'build/.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    LOG_LEVEL_DEV: process.env.LOG_LEVEL_DEV,
    LOG_ENABLED: process.env.LOG_ENABLED,
    LOG_LEVEL_PROD: process.env.LOG_LEVEL_PROD,
  },
  reactStrictMode: true,
  transpilePackages: ['@fmg/ui', '@fmg/utils', '@fmg/forms', '@fmg/diga', 'models', '@fmg/tailwind-config', 'mock-data', '@fmg/logger'],
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      layers: true,
    };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
