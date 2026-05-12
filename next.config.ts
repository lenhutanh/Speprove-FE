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
}

export default withNextIntl(nextConfig)
