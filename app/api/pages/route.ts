import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    const pages = await payload.find({
      collection: 'pages',
      limit: 1,
    })

    // If no pages exist, return default data
    if (pages.docs.length === 0) {
      const defaultData = {
        hero: {
          heading: 'Event Venue Buzău',
          secondaryHeading: 'prind viață',
          subheading: 'Spațiu perfect pentru evenimente memorabile',
          ctaText: 'Rezervă acum'
        },
        about: {
          title: 'Despre noi',
          description: 'Oferim un spațiu elegant și modern pentru evenimente de toate tipurile, cu facilități de top și servicii personalizate.',
          features: [
            'Spațiu exterior cu piscină',
            'Sală interioară elegantă',
            'Capacitate până la 200 persoane',
            'Parcare privată',
            'Catering personalizat'
          ]
        },
        services: {
          title: 'Serviciile noastre',
          items: [
            {
              name: 'Evenimente Corporate',
              description: 'Conferințe, training-uri, lansări de produse',
              icon: 'briefcase'
            },
            {
              name: 'Nunți',
              description: 'Ceremonii și petreceri de nuntă personalizate',
              icon: 'heart'
            },
            {
              name: 'Petreceri Private',
              description: 'Aniversări, zile de naștere, reuniuni de familie',
              icon: 'partypopper'
            },
            {
              name: 'Evenimente Speciale',
              description: 'Botezuri, confirmări, evenimente tematice',
              icon: 'sparkles'
            }
          ]
        },
        contact: {
          title: 'Contactează-ne',
          phone: '+40 234 567 890',
          email: 'contact@eventvenue.ro',
          address: 'Strada Exemplu, Nr. 123, Buzău'
        }
      }
      return NextResponse.json(defaultData)
    }

    const doc = pages.docs[0] as Record<string, unknown>
    // Normalize richText description to plain string for frontend/admin
    const toPlainText = (node: unknown): string => {
      if (!node) return ''
      if (Array.isArray(node)) return node.map(toPlainText).join(' ')
      if (typeof node === 'string') return node
      if (typeof node === 'object' && node !== null) {
        // @ts-ignore
        const n = node as { text?: string; children?: unknown[] }
        const text = n.text || ''
        const children = Array.isArray(n.children) ? n.children.map(toPlainText).join(' ') : ''
        return [text, children].filter(Boolean).join(' ')
      }
      return ''
    }

    const descriptionValue = (() => {
      // @ts-expect-error
      const v = doc?.about?.description
      if (!v) return undefined
      if (typeof v === 'string') return v
      return toPlainText(v).trim()
    })()

    return NextResponse.json({
      ...doc,
      about: {
        ...doc?.about,
        description: descriptionValue,
      },
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    // Normalize incoming shape to match Payload schema
    // about.features can come as string[] from admin UI
    const normalized = {
      ...data,
      about: data?.about
        ? {
            ...data.about,
            features: Array.isArray(data.about.features)
              ? data.about.features.map((f: string | { feature: string }) =>
                  typeof f === 'string' ? { feature: f } : f
                )
              : [],
          }
        : undefined,
    }

    console.log('📝 [API] Received page data:', data)

    // Check if page exists
    const existingPages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    console.log('📝 [API] Existing pages:', existingPages.docs.length)

    let page
    if (existingPages.docs.length > 0) {
      // Update existing page
      console.log('📝 [API] Updating existing page:', existingPages.docs[0].id)
      page = await payload.update({
        collection: 'pages',
        id: existingPages.docs[0].id,
        data: {
          ...normalized,
          slug: 'home',
          title: normalized.title || 'Home Page',
        },
      })
    } else {
      // Create new page
      console.log('📝 [API] Creating new page')
      page = await payload.create({
        collection: 'pages',
        data: {
          ...normalized,
          slug: 'home',
          title: normalized.title || 'Home Page',
        },
      })
    }

    console.log('✅ [API] Page saved successfully:', page.id)
    return NextResponse.json(page)
  } catch (error) {
    console.error('❌ [API] Error updating pages:', error)
    return NextResponse.json({ 
      error: 'Failed to update pages', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
