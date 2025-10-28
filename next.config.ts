import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
