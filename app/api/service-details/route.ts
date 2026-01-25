import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const serviceName = searchParams.get('name')

    if (!serviceName) {
      return NextResponse.json({ error: 'Service name is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find service details by name
    const result = await payload.find({
      collection: 'service-details',
      where: {
        serviceName: {
          equals: serviceName,
        },
      },
      limit: 1,
    })

    if (!result.docs || result.docs.length === 0) {
      // Return empty data structure if no details found
      return NextResponse.json({
        name: serviceName,
        gallery: [],
      })
    }

    const serviceDetail = result.docs[0]

    // Normalize the data structure
    const normalizedData = {
      name: serviceDetail.serviceName,
      heroImage: serviceDetail.heroImage
        ? {
            url: (serviceDetail.heroImage as any).url,
            externalUrl: (serviceDetail.heroImage as any).externalUrl,
            alt: (serviceDetail.heroImage as any).alt || serviceName,
          }
        : undefined,
      gallery: Array.isArray(serviceDetail.gallery)
        ? serviceDetail.gallery.map((item: any) => ({
            image: {
              url: item.image?.url,
              externalUrl: item.image?.externalUrl,
              alt: item.image?.alt || item.title || serviceName,
            },
            title: item.title,
            description: item.description,
          }))
        : [],
      ctaText: serviceDetail.ctaText || 'Rezervă acum',
      ctaLink: serviceDetail.ctaLink || '#contact',
    }

    return NextResponse.json(normalizedData)
  } catch (error) {
    console.error('Error fetching service details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service details' },
      { status: 500 }
    )
  }
}

