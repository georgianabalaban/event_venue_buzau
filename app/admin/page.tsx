'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, Settings, FileText, Image, Calendar, Users } from 'lucide-react'

// Tipuri pentru datele site-ului
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
    ]
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
  gallery: []
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('hero')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [siteData, setSiteData] = useState<SiteData>(defaultData)
  const [featuresText, setFeaturesText] = useState<string>(defaultData.about.features.join('\n'))

  const updateServicesTitle = (title: string) => {
    setSiteData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        title,
      },
    }))
    setIsEditing(true)
  }

  const updateServiceItem = (index: number, field: 'name' | 'description' | 'icon', value: string) => {
    setSiteData(prev => {
      const items = Array.isArray(prev.services.items) ? [...prev.services.items] : []
      items[index] = { ...items[index], [field]: value }
      return {
        ...prev,
        services: {
          ...prev.services,
          items,
        },
      }
    })
    setIsEditing(true)
  }

  // Încarcă datele din baza de date (Payload) la inițializare
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/pages', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setSiteData({
            hero: {
              heading: data?.hero?.heading ?? defaultData.hero.heading,
              secondaryHeading: data?.hero?.secondaryHeading ?? defaultData.hero.secondaryHeading,
              subheading: data?.hero?.subheading ?? defaultData.hero.subheading,
              ctaText: data?.hero?.ctaText ?? defaultData.hero.ctaText,
            },
            about: {
              title: data?.about?.title ?? defaultData.about.title,
              description: typeof data?.about?.description === 'string' ? data.about.description : defaultData.about.description,
              features: Array.isArray(data?.about?.features)
                ? data.about.features.map((f: any) => (typeof f === 'string' ? f : f?.feature)).filter(Boolean)
                : defaultData.about.features,
            },
            services: {
              title: data?.services?.title ?? defaultData.services.title,
              items: Array.isArray(data?.services?.items) && data.services.items.length > 0
                ? data.services.items
                : defaultData.services.items,
            },
            events: defaultData.events,
            gallery: defaultData.gallery,
          })
          const incomingFeatures: string[] = Array.isArray(data?.about?.features)
            ? data.about.features.map((f: any) => (typeof f === 'string' ? f : f?.feature)).filter((v: any) => typeof v === 'string')
            : defaultData.about.features
          setFeaturesText(incomingFeatures.join('\n'))
        }
      } catch (e) {
        console.error('Failed to load page data:', e)
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
          },
          services: siteData.services,
        }),
      })
      if (!res.ok) throw new Error('Save failed')

      // Anunță frontend-ul să reîncarce din API
      window.dispatchEvent(new CustomEvent('adminDataSaved'))
      if (window.opener) window.opener.postMessage({ type: 'adminDataSaved' }, '*')

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setIsEditing(false)
    } catch (e) {
      console.error('Failed to save page data:', e)
    }
  }

  const updateSiteData = (section: keyof SiteData, data: Partial<SiteData[keyof SiteData]>) => {
    setSiteData(prev => ({
      ...prev,
      [section]: data
    }))
    setIsEditing(true)
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: FileText },
    { id: 'about', label: 'Despre', icon: Users },
    { id: 'services', label: 'Servicii', icon: Settings },
    { id: 'events', label: 'Evenimente', icon: Calendar },
    { id: 'gallery', label: 'Galerie', icon: Image },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
                onClick={() => {
                  console.log('Current siteData:', siteData)
                  console.log('localStorage:', localStorage.getItem('siteData'))
                  console.log('sessionStorage:', sessionStorage.getItem('siteData'))
                }}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Debug
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
                {activeTab === 'hero' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titlu principal
                      </label>
                      <input
                        type="text"
                        value={siteData.hero.heading}
                        onChange={(e) => updateSiteData('hero', { ...siteData.hero, heading: e.target.value })}
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
                        onChange={(e) => updateSiteData('hero', { ...siteData.hero, secondaryHeading: e.target.value })}
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
                        onChange={(e) => updateSiteData('hero', { ...siteData.hero, subheading: e.target.value })}
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
                        onChange={(e) => updateSiteData('hero', { ...siteData.hero, ctaText: e.target.value })}
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
                        onChange={(e) => updateSiteData('about', { ...siteData.about, title: e.target.value })}
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
                        onChange={(e) => updateSiteData('about', { ...siteData.about, description: e.target.value })}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GalleryManager() {
  const [category, setCategory] = useState<'indoor' | 'outdoor' | 'pool' | 'events'>('indoor')
  const [items, setItems] = useState<Record<string, any[]>>({ indoor: [], outdoor: [], pool: [], events: [] })
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

  const categories = [
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
              onClick={() => setCategory(c.id as any)}
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
              body: JSON.stringify({ orderedIds: ordered.map((x: any) => x.id) }),
            })
          }}
        />
      )}
    </div>
  )
}

function ReorderableGrid({ items, onDelete, onReorder }: { items: any[]; onDelete: (id: string) => void | Promise<void>; onReorder: (items: any[]) => void | Promise<void> }) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [list, setList] = useState(items)

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
      {list.map((img: any, idx: number) => (
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
