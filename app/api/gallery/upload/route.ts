import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    
    const file = form.get('file')
    const category = form.get('category') as string
    const folderOverride = (form.get('folder') as string | null) || null
    const alt = form.get('alt') as string || ''
    const title = form.get('title') as string || ''

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ 
        error: 'No files were uploaded.', 
        details: { 
          fileType: typeof file,
          fileInstance: file instanceof File,
          fileSize: file instanceof File ? file.size : 'not a file'
        } 
      }, { status: 400 })
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const ext = path.extname(file.name) || '.jpg'
    const safeBase = path.basename(file.name, ext).replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()
    const filename = `${safeBase}-${Date.now()}${ext}`
    // Allow overriding S3 folder (e.g., "about") while keeping category for DB constraints
    const safeFolder = folderOverride ? folderOverride.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9-_/]/gi, '') : ''
    const prefix = safeFolder && safeFolder.length > 0 ? safeFolder : `gallery/${category}`
    const s3Key = `${prefix}/${filename}`

    // Dynamic imports to avoid issues
    const { uploadToS3 } = await import('../../../../lib/s3')
    const { getPayload } = await import('payload')
    const config = await import('../../../../payload.config')

    // Upload to S3
    const publicUrl = await uploadToS3(buffer, s3Key, file.type)

    const payload = await getPayload({ config: config.default })
    const doc = await payload.create({
      collection: 'gallery',
      data: {
        title,
        alt: alt || safeBase,
        category,
        externalUrl: publicUrl,
        order: 0,
      },
    })

    return NextResponse.json(doc)
  } catch (error) {
    console.error('❌ [API] Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}


