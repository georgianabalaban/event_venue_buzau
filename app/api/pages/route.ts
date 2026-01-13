import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

type IncomingFeature = string

type IncomingNavItem = {
  label?: string
  href?: string
  cta?: boolean
}

type IncomingPagePayload = {
  title?: string
  lastUpdatedAt?: string
  hero?: {
    heading?: string
    secondaryHeading?: string
    subheading?: string
    ctaText?: string
  }
  about?: {
    title?: string
    description?: string
    features?: IncomingFeature[]
    image?: string | null
  }
  services?: {
    title?: string
    items?: Array<{
      name?: string
      description?: string
      icon?: string
    }>
  }
  header?: {
    siteName?: string
    logo?: string | null
    nav?: IncomingNavItem[]
  }
}

type ExistingPageDoc = {
  updatedAt?: string | Date
}

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    let pages = await payload.find({
      collection: 'pages',
      limit: 1,
      depth: 2, // populate relations like about.image and others
      where: { slug: { equals: 'home' } },
    })

    // Fallback: if no 'home' page exists, load the first available page
    if (pages.docs.length === 0) {
      pages = await payload.find({
        collection: 'pages',
        limit: 1,
        depth: 2,
      })
    }

    // If no pages exist, return default data
    if (pages.docs.length === 0) {
      const defaultData = {
        hero: {
          heading: 'Event Venue Buzău',
          secondaryHeading: 'prind viață',
          subheading: 'Spațiu perfect pentru evenimente memorabile',
          ctaText: 'Rezervă acum'
        },
        header: {
          siteName: 'Event Venue Buzău',
          nav: [
            { label: 'Despre', href: '#about' },
            { label: 'Servicii', href: '#services' },
            { label: 'Galerie', href: '#gallery' },
            { label: 'Evenimente', href: '#events' },
            { label: 'Testimoniale', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
            { label: 'Rezervă acum', href: '#contact', cta: true }
          ]
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
              name: 'Petreceri de copii',
              description: 'Petreceri de copii pline de culoare și distracție, cu activități în aer liber și zonă dedicată celor mici, într-un spațiu sigur lângă Buzău.',
              icon: 'partypopper'
            },
            {
              name: 'Petreceri de botez',
              description: 'Petreceri de botez într-un cadru intim și elegant, cu decor rafinat și organizare completă pentru familia ta.',
              icon: 'heart'
            },
            {
              name: 'Serbări școli / grădinițe',
              description: 'Spațiu ideal pentru serbări școlare și de grădiniță, cu capacitate generoasă, zonă verde și facilități pentru spectacole și momente festive.',
              icon: 'sparkles'
            },
            {
              name: 'Petreceri aniversare',
              description: 'Petreceri aniversare personalizate pentru adulți și copii, cu muzică, decor și servicii gândite pentru experiențe memorabile aproape de Buzău.',
              icon: 'cake'
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
        const n = node as { text?: string; children?: unknown[] }
        const text = n.text || ''
        const children = Array.isArray(n.children) ? n.children.map(toPlainText).join(' ') : ''
        return [text, children].filter(Boolean).join(' ')
      }
      return ''
    }

    const descriptionValue = (() => {
      // @ts-expect-error accessing nested rich-text structure from Payload, can be string or node tree
      const v = doc?.about?.description
      if (!v) return undefined
      if (typeof v === 'string') return v
      return toPlainText(v).trim()
    })()

    const docObj = doc as Record<string, unknown>
    const aboutObj = (docObj.about as Record<string, unknown>) || {}
    const headerObj = (docObj.header as Record<string, unknown>) || {}

    return NextResponse.json({
      ...docObj,
      about: {
        ...aboutObj,
        description: descriptionValue,
      },
      header: { ...headerObj }
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json() as IncomingPagePayload

    // Normalize incoming shape to match Payload schema
    // about.features can come as string[] from admin UI
    const normalized = {
      ...data,
      about: data?.about
        ? {
            ...data.about,
            features: Array.isArray(data.about.features)
              ? data.about.features
                  .map((featureValue) => {
                    if (typeof featureValue !== 'string') return null
                    const trimmed = featureValue.trim()
                    return trimmed.length > 0 ? { feature: trimmed } : null
                  })
                  .filter((featureItem): featureItem is { feature: string } => featureItem !== null)
              : [],
          }
        : undefined,
        header: data?.header ? {
          ...data.header,
          nav: Array.isArray(data.header.nav)
            ? data.header.nav.map((item) => ({
                label: item?.label ?? '',
                href: item?.href ?? '',
                cta: Boolean(item?.cta),
              }))
            : []
        } : undefined,
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

    async function saveWithRetry<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
      let lastErr: unknown
      for (let i = 0; i < attempts; i++) {
        try {
          return await fn()
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          const isWriteConflict = msg.includes('Write conflict') || msg.includes('E11000')
          lastErr = err
          if (!isWriteConflict || i === attempts - 1) break
          const backoff = 100 + Math.floor(Math.random() * 150)
          console.warn(`⚠️ [API] Write conflict, retrying in ${backoff}ms (attempt ${i + 2}/${attempts})`)
          await new Promise(r => setTimeout(r, backoff))
        }
      }
      throw lastErr
    }

    // Optimistic concurrency: reject older writes
    const incomingUpdatedAt = data?.lastUpdatedAt ? new Date(data.lastUpdatedAt) : null
    const currentDoc = existingPages.docs[0] as ExistingPageDoc | undefined
    if (incomingUpdatedAt && currentDoc?.updatedAt) {
      const currentUpdatedAt = new Date(currentDoc.updatedAt)
      if (incomingUpdatedAt < currentUpdatedAt) {
        return NextResponse.json({ error: 'Write conflict: newer version on server' }, { status: 409 })
      }
    }

    let page
    if (existingPages.docs.length > 0) {
      console.log('📝 [API] Updating existing page:', existingPages.docs[0].id)
      page = await saveWithRetry(() => payload.update({
        collection: 'pages',
        id: existingPages.docs[0].id,
        data: {
          ...normalized,
          slug: 'home',
          title: normalized.title || 'Home Page',
        },
      }))
    } else {
      console.log('📝 [API] Creating new page')
      page = await saveWithRetry(() => payload.create({
        collection: 'pages',
        data: {
          ...normalized,
          slug: 'home',
          title: normalized.title || 'Home Page',
        },
      }))
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
