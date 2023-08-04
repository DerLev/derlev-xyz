/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ]
      }
    ]
  },
  poweredByHeader: false
}

module.exports = nextConfig
