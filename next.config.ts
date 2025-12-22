import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'event-venue-buzau.s3.eu-central-1.amazonaws.com',
      },
    ],
  },
  reactCompiler: false,
  turbopack: {},
}

export default withPayload(nextConfig)
