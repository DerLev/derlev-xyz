const withTwin = require('./withTwin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  rewrites: async () => {
    return [
      {
        source: '/healthz',
        destination: '/api/healthz'
      }
    ]
  }
}

module.exports = withTwin(nextConfig)
