'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Save, Eye, Settings, FileText, Image, Calendar, Users } from 'lucide-react'

// Tipuri pentru datele site-ului
type HeaderLogo = { id?: string; url?: string; externalUrl?: string; alt?: string }

interface SiteData {
  hero: {
    heading: string
    secondaryHeading: string
    subheading: string
    ctaText: string
  }
  about: {
    title: string
    description: string
    features: string[]
    image?: { id?: string; url?: string; externalUrl?: string; alt?: string }
  }
  services: {
    title: string
    items: Array<{
      name: string
      description: string
      icon: string
    }>
  }
  events: Array<{
    id: string
    title: string
    description: string
    date: string
    category: string
    price: number
    availableSpots: number
  }>
  gallery: Array<{
    id: string
    url: string
    alt: string
  }>
  header?: {
    siteName?: string;
    logo?: HeaderLogo
    nav?: Array<{ label: string; href: string; cta?: boolean }>
  }
}

// Date default
const defaultData: SiteData = {
  hero: {
    heading: "Event Venue Buzău",
    secondaryHeading: "prind viață",
    subheading: "Spațiu perfect pentru evenimente memorabile",
    ctaText: "Rezervă acum"
  },
  about: {
    title: "Despre noi",
    description: "Oferim un spațiu elegant și modern pentru evenimente de toate tipurile, cu facilități de top și servicii personalizate.",
    features: [
      'Spațiu exterior cu piscină',
      'Sală interioară elegantă',
      'Capacitate până la 200 persoane',
      'Parcare privată',
      'Catering personalizat'
    ],
    image: undefined,
  },
  services: {
    title: "Serviciile noastre",
    items: [
      {
        name: "Evenimente Corporate",
        description: "Conferințe, training-uri, lansări de produse",
        icon: "briefcase"
      },
      {
        name: "Nunți",
        description: "Ceremonii și petreceri de nuntă personalizate",
        icon: "heart"
      },
      {
        name: "Petreceri Private",
        description: "Aniversări, zile de naștere, reuniuni de familie",
        icon: "partypopper"
      },
      {
        name: "Evenimente Speciale",
        description: "Botezuri, confirmări, evenimente tematice",
        icon: "sparkles"
      }
    ]
  },
  events: [
    {
      id: "1",
      title: "Workshop de Fotografie",
      description: "Învață tehnici profesionale de fotografie cu experți în domeniu.",
      date: "2024-12-15",
      category: "Workshop",
      price: 150,
      availableSpots: 20
    },
    {
      id: "2",
      title: "Petrecere de Anul Nou",
      description: "Celebrează anul nou într-un mod memorabil cu prietenii și familia.",
      date: "2024-12-31",
      category: "Petrecere",
      price: 200,
      availableSpots: 100
    }
  ],
  gallery: [],
  header: {
    siteName: "Event Venue Buzău",
    nav: [
      { label: 'Despre', href: '#about' },
      { label: 'Servicii', href: '#services' },
      { label: 'Galerie', href: '#gallery' },
      { label: 'Evenimente', href: '#events' },
      { label: 'Testimoniale', href: '#testimonials' },
      { label: 'Contact', href: '#contact' },
      { label: 'Rezervă acum', href: '#contact', cta: true }
    ]
  }
}

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

type PayloadFeature = string | { feature?: string | null }

type PayloadImageDoc = {
  id?: string | null
  _id?: string | null
  url?: string | null
  externalUrl?: string | null
  filename?: string | null
  alt?: string | null
}

type PayloadNavItem = { label?: string | null; href?: string | null; cta?: boolean | null }

type PayloadServicesItem = { name?: string | null; description?: string | null; icon?: string | null }

interface PayloadPageResponse {
  hero?: Partial<SiteData['hero']>
  about?: {
    title?: string | null
    description?: unknown
    features?: PayloadFeature[] | null
    image?: PayloadImageDoc | null
  }
  services?: {
    title?: string | null
    items?: PayloadServicesItem[] | null
  }
  header?: {
    siteName?: string | null
    logo?: PayloadImageDoc | null
    nav?: Array<PayloadNavItem> | null
  }
}

interface GalleryUploadResponse {
  id?: string | null
  url?: string | null
  externalUrl?: string | null
  alt?: string | null
}

const normalizeFeatures = (features?: PayloadFeature[] | null): string[] => {
  if (!Array.isArray(features)) return []
  return features
    .map((feature) => {
      if (typeof feature === 'string') return feature.trim()
      return feature?.feature?.trim() ?? ''
    })
    .filter(isNonEmptyString)
}

const normalizeImage = (image?: PayloadImageDoc | null): SiteData['about']['image'] | undefined => {
  if (!image) return undefined
  const url = image.externalUrl ?? image.url ?? undefined
  const id = image.id ?? image._id ?? undefined
  if (!id && !url) return undefined
  return {
    id,
    url: image.url ?? undefined,
    externalUrl: image.externalUrl ?? undefined,
    alt: image.alt ?? ''
  }
}

const normalizeNav = (nav?: Array<PayloadNavItem> | null): Array<{ label: string; href: string; cta?: boolean }> => {
  if (!Array.isArray(nav)) return []
  return nav
    .map((item) => ({
      label: item?.label ?? '',
      href: item?.href ?? '',
      cta: Boolean(item?.cta),
    }))
    .filter((item) => item.label !== '' || item.href !== '')
}

const mapPayloadToSiteData = (payload?: PayloadPageResponse | null): SiteData => {
  const hero: SiteData['hero'] = {
    heading: payload?.hero?.heading ?? defaultData.hero.heading,
    secondaryHeading: payload?.hero?.secondaryHeading ?? defaultData.hero.secondaryHeading,
    subheading: payload?.hero?.subheading ?? defaultData.hero.subheading,
    ctaText: payload?.hero?.ctaText ?? defaultData.hero.ctaText,
  }

  const payloadFeatures = normalizeFeatures(payload?.about?.features)
  const aboutImage = normalizeImage(payload?.about?.image)

  const about: SiteData['about'] = {
    title: payload?.about?.title ?? defaultData.about.title,
    description: typeof payload?.about?.description === 'string' ? payload.about.description : defaultData.about.description,
    features: payloadFeatures.length > 0 ? payloadFeatures : defaultData.about.features,
    image: aboutImage,
  }

  const servicesItems = Array.isArray(payload?.services?.items) && payload.services?.items?.length
    ? payload.services.items.map((item) => ({
        name: item?.name ?? '',
        description: item?.description ?? '',
        icon: item?.icon ?? '',
      }))
    : defaultData.services.items

  const services: SiteData['services'] = {
    title: payload?.services?.title ?? defaultData.services.title,
    items: servicesItems,
  }

  const navItems = normalizeNav(payload?.header?.nav)
  const headerLogo = normalizeImage(payload?.header?.logo)
  const header: SiteData['header'] = {
    siteName: payload?.header?.siteName ?? defaultData.header?.siteName,
    logo: headerLogo,
    nav: navItems.length > 0 ? navItems : defaultData.header?.nav,
  }

  return {
    hero,
    about,
    services,
    events: defaultData.events,
    gallery: defaultData.gallery,
    header,
  }
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('header')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState<SiteData>(defaultData)
  const [featuresText, setFeaturesText] = useState<string>(defaultData.about.features.join('\n'))
  // About image upload (single) - gallery-like UX
  const [aboutDragActive, setAboutDragActive] = useState(false)
  const [aboutPendingFiles, setAboutPendingFiles] = useState<File[]>([])
  const [aboutIsUploading, setAboutIsUploading] = useState(false)

  const updateServicesTitle = (title: string) => {
    const next = {
      ...siteData,
      services: {
        ...siteData.services,
        title,
      },
    }
    setSiteData(next)
    setIsEditing(true)
  }

  const updateServiceItem = (index: number, field: 'name' | 'description' | 'icon', value: string) => {
    const items = Array.isArray(siteData.services.items) ? [...siteData.services.items] : []
    items[index] = { ...items[index], [field]: value }
    const next = {
      ...siteData,
      services: {
        ...siteData.services,
        items,
      },
    }
    setSiteData(next)
    setIsEditing(true)
  }

  const handleHeaderChange = useCallback((header: SiteData['header']) => { 
    setSiteData(prev => ({...prev, header})); 
    setIsEditing(true);
  }, [])

  // Încarcă datele din baza de date (Payload) la inițializare
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/pages', { cache: 'no-store' })
        if (res.ok) {
          const payload = (await res.json()) as PayloadPageResponse
          const mapped = mapPayloadToSiteData(payload)
          setIsEditing(false) // Reset editing state on load
          setSiteData(mapped)
          setFeaturesText(mapped.about.features.join('\n'))
        }
      } catch (e) {
        console.error('Failed to load page data:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      const featuresArray = featuresText.split('\n').map((v) => v.trim()).filter(Boolean)
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Home Page',
          hero: {
            heading: siteData.hero.heading,
            secondaryHeading: siteData.hero.secondaryHeading,
            subheading: siteData.hero.subheading,
            ctaText: siteData.hero.ctaText,
          },
          about: {
            title: siteData.about.title,
            description: siteData.about.description,
            features: featuresArray, // API normalizează string[] -> { feature }
            image: siteData.about.image?.id,
          },
          services: siteData.services,
          header: {
            siteName: siteData.header?.siteName,
            logo: siteData.header?.logo?.id,
            nav: siteData.header?.nav,
          },
        }),
      })
      if (!res.ok) throw new Error('Save failed')

      // Anunță frontend-ul să reîncarce din API
      window.dispatchEvent(new CustomEvent('adminDataSaved'))
      if (window.opener) window.opener.postMessage({ type: 'adminDataSaved' }, '*')

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setIsEditing(false)

      // Reload admin state from DB to show persisted values
      try {
        const reloadRes = await fetch('/api/pages', { cache: 'no-store' })
        if (reloadRes.ok) {
          const payload = (await reloadRes.json()) as PayloadPageResponse
          const mapped = mapPayloadToSiteData(payload)
          setSiteData(mapped)
          setFeaturesText(mapped.about.features.join('\n'))
        }
      } catch (e2) {
        console.error('Failed to reload after save:', e2)
      }
    } catch (e) {
      console.error('Failed to save page data:', e)
      alert('Eroare la salvare. Verifică consola.')
    }
  }

  // Save snapshot helper (used after image upload/delete to auto-save)
  const autoSaveAboutImage = async (nextImage: SiteData['about']['image'] | undefined) => {
    const featuresArray = featuresText
      .split('\n')
      .map((value) => value.trim())
      .filter(isNonEmptyString)
    const snapshot: SiteData = {
      ...siteData,
      about: { ...siteData.about, image: nextImage },
    }
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Home Page',
        hero: snapshot.hero,
        about: {
          title: snapshot.about.title,
          description: snapshot.about.description,
          features: featuresArray,
          image: snapshot.about.image?.id,
        },
        services: snapshot.services,
        header: {
          siteName: snapshot.header?.siteName,
          logo: snapshot.header?.logo?.id,
          nav: snapshot.header?.nav,
        },
      }),
    })
    if (res.ok) {
      window.dispatchEvent(new CustomEvent('adminDataSaved'))
      if (window.opener) window.opener.postMessage({ type: 'adminDataSaved' }, '*')
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
      setIsEditing(false)
    }
  }

  const removeAboutImageFromServer = async (image?: SiteData['about']['image']) => {
    if (!image) return
    if (image.id) {
      await fetch(`/api/gallery?id=${image.id}`, { method: 'DELETE' })
      return
    }
    const removableUrl = image.externalUrl ?? image.url
    if (removableUrl) {
      const encodedUrl = encodeURIComponent(removableUrl)
      await fetch(`/api/gallery?url=${encodedUrl}`, { method: 'DELETE' })
    }
  }

  const uploadAboutImageFile = async (file: File | null) => {
    if (!file) return
    setAboutIsUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', 'indoor')
      form.append('folder', 'about')
      const response = await fetch('/api/gallery/upload', { method: 'POST', body: form })
      if (!response.ok) return
      const doc = (await response.json()) as GalleryUploadResponse

      const previousImage = siteData.about.image
      if (previousImage) {
        await removeAboutImageFromServer(previousImage)
      }

      const uploadedImage: SiteData['about']['image'] = {
        id: doc.id ?? undefined,
        url: doc.url ?? undefined,
        externalUrl: doc.externalUrl ?? undefined,
        alt: doc.alt ?? '',
      }

      setSiteData(prev => ({
        ...prev,
        about: { ...prev.about, image: uploadedImage },
      }))

      await autoSaveAboutImage(uploadedImage)
      setIsEditing(true)
    } finally {
      setAboutIsUploading(false)
      setAboutPendingFiles([])
    }
  }

  const tabs = [
    { id: 'header', label: 'Header', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: FileText },
    { id: 'about', label: 'Despre', icon: Users },
    { id: 'services', label: 'Servicii', icon: Settings },
    { id: 'events', label: 'Evenimente', icon: Calendar },
    { id: 'gallery', label: 'Galerie', icon: Image },
  ]

  const handleDeleteAboutImage = async () => {
    await removeAboutImageFromServer(siteData.about.image)
    setSiteData(prev => ({ ...prev, about: { ...prev.about, image: undefined } }))
    setAboutPendingFiles([])
    await autoSaveAboutImage(undefined)
    setIsEditing(true)
  }

  const renderAboutUploadControls = (variant: 'replace' | 'initial') => {
    const dropZonePadding = variant === 'replace' ? 'p-4' : 'p-6'
    const description = variant === 'replace'
      ? 'Înlocuiește imaginea: trage aici sau alege din calculator'
      : 'Trage și plasează imaginea aici sau alege din calculator'
    const containerSpacing = variant === 'replace' ? 'mt-3' : ''
    const textMargin = variant === 'replace' ? 'mb-2' : 'mb-3'

    return (
      <div className={containerSpacing}>
        <div
          onDragOver={(event) => { event.preventDefault(); setAboutDragActive(true) }}
          onDragLeave={() => setAboutDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setAboutDragActive(false)
            setAboutPendingFiles(Array.from(event.dataTransfer.files).slice(0, 1))
          }}
          className={`border-2 border-dashed rounded-lg text-center ${dropZonePadding} ${aboutDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <p className={`text-sm text-gray-600 ${textMargin}`}>{description}</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setAboutPendingFiles(event.target.files ? Array.from(event.target.files).slice(0, 1) : [])}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {aboutPendingFiles.length > 0 && (
            <div className="mt-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>{aboutPendingFiles[0].name}</span>
                <button
                  type="button"
                  disabled={aboutIsUploading}
                  onClick={() => uploadAboutImageFile(aboutPendingFiles[0] ?? null)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {aboutIsUploading ? 'Se încarcă...' : 'Încarcă'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const aboutImage = siteData.about.image
  const aboutImageUrl = aboutImage?.externalUrl ?? aboutImage?.url ?? ''
  const aboutImageAlt = aboutImage?.alt ?? 'Imagine Despre noi'
  const hasAboutImage = isNonEmptyString(aboutImageUrl)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Event Venue Buzău - Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vezi site-ul
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {saved ? 'Salvat!' : 'Salvează'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Editează conținutul pentru {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()}
                </p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'header' && (
                      <HeaderAdminSection
                        value={siteData.header}
                        onChange={handleHeaderChange}
                      />
                    )}
                    {activeTab === 'hero' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titlu principal
                      </label>
                      <input
                        type="text"
                        value={siteData.hero.heading}
                        onChange={(e) => { const next={...siteData, hero:{...siteData.hero, heading:e.target.value}}; setSiteData(next); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titlu secundar
                      </label>
                      <input
                        type="text"
                        value={siteData.hero.secondaryHeading}
                        onChange={(e) => { const next={...siteData, hero:{...siteData.hero, secondaryHeading:e.target.value}}; setSiteData(next); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="prind viață"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitlu
                      </label>
                      <input
                        type="text"
                        value={siteData.hero.subheading}
                        onChange={(e) => { const next={...siteData, hero:{...siteData.hero, subheading:e.target.value}}; setSiteData(next); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text buton
                      </label>
                      <input
                        type="text"
                        value={siteData.hero.ctaText}
                        onChange={(e) => { const next={...siteData, hero:{...siteData.hero, ctaText:e.target.value}}; setSiteData(next); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titlu secțiune
                      </label>
                      <input
                        type="text"
                        value={siteData.about.title}
                        onChange={(e) => { const next={...siteData, about:{...siteData.about, title:e.target.value}}; setSiteData(next); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descriere
                      </label>
                      <textarea
                        rows={4}
                        value={siteData.about.description}
                        onChange={(e) => { const next={...siteData, about:{...siteData.about, description:e.target.value}}; setSiteData(next); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facilități (una pe linie)
                      </label>
                      <textarea
                        rows={6}
                        value={featuresText}
                        onChange={(e) => { setFeaturesText(e.target.value); setIsEditing(true) }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Imagine Despre noi - uploader tip galerie (single) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagine (Despre noi) – afișată în coloana dreaptă
                      </label>
                      {hasAboutImage ? (
                        <div className="mb-4">
                          <div className="relative aspect-[4/3] max-w-sm rounded-lg overflow-hidden border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={aboutImageUrl}
                              alt={aboutImageAlt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 truncate">
                              {aboutImageAlt}
                            </div>
                            <button
                              onClick={handleDeleteAboutImage}
                              className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
                            >
                              Șterge
                            </button>
                          </div>
                          {renderAboutUploadControls('replace')}
                        </div>
                      ) : (
                        renderAboutUploadControls('initial')
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titlu secțiune
                      </label>
                      <input
                        type="text"
                        value={siteData.services.title}
                        onChange={(e) => updateServicesTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(siteData.services.items || []).map((service, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateServiceItem(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                          />
                          <textarea
                            rows={2}
                            value={service.description}
                            onChange={(e) => updateServiceItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                          />
                          <input
                            type="text"
                            placeholder="Icon (lucide-react name, ex: briefcase)"
                            value={service.icon}
                            onChange={(e) => updateServiceItem(index, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Evenimente tematice</h3>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Adaugă eveniment
                      </button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: 'Workshop de Fotografie', date: '2024-12-15', price: 150, spots: 20 },
                        { title: 'Petrecere de Anul Nou', date: '2024-12-31', price: 200, spots: 100 }
                      ].map((event, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              defaultValue={event.title}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={() => setIsEditing(true)}
                            />
                            <input
                              type="date"
                              defaultValue={event.date}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={() => setIsEditing(true)}
                            />
                            <input
                              type="number"
                              defaultValue={event.price}
                              placeholder="Preț"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={() => setIsEditing(true)}
                            />
                            <input
                              type="number"
                              defaultValue={event.spots}
                              placeholder="Locuri disponibile"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={() => setIsEditing(true)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <GalleryManager />
                )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="px-4 py-2 rounded-md shadow-lg bg-green-600 text-white text-sm">
            Salvat
          </div>
        </div>
      )}
    </div>
  )
}

type GalleryItem = {
  id: string
  externalUrl?: string
  url?: string
  alt?: string
  title?: string
  order?: number
  [key: string]: unknown
}

function GalleryManager() {
  const [category, setCategory] = useState<'indoor' | 'outdoor' | 'pool' | 'events'>('indoor')
  const [items, setItems] = useState<Record<'indoor'|'outdoor'|'pool'|'events', GalleryItem[]>>({ indoor: [], outdoor: [], pool: [], events: [] })
  const [loading, setLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/gallery?category=all', { cache: 'no-store' })
        const data = await res.json()
        setItems({
          indoor: data.indoor || [],
          outdoor: data.outdoor || [],
          pool: data.pool || [],
          events: data.events || [],
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])


  const uploadFiles = async (files: File[]) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      for (const file of files) {
        const form = new FormData()
        form.append('file', file)
        form.append('category', category)
        form.append('alt', file.name)
        form.append('title', '')
        const res = await fetch('/api/gallery/upload', { method: 'POST', body: form })
        if (res.ok) {
          const doc = await res.json()
          setItems((prev) => ({ ...prev, [category]: [doc, ...(prev[category] || [])] }))
        }
      }
    } finally {
      setIsUploading(false)
      setPendingFiles([])
    }
  }

  const categories: Array<{ id: 'indoor'|'outdoor'|'pool'|'events'; label: string }> = [
    { id: 'indoor', label: 'Interior' },
    { id: 'outdoor', label: 'Exterior' },
    { id: 'pool', label: 'Piscină' },
    { id: 'events', label: 'Evenimente' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">Galerie imagini</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${category === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>


      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); setPendingFiles(Array.from(e.dataTransfer.files)) }}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <p className="text-sm text-gray-600 mb-3">Trage și plasează imagini aici sau alege din calculator</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPendingFiles(e.target.files ? Array.from(e.target.files) : [])}
          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {pendingFiles.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>{pendingFiles.length} fișier(e) selectate</span>
              <button
                disabled={isUploading}
                onClick={() => uploadFiles(pendingFiles)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                {isUploading ? 'Se încarcă...' : 'Încarcă'}
              </button>
            </div>
            <ul className="mt-2 max-h-32 overflow-auto text-left list-disc list-inside">
              {pendingFiles.map((f, i) => (
                <li key={i} className="truncate">{f.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <ReorderableGrid
          items={items[category] || []}
          onDelete={async (id) => {
            const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
            if (res.ok) setItems((prev) => ({ ...prev, [category]: (prev[category] || []).filter((x) => x.id !== id) }))
          }}
          onReorder={async (ordered) => {
            setItems((prev) => ({ ...prev, [category]: ordered }))
            await fetch('/api/gallery/reorder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderedIds: ordered.map((x: GalleryItem) => x.id) }),
            })
          }}
        />
      )}
    </div>
  )
}

function ReorderableGrid({ items, onDelete, onReorder }: { items: GalleryItem[]; onDelete: (id: string) => void | Promise<void>; onReorder: (items: GalleryItem[]) => void | Promise<void> }) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [list, setList] = useState<GalleryItem[]>(items)

  useEffect(() => setList(items), [items])

  const onDragStart = (idx: number) => setDragIdx(idx)
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const updated = [...list]
    const [moved] = updated.splice(dragIdx, 1)
    updated.splice(idx, 0, moved)
    setList(updated)
    setDragIdx(idx)
  }
  const onDragEnd = async () => {
    setDragIdx(null)
    await onReorder(list)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {list.map((img: GalleryItem, idx: number) => (
        <div
          key={img.id}
          draggable
          onDragStart={() => onDragStart(idx)}
          onDragOver={(e) => onDragOver(e, idx)}
          onDragEnd={onDragEnd}
          className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.externalUrl || img.url} alt={img.alt} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 truncate">{img.alt}</div>
          <button
            onClick={() => onDelete(img.id)}
            className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
          >
            Șterge
          </button>
        </div>
      ))}
    </div>
  )
}

function HeaderAdminSection({ value, onChange }: { value?: SiteData['header']; onChange: (h: SiteData['header']) => void }) {
  const [localNav, setLocalNav] = useState(value?.nav ?? [
    { label: 'Despre', href: '#about' },
    { label: 'Servicii', href: '#services' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'Evenimente', href: '#events' },
    { label: 'Testimoniale', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
    { label: 'Rezervă acum', href: '#contact', cta: true }
  ])
  const [siteName, setSiteName] = useState(value?.siteName ?? 'Event Venue Buzău')
  const [logo, setLogo] = useState(value?.logo)
  const [logoDragActive, setLogoDragActive] = useState(false)
  const [logoPendingFiles, setLogoPendingFiles] = useState<File[]>([])
  const [logoIsUploading, setLogoIsUploading] = useState(false)

  // Sync local state with external state when value changes (e.g. after save reload)
  useEffect(() => {
    if (value?.siteName !== undefined) setSiteName(value.siteName)
    if (value?.nav !== undefined) setLocalNav(value.nav)
    if (value?.logo !== undefined) setLogo(value.logo)
  }, [value])

  const handleSiteNameChange = (newName: string) => {
    setSiteName(newName)
    onChange({ siteName: newName, logo, nav: localNav })
  }

  const handleLogoChange = (newLogo: HeaderLogo | undefined) => {
    setLogo(newLogo)
    onChange({ siteName, logo: newLogo, nav: localNav })
  }

  const handleNavChange = (i: number, k: 'label'|'href'|'cta', v: string|boolean) => {
    const updatedNav = localNav.map((item, idx) => idx === i ? { ...item, [k]: v } : item)
    setLocalNav(updatedNav)
    onChange({ siteName, logo, nav: updatedNav })
  }

  const handleAdd = () => {
    const updatedNav = [...localNav, { label: '', href: '' }]
    setLocalNav(updatedNav)
    onChange({ siteName, logo, nav: updatedNav })
  }

  const handleDelete = (i: number) => {
    const updatedNav = localNav.filter((_, idx) => idx !== i)
    setLocalNav(updatedNav)
    onChange({ siteName, logo, nav: updatedNav })
  }
  const handleReorder = (from: number, to: number) => {
    const copy = [...localNav]
    const [m] = copy.splice(from, 1)
    copy.splice(to, 0, m)
    setLocalNav(copy)
    onChange({ siteName, logo, nav: copy })
  }

  const uploadLogoFile = async (file: File | null) => {
    if (!file) return
    setLogoIsUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', 'indoor')
      form.append('folder', 'logo')
      const response = await fetch('/api/gallery/upload', { method: 'POST', body: form })
      if (!response.ok) return
      const doc = (await response.json()) as GalleryUploadResponse

      // Remove previous logo if exists
      if (logo) {
        await removeLogoFromServer(logo)
      }

      const uploadedLogo: HeaderLogo = {
        id: doc.id ?? undefined,
        url: doc.url ?? undefined,
        externalUrl: doc.externalUrl ?? undefined,
        alt: doc.alt ?? 'Logo site',
      }

      handleLogoChange(uploadedLogo)
    } finally {
      setLogoIsUploading(false)
      setLogoPendingFiles([])
    }
  }

  const removeLogoFromServer = async (logoToRemove?: HeaderLogo) => {
    if (!logoToRemove) return
    if (logoToRemove.id) {
      await fetch(`/api/gallery?id=${logoToRemove.id}`, { method: 'DELETE' })
      return
    }
    const removableUrl = logoToRemove.externalUrl ?? logoToRemove.url
    if (removableUrl) {
      const encodedUrl = encodeURIComponent(removableUrl)
      await fetch(`/api/gallery?url=${encodedUrl}`, { method: 'DELETE' })
    }
  }

  const handleDeleteLogo = async () => {
    await removeLogoFromServer(logo)
    handleLogoChange(undefined)
    setLogoPendingFiles([])
  }

  const renderLogoUploadControls = (variant: 'replace' | 'initial') => {
    const dropZonePadding = variant === 'replace' ? 'p-4' : 'p-6'
    const description = variant === 'replace'
      ? 'Înlocuiește logo-ul: trage aici sau alege din calculator'
      : 'Trage și plasează logo-ul aici sau alege din calculator'
    const containerSpacing = variant === 'replace' ? 'mt-3' : ''
    const textMargin = variant === 'replace' ? 'mb-2' : 'mb-3'

    return (
      <div className={containerSpacing}>
        <div
          onDragOver={(event) => { event.preventDefault(); setLogoDragActive(true) }}
          onDragLeave={() => setLogoDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setLogoDragActive(false)
            setLogoPendingFiles(Array.from(event.dataTransfer.files).slice(0, 1))
          }}
          className={`border-2 border-dashed rounded-lg text-center ${dropZonePadding} ${logoDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <p className={`text-sm text-gray-600 ${textMargin}`}>{description}</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setLogoPendingFiles(event.target.files ? Array.from(event.target.files).slice(0, 1) : [])}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {logoPendingFiles.length > 0 && (
            <div className="mt-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>{logoPendingFiles[0].name}</span>
                <button
                  type="button"
                  disabled={logoIsUploading}
                  onClick={() => uploadLogoFile(logoPendingFiles[0] ?? null)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {logoIsUploading ? 'Se încarcă...' : 'Încarcă'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default logo fallback (the hardcoded one from Header.tsx)
  const defaultLogoUrl = 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/logo/SinglaKidsClub.png'
  
  const logoUrl = logo?.externalUrl ?? logo?.url ?? ''
  const logoAlt = logo?.alt ?? 'Logo site'
  const hasLogo = isNonEmptyString(logoUrl)
  const showDefaultLogo = !hasLogo && defaultLogoUrl

  const handleAdoptDefaultLogo = async () => {
    // Create a logo entry with the default URL
    const defaultLogo: HeaderLogo = {
      id: undefined,
      url: undefined,
      externalUrl: defaultLogoUrl,
      alt: 'Logo site',
    }
    handleLogoChange(defaultLogo)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo site</label>
        {hasLogo ? (
          <div className="mb-4">
            <div className="relative max-w-md rounded-lg overflow-hidden border border-gray-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={logoAlt}
                className="w-full h-auto object-contain max-h-32"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={handleDeleteLogo}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Șterge logo
                </button>
              </div>
            </div>
            {renderLogoUploadControls('replace')}
          </div>
        ) : showDefaultLogo ? (
          <div className="mb-4">
            <div className="relative max-w-md rounded-lg overflow-hidden border-2 border-dashed border-yellow-400 bg-yellow-50 p-4">
              <div className="mb-2 text-sm text-yellow-800 font-medium">
                Logo curent (hardcodat în cod)
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={defaultLogoUrl}
                alt="Logo curent"
                className="w-full h-auto object-contain max-h-32"
              />
              <div className="mt-3 flex justify-between items-center gap-2">
                <p className="text-xs text-yellow-700">
                  Acest logo este fallback-ul din cod. Salvează-l pentru a-l putea edita.
                </p>
                <button
                  onClick={handleAdoptDefaultLogo}
                  className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 whitespace-nowrap"
                >
                  Salvează logo-ul
                </button>
              </div>
            </div>
            {renderLogoUploadControls('replace')}
          </div>
        ) : (
          renderLogoUploadControls('initial')
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Linkuri meniu header:</label>
        <ul className="space-y-2">
          {localNav.map((item, i) => (
            <li key={i} className="flex gap-2 items-center">
              <input value={item.label} onChange={e => handleNavChange(i, 'label', e.target.value)} placeholder="Text link" className="px-2 py-1 border rounded w-36 text-sm" />
              <input value={item.href} onChange={e => handleNavChange(i, 'href', e.target.value)} placeholder="#link" className="px-2 py-1 border rounded w-32 text-sm" />
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!item.cta} onChange={e => handleNavChange(i, 'cta', e.target.checked)} /> CTA</label>
              <button className="text-red-500 text-xs" onClick={() => handleDelete(i)} title="Șterge">✕</button>
              {/* reordering up/down */}
              <button className="text-gray-500 text-xs" disabled={i===0} onClick={() => handleReorder(i, i-1)} title="Sus">↑</button>
              <button className="text-gray-500 text-xs" disabled={i===localNav.length-1} onClick={() => handleReorder(i, i+1)} title="Jos">↓</button>
            </li>
          ))}
        </ul>
        <button className="mt-2 px-2 py-1 text-sm bg-blue-50 border border-blue-100 rounded hover:bg-blue-100" onClick={handleAdd}>Adaugă link nou</button>
      </div>
    </div>
  )
}

