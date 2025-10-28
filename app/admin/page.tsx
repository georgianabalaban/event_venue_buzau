'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, Settings, FileText, Image, Calendar, Users } from 'lucide-react'

// Tipuri pentru datele site-ului
interface SiteData {
  hero: {
    heading: string
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

  // Încarcă datele salvate la inițializare
  useEffect(() => {
    const savedData = localStorage.getItem('siteData')
    if (savedData) {
      setSiteData(JSON.parse(savedData))
    }
  }, [])

  const handleSave = () => {
    console.log('Saving site data:', siteData)
    
    // Salvează în localStorage pentru persistență
    localStorage.setItem('siteData', JSON.stringify(siteData))
    
    // Salvează și în sessionStorage pentru a actualiza site-ul imediat
    sessionStorage.setItem('siteData', JSON.stringify(siteData))
    
    console.log('Data saved to localStorage and sessionStorage')
    
    // Forțează actualizarea site-ului prin evenimente multiple
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'siteData',
      newValue: JSON.stringify(siteData),
      storageArea: sessionStorage
    }))
    
    // Eveniment custom pentru sincronizare imediată
    window.dispatchEvent(new CustomEvent('adminDataSaved', {
      detail: { siteData }
    }))
    
    // Notifică toate tab-urile deschise
    if (window.opener) {
      window.opener.postMessage({ type: 'adminDataSaved', siteData }, '*')
    }
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setIsEditing(false)
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
                        value={siteData.about.features.join('\n')}
                        onChange={(e) => updateSiteData('about', { 
                          ...siteData.about, 
                          features: e.target.value.split('\n').filter(f => f.trim()) 
                        })}
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
                        defaultValue="Serviciile noastre"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={() => setIsEditing(true)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Evenimente Corporate', desc: 'Conferințe, training-uri, lansări de produse' },
                        { name: 'Nunți', desc: 'Ceremonii și petreceri de nuntă personalizate' },
                        { name: 'Petreceri Private', desc: 'Aniversări, zile de naștere, reuniuni de familie' },
                        { name: 'Evenimente Speciale', desc: 'Botezuri, confirmări, evenimente tematice' }
                      ].map((service, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <input
                            type="text"
                            defaultValue={service.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            onChange={() => setIsEditing(true)}
                          />
                          <textarea
                            rows={2}
                            defaultValue={service.desc}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={() => setIsEditing(true)}
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
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Galerie imagini</h3>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Adaugă imagine
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Imagine {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
