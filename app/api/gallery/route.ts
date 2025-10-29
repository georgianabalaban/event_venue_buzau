import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as 'indoor' | 'outdoor' | 'pool' | 'events' | null

    const query: any = {
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
      const grouped = {
        indoor: [] as any[],
        outdoor: [] as any[],
        pool: [] as any[],
        events: [] as any[],
      }
      for (const doc of result.docs as any[]) {
        const key = (doc.category || 'events') as keyof typeof grouped
        grouped[key].push(doc)
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
    const skipS3 = searchParams.get('skipS3') === '1'
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Get the item first to extract S3 key
    const item = await payload.findByID({ collection: 'gallery', id })
    console.log('[DELETE] Fetched item:', { id, hasUrl: !!item?.externalUrl, url: item?.externalUrl })
    if (!skipS3 && item?.externalUrl) {
      const { deleteFromS3, extractS3KeyFromUrl } = await import('../../../lib/s3')
      const s3Key = extractS3KeyFromUrl(item.externalUrl)
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

    await payload.delete({ collection: 'gallery', id })
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


