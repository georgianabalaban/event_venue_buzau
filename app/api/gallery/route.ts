import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

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

    // Grouped response when no category filter
    if (!category || category === 'all') {
      // Tip minimal sigur pentru elemente gallery
      type GalleryDoc = { category?: string; [key: string]: unknown }
      const grouped: Record<'indoor'|'outdoor'|'pool'|'events', GalleryDoc[]> = {
        indoor: [],
        outdoor: [],
        pool: [],
        events: [],
      }
      for (const doc of result.docs as GalleryDoc[]) {
        const key = (doc.category as keyof typeof grouped) || 'events'
        // verificăm dacă key este valid
        if (grouped[key]) grouped[key].push(doc)
      }
      return NextResponse.json(grouped)
    }

    return NextResponse.json(result.docs)
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
    if (id) {
      let item: any = null
      try {
        item = await payload.findByID({ collection: 'gallery', id })
      } catch (e: any) {
        if (!((e && e.status === 404) || (e && e.message && String(e.message).includes('Not Found')))) {
          throw e
        }
      }
      externalUrl = item?.externalUrl || item?.url || null
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
      } catch (e: any) {
        if (!((e && e.status === 404) || (e && e.message && String(e.message).includes('Not Found')))) {
          throw e
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


