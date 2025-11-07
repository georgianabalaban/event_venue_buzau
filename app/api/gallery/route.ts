import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

type GalleryCategory = 'indoor' | 'outdoor' | 'pool' | 'events'

interface GalleryDocument {
  id?: string
  externalUrl?: string
  url?: string
  alt?: string
  category?: GalleryCategory | string | null
  [key: string]: unknown
}

const isGalleryCategory = (value: unknown): value is GalleryCategory =>
  value === 'indoor' || value === 'outdoor' || value === 'pool' || value === 'events'

const isNotFoundError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false
  const status = (error as { status?: number }).status
  if (status === 404) return true
  const message = (error as { message?: unknown }).message
  return typeof message === 'string' && message.toLowerCase().includes('not found')
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const query: Parameters<typeof payload.find>[0] = {
      collection: 'gallery',
      limit: 100,
      sort: 'order',
    }
    if (category && category !== 'all') {
      query.where = { category: { equals: category } }
    }

    const result = await payload.find(query)

    if (!category || category === 'all') {
      const grouped: Record<GalleryCategory, GalleryDocument[]> = {
        indoor: [],
        outdoor: [],
        pool: [],
        events: [],
      }

      const docs = result.docs as GalleryDocument[]
      for (const doc of docs) {
        const categoryKey: GalleryCategory = isGalleryCategory(doc.category) ? doc.category : 'events'
        grouped[categoryKey].push(doc)
      }
      return NextResponse.json(grouped)
    }

    return NextResponse.json(result.docs as GalleryDocument[])
  } catch (error) {
    console.error('❌ [API] Error fetching gallery:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const urlParam = searchParams.get('url')
    const skipS3 = searchParams.get('skipS3') === '1'
    if (!id && !urlParam) return NextResponse.json({ error: 'Missing id or url' }, { status: 400 })

    // Determine S3 key either from DB item or from provided URL
    let externalUrl: string | null = null
    let item: GalleryDocument | null = null
    if (id) {
      try {
        item = await payload.findByID({ collection: 'gallery', id }) as GalleryDocument
      } catch (error: unknown) {
        if (!isNotFoundError(error)) {
          throw error
        }
      }
      externalUrl = item?.externalUrl ?? item?.url ?? null
    }
    if (!externalUrl && urlParam) externalUrl = urlParam

    if (!skipS3 && externalUrl) {
      const { deleteFromS3, extractS3KeyFromUrl } = await import('../../../lib/s3')
      const s3Key = extractS3KeyFromUrl(externalUrl)
      console.log('[DELETE] Extracted S3 key:', s3Key)
      if (s3Key) {
        try {
          await deleteFromS3(s3Key)
          console.log('[DELETE] S3 object deleted:', s3Key)
        } catch (e) {
          console.error('❌ [API] S3 delete failed:', e)
        }
      }
    }

    if (id) {
      try {
        await payload.delete({ collection: 'gallery', id })
      } catch (error: unknown) {
        if (!isNotFoundError(error)) {
          throw error
        }
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ [API] Error deleting gallery item:', error)
    return NextResponse.json({ error: 'Failed to delete item', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const { title, alt, category, externalUrl } = body || {}
    if (!alt || !category) {
      return NextResponse.json({ error: 'alt and category are required' }, { status: 400 })
    }

    const doc = await payload.create({
      collection: 'gallery',
      data: { title, alt, category, externalUrl },
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error('❌ [API] Error creating gallery item:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}


