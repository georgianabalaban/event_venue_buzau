import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const { orderedIds } = await request.json()
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json({ error: 'orderedIds is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    // Set order as index
    await Promise.all(
      orderedIds.map((id: string, idx: number) =>
        payload.update({ collection: 'gallery', id, data: { order: idx } })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ [API] Error reordering gallery:', error)
    return NextResponse.json({ error: 'Failed to reorder items' }, { status: 500 })
  }
}


