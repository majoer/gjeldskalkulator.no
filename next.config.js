const { i18n } = require('./next-i18next.config')
const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  i18n,
  webpack(config, { isServer }) {
    if (config.mode === 'development') {
      const { I18NextHMRPlugin } = require('i18next-hmr/plugin')
      config.plugins.push(
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'public/locales'),
        })
      )
    }

    return config
  },
  async headers() {
    const localhost = process.env['NODE_ENV'] === 'development'
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }, {
            key: 'Permissions-Policy',
            value: ''
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: `
            default-src 'self';
            connect-src 'self' https://vitals.vercel-insights.com/;
            script-src 'self' https://cdn.vercel-insights.com/v1/script.debug.js ${localhost ? "'unsafe-eval'" : ""};
            style-src 'self' 'unsafe-inline';
            font-src 'self';
          `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
})