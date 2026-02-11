import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export async function GET(_req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const result = await payload.find({
      collection: 'bookings',
      limit: 100,
      sort: '-createdAt',
    })

    return NextResponse.json(result.docs)
  } catch (error) {
    console.error('Error loading bookings for admin:', error)
    return NextResponse.json(
      { error: 'Nu am putut încărca rezervările.' },
      { status: 500 },
    )
  }
}

