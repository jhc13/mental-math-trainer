const withPWA = require('next-pwa');

module.exports = withPWA({
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    sw: '/service-worker.js'
  }
});
