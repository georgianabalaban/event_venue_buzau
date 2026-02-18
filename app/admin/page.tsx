'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Save, Eye, Settings, FileText, Image, Calendar, Users, Upload, X, Trash2 } from 'lucide-react'

// Tipuri pentru datele site-ului
type HeaderLogo = { id?: string; url?: string; externalUrl?: string; alt?: string }

interface ServiceDetail {
  id: string
  imageUrl?: string
  imageId?: string
  description: string
}

interface ServiceDetailsData {
  [serviceName: string]: ServiceDetail[]
}

interface SiteData {
  hero: {
    heading: string
    secondaryHeading: string
    subheading: string
    ctaText: string
    backgroundImage?: { id?: string; url?: string; externalUrl?: string; alt?: string }
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
  const heroBackgroundImage = normalizeImage(payload?.hero?.backgroundImage as PayloadImageDoc | null | undefined)
  
  const hero: SiteData['hero'] = {
    heading: payload?.hero?.heading ?? defaultData.hero.heading,
    secondaryHeading: payload?.hero?.secondaryHeading ?? defaultData.hero.secondaryHeading,
    subheading: payload?.hero?.subheading ?? defaultData.hero.subheading,
    ctaText: payload?.hero?.ctaText ?? defaultData.hero.ctaText,
    backgroundImage: heroBackgroundImage,
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
  // Tab activ în admin (inițial „Header”; îl corectăm pe client în useEffect pe baza ?tab=...)
  const [activeTab, setActiveTab] = useState('header')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState<SiteData>(defaultData)
  const [featuresText, setFeaturesText] = useState<string>(defaultData.about.features.join('\n'))
  
  // Service Details State
  const [serviceDetails, setServiceDetails] = useState<ServiceDetailsData>({})
  const [editingService, setEditingService] = useState<string | null>(null)
  const [newDetailText, setNewDetailText] = useState('')
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false)
 const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null)
  const editImageInputRef = useRef<HTMLInputElement>(null)
  // About image upload (single) - gallery-like UX
  const [aboutDragActive, setAboutDragActive] = useState(false)
  const [aboutPendingFiles, setAboutPendingFiles] = useState<File[]>([])
  const [aboutIsUploading, setAboutIsUploading] = useState(false)
  // Hero background image upload
  const [heroDragActive, setHeroDragActive] = useState(false)
  const [heroPendingFiles, setHeroPendingFiles] = useState<File[]>([])
  const [heroIsUploading, setHeroIsUploading] = useState(false)

  // Aliniem tab-ul activ cu query string-ul (?tab=bookings) DOAR pe client, după hidratare
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      const allowedTabs = ['header', 'hero', 'about', 'services', 'service-details', 'events', 'gallery', 'faq', 'bookings']
      if (tabParam && allowedTabs.includes(tabParam) && tabParam !== activeTab) {
        setActiveTab(tabParam)
      }
    } catch {
      // ignorăm erorile de acces la window (nu ar trebui să apară în client)
    }
  }, [activeTab])

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

  // Service Details Functions
  const handleServiceImageUpload = async (serviceName: string, file: File) => {
    setUploadingServiceImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'events')
      formData.append('alt', serviceName)
      formData.append('title', serviceName)

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return { id: data.id, url: data.externalUrl || data.url }
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploadingServiceImage(false)
    }
    return null
  }

  const handleAddServiceDetail = async (serviceName: string, file: File, description: string) => {
    const uploadedImage = await handleServiceImageUpload(serviceName, file)
    if (uploadedImage) {
      const newDetail: ServiceDetail = {
        id: Date.now().toString(),
        imageUrl: uploadedImage.url,
        imageId: uploadedImage.id,
        description
      }
      
      setServiceDetails(prev => ({
        ...prev,
        [serviceName]: [...(prev[serviceName] || []), newDetail]
      }))
      setIsEditing(true)
    }
  }

  const handleRemoveServiceDetail = (serviceName: string, detailId: string) => {
    setServiceDetails(prev => ({
      ...prev,
      [serviceName]: (prev[serviceName] || []).filter(d => d.id !== detailId)
    }))
    setIsEditing(true)
  }

  const handleUpdateServiceDetailText = (serviceName: string, detailId: string, newText: string) => {
    setServiceDetails(prev => ({
      ...prev,
      [serviceName]: (prev[serviceName] || []).map(d => 
        d.id === detailId ? { ...d, description: newText } : d
      )
    }))
    setIsEditing(true)
  }

  const handleUpdateServiceDetailImage = async (serviceName: string, detailId: string, file: File) => {
    setUploadingServiceImage(true)
    try {
      const uploadedImage = await handleServiceImageUpload(serviceName, file)
      if (uploadedImage) {
        setServiceDetails(prev => ({
          ...prev,
          [serviceName]: (prev[serviceName] || []).map(d => 
            d.id === detailId ? { 
              ...d, 
              imageUrl: uploadedImage.url,
              imageId: uploadedImage.id 
            } : d
          )
        }))
        setIsEditing(true)
        setEditingDetailId(null)
      }
    } finally {
      setUploadingServiceImage(false)
    }
  }

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
        
        // Load service details from localStorage
        const savedDetails = localStorage.getItem('serviceDetails')
        if (savedDetails) {
          setServiceDetails(JSON.parse(savedDetails))
        }
      } catch (e) {
        console.error('Failed to load page data:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto-save service details to localStorage
  useEffect(() => {
    if (Object.keys(serviceDetails).length > 0) {
      localStorage.setItem('serviceDetails', JSON.stringify(serviceDetails))
    }
  }, [serviceDetails])

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
            backgroundImage: siteData.hero.backgroundImage?.id,
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

  // Hero background image functions
  const autoSaveHeroBackground = async (nextImage: SiteData['hero']['backgroundImage'] | undefined) => {
    const featuresArray = featuresText
      .split('\n')
      .map((value) => value.trim())
      .filter(isNonEmptyString)
    const snapshot: SiteData = {
      ...siteData,
      hero: { ...siteData.hero, backgroundImage: nextImage },
    }
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Home Page',
        hero: {
          heading: snapshot.hero.heading,
          secondaryHeading: snapshot.hero.secondaryHeading,
          subheading: snapshot.hero.subheading,
          ctaText: snapshot.hero.ctaText,
          backgroundImage: snapshot.hero.backgroundImage?.id,
        },
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

  const removeHeroBackgroundFromServer = async (image?: SiteData['hero']['backgroundImage']) => {
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

  const uploadHeroBackgroundFile = async (file: File | null) => {
    if (!file) return
    setHeroIsUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', 'outdoor')
      form.append('folder', 'hero')
      const response = await fetch('/api/gallery/upload', { method: 'POST', body: form })
      if (!response.ok) return
      const doc = (await response.json()) as GalleryUploadResponse

      const previousImage = siteData.hero.backgroundImage
      if (previousImage) {
        await removeHeroBackgroundFromServer(previousImage)
      }

      const uploadedImage: SiteData['hero']['backgroundImage'] = {
        id: doc.id ?? undefined,
        url: doc.url ?? undefined,
        externalUrl: doc.externalUrl ?? undefined,
        alt: doc.alt ?? '',
      }

      setSiteData(prev => ({
        ...prev,
        hero: { ...prev.hero, backgroundImage: uploadedImage },
      }))

      await autoSaveHeroBackground(uploadedImage)
      setIsEditing(true)
    } finally {
      setHeroIsUploading(false)
      setHeroPendingFiles([])
    }
  }

  const handleDeleteHeroBackground = async () => {
    await removeHeroBackgroundFromServer(siteData.hero.backgroundImage)
    setSiteData(prev => ({ ...prev, hero: { ...prev.hero, backgroundImage: undefined } }))
    setHeroPendingFiles([])
    await autoSaveHeroBackground(undefined)
    setIsEditing(true)
  }

  const tabs = [
    { id: 'header', label: 'Header', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: FileText },
    { id: 'about', label: 'Despre', icon: Users },
    { id: 'services', label: 'Servicii', icon: Settings },
    { id: 'service-details', label: 'Detalii Servicii', icon: FileText },
    { id: 'events', label: 'Evenimente Tematice', icon: Calendar },
    { id: 'gallery', label: 'Galerie', icon: Image },
    { id: 'faq', label: 'Întrebări Frecvente', icon: FileText },
    { id: 'bookings', label: 'Rezervări', icon: Calendar },
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

  const renderHeroUploadControls = (variant: 'replace' | 'initial') => {
    const dropZonePadding = variant === 'replace' ? 'p-4' : 'p-6'
    const description = variant === 'replace'
      ? 'Înlocuiește imaginea de fundal: trage aici sau alege din calculator'
      : 'Trage și plasează imaginea de fundal aici sau alege din calculator'
    const containerSpacing = variant === 'replace' ? 'mt-3' : ''
    const textMargin = variant === 'replace' ? 'mb-2' : 'mb-3'

    return (
      <div className={containerSpacing}>
        <div
          onDragOver={(event) => { event.preventDefault(); setHeroDragActive(true) }}
          onDragLeave={() => setHeroDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setHeroDragActive(false)
            setHeroPendingFiles(Array.from(event.dataTransfer.files).slice(0, 1))
          }}
          className={`border-2 border-dashed rounded-lg text-center ${dropZonePadding} ${heroDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <p className={`text-sm text-gray-600 ${textMargin}`}>{description}</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setHeroPendingFiles(event.target.files ? Array.from(event.target.files).slice(0, 1) : [])}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {heroPendingFiles.length > 0 && (
            <div className="mt-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>{heroPendingFiles[0].name}</span>
                <button
                  type="button"
                  disabled={heroIsUploading}
                  onClick={() => uploadHeroBackgroundFile(heroPendingFiles[0] ?? null)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {heroIsUploading ? 'Se încarcă...' : 'Încarcă'}
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

  const heroBackground = siteData.hero.backgroundImage
  const heroBackgroundUrl = heroBackground?.externalUrl ?? heroBackground?.url ?? ''
  const heroBackgroundAlt = heroBackground?.alt ?? 'Hero Background'
  const hasHeroBackground = isNonEmptyString(heroBackgroundUrl)

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
                    {/* Hero Background Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagine de fundal (Hero Section)
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Imaginea va acoperi întregul ecran ca fundal pentru Hero Section. Recomandare: imagine landscape de înaltă calitate (min 1920x1080px).
                      </p>
                      {hasHeroBackground ? (
                        <div className="mb-4">
                          <div className="relative aspect-video max-w-2xl rounded-lg overflow-hidden border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={heroBackgroundUrl}
                              alt={heroBackgroundAlt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 truncate">
                              {heroBackgroundAlt || 'Hero Background'}
                            </div>
                            <button
                              onClick={handleDeleteHeroBackground}
                              className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded hover:bg-black/70"
                            >
                              Șterge
                            </button>
                          </div>
                          {renderHeroUploadControls('replace')}
                        </div>
                      ) : (
                        renderHeroUploadControls('initial')
                      )}
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

                {activeTab === 'service-details' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionare Detalii Servicii</h3>
                      <p className="text-sm text-gray-600">Adaugă imagini și descrieri pentru fiecare serviciu. Acestea vor apărea în modal-ul de pe pagina principală.</p>
                    </div>

                    {siteData.services.items.map((service, serviceIndex) => {
                      const details = serviceDetails[service.name] || []
                      const isEditing = editingService === service.name

                      return (
                        <div key={serviceIndex} className="border border-gray-300 rounded-lg overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h4 className="text-lg font-bold text-white">{service.name}</h4>
                            <p className="text-sm text-blue-100 mt-1">{service.description}</p>
                          </div>

                          <div className="p-6 bg-white space-y-4">
                            {/* Lista de imagini existente */}
                            {details.length > 0 && (
                              <div className="space-y-4 mb-4">
                                {details.map((detail, idx) => (
                                  <div key={detail.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                                    {detail.imageUrl && (
                                      <div className="w-32 h-32 flex-shrink-0 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                          src={detail.imageUrl} 
                                          alt={service.name}
                                          className="w-full h-full object-cover rounded"
                                        />
                                        {/* Buton editare imagine - mereu vizibil în colțul dreapta-jos */}
                                        <label className="absolute bottom-1 right-1 cursor-pointer bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700 shadow-lg flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                          Edit
                                          <input
                                            ref={editingDetailId === detail.id ? editImageInputRef : null}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingServiceImage}
                                            onChange={(e) => {
                                              const file = e.target.files?.[0]
                                              if (file) {
                                                handleUpdateServiceDetailImage(service.name, detail.id, file)
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <textarea
                                        value={detail.description}
                                        onChange={(e) => handleUpdateServiceDetailText(service.name, detail.id, e.target.value)}
                                        placeholder="Descriere (2-3 propoziții)"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleRemoveServiceDetail(service.name, detail.id)}
                                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          Șterge
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Form pentru adăugare nou */}
                            {isEditing ? (
                              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Selectează imagine
                                </label>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      setSelectedFile(file)
                                    }
                                  }}
                                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <textarea
                                  value={newDetailText}
                                  onChange={(e) => setNewDetailText(e.target.value)}
                                  placeholder="Adaugă descriere (2-3 propoziții)..."
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                                />
                                <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                      if (!selectedFile) {
                                        alert('Te rog selectează o imagine!')
                                        return
                                      }
                                      if (!newDetailText.trim()) {
                                        alert('Te rog adaugă o descriere!')
                                        return
                                      }
                                      await handleAddServiceDetail(service.name, selectedFile, newDetailText)
                                      setNewDetailText('')
                                      setSelectedFile(null)
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = ''
                                      }
                                      // NU închide form-ul, rămâne deschis pentru a adăuga mai multe
                                    }}
                                    disabled={uploadingServiceImage}
                                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {uploadingServiceImage ? 'Se încarcă...' : 'Salvează'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingService(null)
                                      setNewDetailText('')
                                      setSelectedFile(null)
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = ''
                                      }
                                    }}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                  >
                                    Închide
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingService(service.name)}
                                disabled={uploadingServiceImage}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {uploadingServiceImage ? (
                                  <>Se încarcă...</>
                                ) : (
                                  <>
                                    <Upload className="w-5 h-5" />
                                    Adaugă Imagine + Descriere
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {activeTab === 'events' && (
                  <EventsManager />
                )}

                {activeTab === 'gallery' && (
                  <GalleryManager />
                )}

                {activeTab === 'faq' && (
                  <FAQManager />
                )}

                {activeTab === 'bookings' && (
                  <BookingsManager />
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
  const defaultGallerySlides = [
    { id: '1', title: 'Ce veți găsi la noi?', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/events/whatsapp-image-2025-11-19-at-11-50-43-4--1763546411714.jpeg' },
    { id: '2', title: 'O grădină plină de verdeață', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/events/whatsapp-image-2025-11-19-at-11-50-43-2--1763546510042.jpeg' },
    { id: '3', title: 'Multe locuri de stat la povești', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/img_4567-1761770813244.JPG' },
    { id: '4', title: 'O piscină ce îi așteaptă pe curajoși', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/pool/whatsapp-image-2025-11-19-at-12-05-34-1--1763546982351.jpeg' },
    { id: '5', title: 'Un foișor ce poate găzdui până la 70 de persoane', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/indoor/whatsapp-image-2025-11-19-at-12-14-13-1--1763547340444.jpeg' },
    { id: '6', title: 'Aranjamente cu flori proaspete de sezon', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/indoor/whatsapp-image-2025-11-19-at-12-14-13-2--1763547339885.jpeg' },
    { id: '7', title: 'Un foișor separat acoperit', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/22730850-f44e-42dd-aee9-2dda7b3cec5f-1761770789925.jpg' },
    { id: '8', title: 'O zonă de bufet pentru preparate delicioase', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/indoor/whatsapp-image-2025-11-19-at-12-14-13-6--1763547336861.jpeg' },
    { id: '9', title: 'Multă bucurie și energie bună', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/img_4598-1761770820795.JPG' },
    { id: '10', title: 'Un strop de magie', imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/WhatsApp+Image+2025-11-11+at+12.26.39.jpeg' },
  ]

  const [slides, setSlides] = useState(defaultGallerySlides)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newSlideText, setNewSlideText] = useState('')
  const [newSlideFile, setNewSlideFile] = useState<File | null>(null)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [newSlideError, setNewSlideError] = useState('')

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gallerySlides')
    if (saved) {
      try {
        setSlides(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading gallery:', e)
      }
    }
  }, [])


  // Auto-save to localStorage
  useEffect(() => {
    if (slides.length > 0) {
      localStorage.setItem('gallerySlides', JSON.stringify(slides))
    }
  }, [slides])

  const handleUpdateSlideText = (id: string, newText: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, title: newText } : s))
  }

  const handleUpdateSlideImage = async (id: string, file: File) => {
    setUploadingGallery(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'events')
      formData.append('alt', 'Gallery slide')
      formData.append('title', 'Gallery')
      
      const response = await fetch('/api/gallery/upload', { method: 'POST', body: formData })
      if (response.ok) {
        const data = await response.json()
        const newImageUrl = data.externalUrl || data.url
        setSlides(prev => prev.map(s => s.id === id ? { ...s, imageUrl: newImageUrl } : s))
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleDeleteSlide = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  const handleAddNewSlide = async () => {
    // Validare
    setNewSlideError('')
    
    if (!newSlideFile) {
      setNewSlideError('Te rog să selectezi o imagine!')
      return
    }
    
    if (!newSlideText.trim()) {
      setNewSlideError('Te rog să completezi textul pentru slide!')
      return
    }
    
    setUploadingGallery(true)
    try {
      const formData = new FormData()
      formData.append('file', newSlideFile)
      formData.append('category', 'events')
      formData.append('alt', newSlideText.trim())
      formData.append('title', newSlideText.trim())
      
      const response = await fetch('/api/gallery/upload', { method: 'POST', body: formData })
      if (response.ok) {
        const data = await response.json()
        const newSlide = {
          id: Date.now().toString(),
          title: newSlideText.trim(),
          imageUrl: data.externalUrl || data.url
        }
        setSlides(prev => [...prev, newSlide])
        
        // Reset form
        setNewSlideText('')
        setNewSlideFile(null)
        setNewSlideError('')
        setIsAddingNew(false)
      } else {
        setNewSlideError('Eroare la încărcarea imaginii. Te rog încearcă din nou.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setNewSlideError('Eroare la încărcarea imaginii. Te rog încearcă din nou.')
    } finally {
      setUploadingGallery(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionare Galerie Carusel</h3>
        <p className="text-sm text-gray-600">Editează imaginile și textele care apar în caruselul de pe pagina principală.</p>
      </div>

      {/* Lista cu slide-uri existente */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-start">
            {/* Thumbnail imagine */}
            <div className="w-32 h-32 flex-shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={slide.imageUrl} 
                alt={slide.title}
                className="w-full h-full object-cover rounded"
              />
              {/* Buton edit imagine - mereu vizibil */}
              <label className="absolute bottom-1 right-1 cursor-pointer bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700 shadow-lg flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingGallery}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleUpdateSlideImage(slide.id, file)
                    }
                  }}
                />
              </label>
            </div>

            {/* Text editabil + acțiuni */}
            <div className="flex-1">
              <input
                type="text"
                value={slide.title}
                onChange={(e) => handleUpdateSlideText(slide.id, e.target.value)}
                placeholder="Text pentru slide"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Slide {index + 1}</span>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Șterge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form pentru adăugare slide nou */}
      {isAddingNew ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-gray-900 mb-3">Adaugă slide nou</h4>
          
          {/* Mesaj eroare */}
          {newSlideError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{newSlideError}</span>
            </div>
          )}
          
          {/* Input file */}
          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setNewSlideFile(file)
                  setNewSlideError('')
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploadingGallery}
            />
            {newSlideFile && (
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {newSlideFile.name}
              </p>
            )}
          </div>
          
          {/* Input text */}
          <input
            type="text"
            value={newSlideText}
            onChange={(e) => {
              setNewSlideText(e.target.value)
              setNewSlideError('')
            }}
            placeholder="Text pentru slide (ex: O grădină plină de verdeață)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-3"
            disabled={uploadingGallery}
          />
          
          {/* Butoane */}
          <div className="flex gap-2">
            <button
              onClick={handleAddNewSlide}
              disabled={uploadingGallery}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {uploadingGallery ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Se încarcă...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Salvează
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false)
                setNewSlideText('')
                setNewSlideFile(null)
                setNewSlideError('')
              }}
              disabled={uploadingGallery}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anulează
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Adaugă Slide Nou
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Rezervări (Bookings) - doar listare din Payload
// ---------------------------------------------------------------------------

type BookingItem = {
  id: string
  name: string
  email: string
  phone: string
  eventDate: string
  eventType: string
  guestCount?: number
  message?: string
  status?: string
  createdAt?: string
}

function formatDisplayDate(date: string) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const BookingsManager: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/bookings-admin')
        if (!res.ok) {
          throw new Error(`Eroare la încărcarea rezervărilor (${res.status})`)
        }
        const data = await res.json()
        setBookings(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Error loading bookings:', e)
        setError('Nu am putut încărca rezervările. Încearcă din nou mai târziu.')
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Rezervări din formularul de contact</h3>
        <p className="text-sm text-gray-600">
          Aici vezi toate mesajele trimise prin formularul de contact de pe pagina principală.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-sm text-gray-500">Nu există încă nicio rezervare.</p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.name} <span className="text-xs text-gray-500">({booking.email})</span>
                </p>
                <p className="text-xs text-gray-500">
                  Tel: {booking.phone} · Data: {formatDisplayDate(booking.eventDate)} · Tip:{' '}
                  {booking.eventType || '-'} · Invitați: {booking.guestCount ?? '-'}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                {booking.status === 'confirmed'
                  ? 'Confirmată'
                  : booking.status === 'cancelled'
                  ? 'Anulată'
                  : 'Nouă'}
              </span>
            </div>
            {booking.message && booking.message.trim().length > 0 && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.message}</p>
            )}
            {booking.createdAt && (
              <p className="text-xs text-gray-400">
                Creată la {formatDisplayDate(booking.createdAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}



// FAQ Manager Component
interface FAQItem {
  id: string
  question: string
  answer: string
}

function FAQManager() {
  const defaultFAQs: FAQItem[] = [
    {
      id: '1',
      question: 'Care este capacitatea maximă a locației?',
      answer: 'Locația noastră poate găzdui până la 200 de persoane. Avem atât spațiu exterior cu piscină, cât și sală interioară elegantă, perfect echipate pentru evenimente de orice dimensiune. Facilități precum parcarea, toaletele și zona de catering sunt proiectate pentru a susține acest număr de participanți.',
    },
    {
      id: '2',
      question: 'Ce facem în caz de vreme nefavorabilă?',
      answer: 'Avem atât spațiu exterior, cât și interior complet acoperit și amenajat. În cazul ploii sau vremii nefavorabile, evenimentul poate fi mutat în sala interioară, fără a compromite atmosfera sau calitatea petrecerii. Echipa noastră este pregătită să se adapteze rapid oricăror condiții meteo.',
    },
    {
      id: '3',
      question: 'Aveți parcare disponibilă?',
      answer: 'Da, avem o parcare privată suficient de mare pentru a acomoda toți invitații. Parcarea este gratuită și este situată în imediata apropiere a locației pentru confortul maxim al oaspeților.',
    },
    {
      id: '4',
      question: 'Putem aduce noi mâncarea și băutura?',
      answer: 'Pentru a menține standardele de calitate și siguranță alimentară, colaborăm cu parteneri verificați pentru catering. Putem discuta despre preferințele voastre culinare și vă putem recomanda opțiuni personalizate care să se potrivească perfect evenimentului vostru.',
    },
    {
      id: '5',
      question: 'Organizați mai multe evenimente în același timp?',
      answer: 'Nu. Organizăm un singur eveniment pe zi pentru un singur client. Locația este disponibilă exclusiv pentru dumneavoastră în acea zi, asigurând intimitate completă și atenție deplină din partea echipei noastre.',
    },
    {
      id: '6',
      question: 'Ce servicii sunt incluse în pachetul de bază?',
      answer: 'Pachetul de bază include: închirierea spațiului pentru întreaga zi, mobilier (mese, scaune), decorațiuni de bază, echipament audio-video modern, iluminat ambiental, acces la piscină și grădină, și suportul echipei noastre pe toată durata evenimentului. Putem personaliza pachetul în funcție de nevoile voastre specifice.',
    },
  ]

  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [faqError, setFaqError] = useState('')

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('faqItems')
    if (saved) {
      try {
        setFaqs(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading FAQs:', e)
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (faqs.length > 0) {
      localStorage.setItem('faqItems', JSON.stringify(faqs))
    }
  }, [faqs])

  const handleUpdateQuestion = (id: string, newQuestion: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, question: newQuestion } : f))
  }

  const handleUpdateAnswer = (id: string, newAnswer: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, answer: newAnswer } : f))
  }

  const handleDeleteFAQ = (id: string) => {
    if (confirm('Sigur vrei să ștergi această întrebare?')) {
      setFaqs(prev => prev.filter(f => f.id !== id))
    }
  }

  const handleAddNewFAQ = () => {
    // Validare
    setFaqError('')
    
    if (!newQuestion.trim()) {
      setFaqError('Te rog să completezi întrebarea!')
      return
    }
    
    if (!newAnswer.trim()) {
      setFaqError('Te rog să completezi răspunsul!')
      return
    }

    const newFAQ: FAQItem = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    }

    setFaqs(prev => [...prev, newFAQ])
    
    // Reset form
    setNewQuestion('')
    setNewAnswer('')
    setFaqError('')
    setIsAddingNew(false)
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionare Întrebări Frecvente</h3>
        <p className="text-sm text-gray-600">Editează întrebările și răspunsurile care apar pe pagina principală.</p>
      </div>

      {/* Lista cu întrebări existente */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-gray-500">Întrebarea {index + 1}</span>
              <button
                onClick={() => handleDeleteFAQ(faq.id)}
                className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Șterge
              </button>
            </div>
            
            {/* Întrebare editabilă */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Întrebare:</label>
              <textarea
                value={faq.question}
                onChange={(e) => handleUpdateQuestion(faq.id, e.target.value)}
                placeholder="Întrebarea..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Răspuns editabil */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Răspuns:</label>
              <textarea
                value={faq.answer}
                onChange={(e) => handleUpdateAnswer(faq.id, e.target.value)}
                placeholder="Răspunsul..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Form pentru adăugare FAQ nou */}
      {isAddingNew ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-gray-900 mb-3">Adaugă întrebare nouă</h4>
          
          {/* Mesaj eroare */}
          {faqError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{faqError}</span>
            </div>
          )}
          
          {/* Input întrebare */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Întrebare:</label>
            <textarea
              value={newQuestion}
              onChange={(e) => {
                setNewQuestion(e.target.value)
                setFaqError('')
              }}
              placeholder="Scrie întrebarea (ex: Care este capacitatea maximă?)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          {/* Input răspuns */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Răspuns:</label>
            <textarea
              value={newAnswer}
              onChange={(e) => {
                setNewAnswer(e.target.value)
                setFaqError('')
              }}
              placeholder="Scrie răspunsul..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          
          {/* Butoane */}
          <div className="flex gap-2">
            <button
              onClick={handleAddNewFAQ}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Salvează
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false)
                setNewQuestion('')
                setNewAnswer('')
                setFaqError('')
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Anulează
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adaugă Întrebare Nouă
        </button>
      )}
    </div>
  )
}


// Events Manager Component
interface EventItem {
  id: string
  title: string
  description: string
  date: string
  category: string
  price: number
  availableSpots: number
  imageUrl?: string
}

function EventsManager() {
  const defaultEvents: EventItem[] = [
    {
      id: '1',
      title: 'Petrecere de Crăciun',
      description: 'Sărbătorește Crăciunul într-o atmosferă magică',
      date: '2025-12-20',
      category: 'party',
      price: 150,
      availableSpots: 50,
      imageUrl: '',
    },
    {
      id: '2',
      title: 'Revelion 2026',
      description: 'Întâmpină Anul Nou cu stil',
      date: '2025-12-31',
      category: 'party',
      price: 250,
      availableSpots: 30,
      imageUrl: '',
    },
  ]

  const [events, setEvents] = useState<EventItem[]>(defaultEvents)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [eventError, setEventError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveNotification, setSaveNotification] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' })
  const [uploadingEventImage, setUploadingEventImage] = useState(false)

  // Form states for new event
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newCategory, setNewCategory] = useState('party')
  const [newPrice, setNewPrice] = useState('')
  const [newSpots, setNewSpots] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)

  // Show notification helper
  const showNotification = (type: 'success' | 'error', message: string) => {
    setSaveNotification({ show: true, type, message })
    setTimeout(() => {
      setSaveNotification({ show: false, type, message: '' })
    }, 3000)
  }

  // Format date for input (extract YYYY-MM-DD from ISO string or Date object)
  const formatDateForInput = (date: string | Date): string => {
    if (!date) return ''
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  // Load events from DB with localStorage fallback
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true)
      try {
        // Try loading from localStorage first (immediate)
        const cached = localStorage.getItem('eventsCache')
        if (cached) {
          try {
            const cachedEvents = JSON.parse(cached)
            setEvents(cachedEvents)
          } catch (e) {
            console.error('Error parsing cached events:', e)
          }
        }
        
        // Then try loading from DB (will update if DB responds)
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          // Folosim strict ce vine din DB; dacă nu sunt evenimente => listă goală
          const eventsData = Array.isArray(data) ? data : []
          setEvents(eventsData)
          // Cache to localStorage
          localStorage.setItem('eventsCache', JSON.stringify(eventsData))
        }
      } catch (error) {
        console.error('Error loading events:', error)
        // If DB fails, use cached or default
        const cached = localStorage.getItem('eventsCache')
        if (cached) {
          setEvents(JSON.parse(cached))
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  const categoryOptions = [
    { value: 'corporate', label: 'Corporate' },
    { value: 'party', label: 'Petrecere' },
    { value: 'wedding', label: 'Nuntă' },
    { value: 'birthday', label: 'Aniversare' },
    { value: 'other', label: 'Altele' },
  ]

  const handleEditEvent = (event: EventItem) => {
    setEditingId(event.id)
    setEditingEvent({ ...event })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingEvent(null)
  }

  const handleUpdateField = (field: keyof EventItem, value: string | number) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [field]: value })
    }
  }

  const handleSaveEvent = async () => {
    if (!editingEvent) return
    
    setIsSaving(true)
    try {
      // Check if ID looks like MongoDB ID (24 hex chars) or local ID
      const isMongoId = /^[a-f\d]{24}$/i.test(editingEvent.id)
      
      if (!isMongoId) {
        // This is a local/default event - Create it in DB
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editingEvent.title,
            description: editingEvent.description,
            date: editingEvent.date,
            category: editingEvent.category,
            price: editingEvent.price,
            availableSpots: editingEvent.availableSpots,
            imageUrl: editingEvent.imageUrl,
          }),
        })
        
        if (response.ok) {
          const savedEvent = await response.json()
          // Update local state with new MongoDB ID
          setEvents(prev => {
            const updated = prev.map(e => e.id === editingEvent.id ? savedEvent : e)
            localStorage.setItem('eventsCache', JSON.stringify(updated))
            return updated
          })
          showNotification('success', 'Eveniment salvat cu succes!')
          setEditingId(null)
          setEditingEvent(null)
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          showNotification('error', `Eroare: ${errorData.error || 'Conexiune DB eșuată'}`)
        }
      } else {
        // Update existing DB event
        const response = await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEvent),
        })
        
        if (response.ok) {
          setEvents(prev => {
            const updated = prev.map(e => e.id === editingEvent.id ? editingEvent : e)
            localStorage.setItem('eventsCache', JSON.stringify(updated))
            return updated
          })
          showNotification('success', 'Modificări salvate cu succes!')
          setEditingId(null)
          setEditingEvent(null)
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          showNotification('error', `Eroare: ${errorData.error || 'Conexiune DB eșuată'}`)
        }
      }
    } catch (error) {
      console.error('Error saving event:', error)
      showNotification('error', 'Eroare la salvarea în DB!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateEventImage = async (event: EventItem, file: File) => {
    if (!event) return
    setUploadingEventImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'events')
      formData.append('alt', event.title)
      formData.append('title', event.title)

      const uploadRes = await fetch('/api/gallery/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) {
        showNotification('error', 'Eroare la încărcarea imaginii. Încearcă din nou.')
        return
      }
      const data = await uploadRes.json()
      const newImageUrl: string | undefined = data.externalUrl || data.url
      if (!newImageUrl) {
        showNotification('error', 'Nu am primit un URL valid pentru imagine.')
        return
      }

      // Actualizăm imediat în state + localStorage
      setEvents(prev => {
        const updated = prev.map(e => e.id === event.id ? { ...e, imageUrl: newImageUrl } : e)
        localStorage.setItem('eventsCache', JSON.stringify(updated))
        return updated
      })

      // Actualizăm și editingEvent pentru preview imediat
      if (editingEvent && editingEvent.id === event.id) {
        setEditingEvent({ ...editingEvent, imageUrl: newImageUrl })
      }

      // Persistăm și în DB (create sau update, similar cu handleSaveEvent)
      const isMongoId = /^[a-f\d]{24}$/i.test(event.id)
      if (!isMongoId) {
        // Eveniment local → creare în DB
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: event.title,
            description: event.description,
            date: event.date,
            category: event.category,
            price: event.price,
            availableSpots: event.availableSpots,
            imageUrl: newImageUrl,
          }),
        })
        if (res.ok) {
          const savedEvent = await res.json()
          setEvents(prev => {
            const updated = prev.map(e => e.id === event.id ? savedEvent : e)
            localStorage.setItem('eventsCache', JSON.stringify(updated))
            return updated
          })
          showNotification('success', 'Imagine eveniment actualizată cu succes!')
        } else {
          const err = await res.json().catch(() => ({}))
          console.error('Error saving event image (create):', err)
          showNotification('error', 'Imagine încărcată local, dar salvarea în DB a eșuat.')
        }
      } else {
        // Eveniment existent în DB → update
        const res = await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...event, imageUrl: newImageUrl }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.error('Error saving event image (update):', err)
          showNotification('error', 'Imagine actualizată local, dar salvarea în DB a eșuat.')
        } else {
          showNotification('success', 'Imagine eveniment actualizată cu succes!')
        }
      }
    } catch (err) {
      console.error('Error uploading event image:', err)
      showNotification('error', 'Eroare la încărcarea imaginii. Încearcă din nou.')
    } finally {
      setUploadingEventImage(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest eveniment?')) return
    
    try {
      // Check if it's a MongoDB ID (exists in DB) or local ID
      const isMongoId = /^[a-f\d]{24}$/i.test(id)
      
      if (isMongoId) {
        // Delete from DB
        const response = await fetch(`/api/events?id=${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setEvents(prev => {
            const updated = prev.filter(e => e.id !== id)
            localStorage.setItem('eventsCache', JSON.stringify(updated))
            return updated
          })
          showNotification('success', 'Eveniment șters cu succes!')
        } else {
          showNotification('error', 'Eroare la ștergerea evenimentului!')
        }
      } else {
        // Just remove from local state (wasn't in DB yet)
        setEvents(prev => {
          const updated = prev.filter(e => e.id !== id)
          localStorage.setItem('eventsCache', JSON.stringify(updated))
          return updated
        })
        showNotification('success', 'Eveniment șters!')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      showNotification('error', 'Eroare la ștergerea evenimentului!')
    }
  }

  const handleAddNewEvent = async () => {
    // Validare
    setEventError('')
    
    if (!newTitle.trim()) {
      setEventError('Te rog să completezi titlul evenimentului!')
      return
    }
    
    if (!newDescription.trim()) {
      setEventError('Te rog să completezi descrierea!')
      return
    }
    
    if (!newDate) {
      setEventError('Te rog să selectezi data evenimentului!')
      return
    }

    const price = parseFloat(newPrice)
    const spots = parseInt(newSpots)

    if (!newPrice || isNaN(price) || price <= 0) {
      setEventError('Te rog să introduci un preț valid!')
      return
    }

    if (!newSpots || isNaN(spots) || spots <= 0) {
      setEventError('Te rog să introduci numărul de locuri disponibile!')
      return
    }

    setIsSaving(true)
    
    try {
      let imageUrl: string | undefined

      // Dacă există imagine selectată, o încărcăm mai întâi în S3
      if (newImageFile) {
        const form = new FormData()
        form.append('file', newImageFile)
        form.append('category', 'events')
        form.append('alt', newTitle.trim() || 'Imagine eveniment')
        form.append('title', newTitle.trim() || 'Eveniment')

        const uploadRes = await fetch('/api/gallery/upload', { method: 'POST', body: form })
        if (!uploadRes.ok) {
          setEventError('Eroare la încărcarea imaginii. Te rog încearcă din nou.')
          setIsSaving(false)
          return
        }
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.externalUrl || uploadData.url
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          date: newDate,
          category: newCategory,
          price: price,
          availableSpots: spots,
          imageUrl,
        }),
      })

      if (response.ok) {
        const savedEvent = await response.json()
        setEvents(prev => {
          const updated = [...prev, savedEvent]
          localStorage.setItem('eventsCache', JSON.stringify(updated))
          return updated
        })
        
        // Reset form
        setNewTitle('')
        setNewDescription('')
        setNewDate('')
        setNewCategory('party')
        setNewPrice('')
        setNewSpots('')
        setNewImageFile(null)
        setEventError('')
        setIsAddingNew(false)
        
        showNotification('success', 'Eveniment nou adăugat cu succes!')
      } else {
        // Get error details
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', response.status, errorData)
        const errorMessage = `Eroare ${response.status}: ${errorData.error || 'Conexiune DB eșuată'}`
        setEventError(errorMessage)
        showNotification('error', errorMessage)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      setEventError('Eroare la salvarea evenimentului. Te rog încearcă din nou.')
      showNotification('error', 'Eroare la salvarea evenimentului!')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {saveNotification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2 ${
          saveNotification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {saveNotification.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )}
          <span className="font-medium">{saveNotification.message}</span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionare Evenimente Tematice</h3>
        <p className="text-sm text-gray-600">Editează evenimentele care apar pe pagina principală.</p>
      </div>

      {/* Lista cu evenimente existente */}
      <div className="space-y-4">
        {events.map((event, index) => {
          const isEditing = editingId === event.id
          const displayEvent = isEditing && editingEvent ? editingEvent : event
          
          return (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-gray-500">Eveniment {index + 1}</span>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEvent}
                        disabled={isSaving}
                        className="text-green-600 hover:text-green-700 text-xs flex items-center gap-1 disabled:opacity-50"
                      >
                        <Save className="w-3 h-3" />
                        {isSaving ? 'Salvare...' : 'Salvează'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="text-gray-600 hover:text-gray-700 text-xs flex items-center gap-1 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                        Anulează
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Editează
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={isEditing}
                    className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    Șterge
                  </button>
                </div>
              </div>
              
              {/* Grid pentru câmpuri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Titlu */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Titlu:</label>
                  <input
                    type="text"
                    value={displayEvent.title}
                    onChange={(e) => handleUpdateField('title', e.target.value)}
                    placeholder="Titlul evenimentului"
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Dată */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Dată:</label>
                  <input
                    type="date"
                    value={formatDateForInput(displayEvent.date)}
                    onChange={(e) => handleUpdateField('date', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Categorie */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categorie:</label>
                  <select
                    value={displayEvent.category}
                    onChange={(e) => handleUpdateField('category', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Preț */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Preț (RON):</label>
                  <input
                    type="number"
                    value={displayEvent.price}
                    onChange={(e) => handleUpdateField('price', parseFloat(e.target.value) || 0)}
                    placeholder="150"
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Locuri disponibile */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Locuri disponibile:</label>
                  <input
                    type="number"
                    value={displayEvent.availableSpots}
                    onChange={(e) => handleUpdateField('availableSpots', parseInt(e.target.value) || 0)}
                    placeholder="50"
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Descriere (întreaga lățime) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descriere:</label>
                <textarea
                  value={displayEvent.description}
                  onChange={(e) => handleUpdateField('description', e.target.value)}
                  placeholder="Descrierea evenimentului..."
                  rows={2}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              
              {/* Imagine eveniment (upload cu preview) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Imagine eveniment:
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-400">
                    {displayEvent.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={displayEvent.imageUrl}
                        alt={displayEvent.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      'Fără imagine'
                    )}
                  </div>
                  <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium shadow-sm ${
                    !isEditing || uploadingEventImage
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    {uploadingEventImage ? 'Se încarcă...' : (displayEvent.imageUrl ? 'Schimbă imaginea' : 'Adaugă imagine')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={!isEditing || uploadingEventImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleUpdateEventImage(displayEvent, file)
                          // resetăm valoarea inputului pentru a permite același fișier din nou
                          e.target.value = ''
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  Imaginea este utilizată în cardul de eveniment de pe pagina principală.
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Form pentru adăugare eveniment nou */}
      {isAddingNew ? (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-gray-900 mb-3">Adaugă eveniment nou</h4>
          
          {/* Mesaj eroare */}
          {eventError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{eventError}</span>
            </div>
          )}
          
          <div className="space-y-3">
            {/* Grid pentru câmpuri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Titlu */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Titlu:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value)
                    setEventError('')
                  }}
                  placeholder="ex: Petrecere de Crăciun"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Dată */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Dată:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value)
                    setEventError('')
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Categorie */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Categorie:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Preț */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Preț (RON):</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => {
                    setNewPrice(e.target.value)
                    setEventError('')
                  }}
                  placeholder="150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Locuri disponibile */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Locuri disponibile:</label>
                <input
                  type="number"
                  value={newSpots}
                  onChange={(e) => {
                    setNewSpots(e.target.value)
                    setEventError('')
                  }}
                  placeholder="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              {/* Imagine eveniment (URL) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Imagine eveniment:
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-400">
                    {newImageFile ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(newImageFile)}
                        alt={newTitle || 'Imagine eveniment'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      'Fără imagine'
                    )}
                  </div>
                  <label className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium shadow-sm ${
                    isSaving ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    {newImageFile ? 'Schimbă imaginea' : 'Adaugă imagine'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isSaving}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setNewImageFile(file)
                          setEventError('')
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Descriere */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Descriere:</label>
              <textarea
                value={newDescription}
                onChange={(e) => {
                  setNewDescription(e.target.value)
                  setEventError('')
                }}
                placeholder="Descrierea evenimentului..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          
          {/* Butoane */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddNewEvent}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Se salvează...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Salvează
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false)
                setNewTitle('')
                setNewDescription('')
                setNewDate('')
                setNewCategory('party')
                setNewPrice('')
                setNewSpots('')
                setEventError('')
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Anulează
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Adaugă Eveniment
        </button>
      )}
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

