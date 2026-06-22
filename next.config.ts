import envConfig from '@/envConfig'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './src/messages/vi.json',
  },
})

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${envConfig.BACKEND_API_URL}/api/:path*`,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
