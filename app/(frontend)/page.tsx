'use client'

import { useState, useEffect } from 'react'
import Header from './sections/Header'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Gallery from './sections/Gallery'
import Events from './sections/Events'
import Story from './sections/Story'
import Testimonials from './sections/Testimonials'
import FAQ from './sections/FAQ'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

// Default data structure
const defaultPageData = {
  hero: {
    heading: 'Bun venit la Event Venue Buzău',
    secondaryHeading: 'prind viață',
    subheading: 'Spațiul perfect pentru evenimentele tale de neuitat',
    ctaText: 'Rezervă Acum',
    backgroundImage: { url: '/hero-bg.jpg', alt: 'Hero background' }
  },
  about: {
    title: 'Despre Noi',
    description: 'Event Venue Buzău este locul perfect pentru a-ți organiza evenimentul de vis. Cu o capacitate de până la 200 de persoane, oferim un spațiu elegant și modern, perfect pentru nunti, botezuri, aniversări și alte evenimente speciale.',
    features: [
      { feature: 'Capacitate până la 200 de persoane' },
      { feature: 'Spațiu elegant și modern' },
      { feature: 'Meniu personalizat' },
      { feature: 'Servicii complete de evenimente' }
    ]
  },
  services: {
    title: 'Serviciile Noastre',
    items: [
      {
        name: 'Organizare Evenimente',
        description: 'Planificare completă și organizare profesională',
        icon: 'Calendar'
      },
      {
        name: 'Meniu Personalizat',
        description: 'Bucătărie proprie cu meniu adaptat nevoilor tale',
        icon: 'Utensils'
      },
      {
        name: 'Decor și Flori',
        description: 'Decor personalizat și aranjamente florale',
        icon: 'Flower'
      },
      {
        name: 'Fotograf și Video',
        description: 'Servicii profesionale de fotograf și video',
        icon: 'Camera'
      }
    ]
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
  story: {
    title: 'Povestea noastră',
    content: 'Suntem o echipă dedicată care transformă fiecare eveniment într-o experiență memorabilă.',
    highlight: 'Punem suflet în fiecare detaliu pentru ca tu să te bucuri de momente unice.',
    missionTitle: 'Misiunea noastră',
    missionText: 'Să oferim un spațiu versatil și servicii impecabile pentru evenimente de neuitat.',
    points: [
      { title: 'Autenticitate', text: 'Valorile noastre se reflectă în fiecare eveniment găzduit.' },
      { title: 'Atenție la detalii', text: 'Ne asigurăm că totul este perfect, de la decor la logistică.' },
      { title: 'Pasiune', text: 'Iubim ceea ce facem și se vede în rezultatul final.' },
    ],
  },
  contact: {
    title: 'Contactează-ne',
    phone: '+40 123 456 789',
    email: 'contact@eventvenuebuzau.ro',
    address: 'Strada Exemplu, Nr. 123, Buzău, România'
  }
}

const defaultSettings = {
  siteName: 'Event Venue Buzău',
  tagline: 'Spațiul tău pentru evenimente perfecte',
  socialMedia: {
    facebook: 'https://facebook.com/eventvenuebuzau',
    instagram: 'https://instagram.com/eventvenuebuzau',
    whatsapp: '+40123456789',
    tiktok: 'https://tiktok.com/@eventvenuebuzau'
  },
  contact: {
    email: 'contact@eventvenuebuzau.ro',
    phone: '+40 123 456 789',
    address: 'Strada Exemplu, Nr. 123, Buzău, România'
  }
}

const defaultEvents = [
  {
    id: '1',
    title: 'Nunta Ana & Mihai',
    date: '2024-06-15',
    description: 'O nuntă de vis în spațiul nostru elegant',
    category: 'wedding',
    price: 0,
    availableSpots: 0
  },
  {
    id: '2',
    title: 'Botez Maria',
    date: '2024-07-20',
    description: 'Botezul frumoasei Maria',
    category: 'other',
    price: 0,
    availableSpots: 0
  }
]

// Function to fetch data from API
const fetchPageData = async () => {
  try {
    const response = await fetch('/api/pages', { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      console.log('📡 [PAGE] Fetched page data from API:', data)
      return data || defaultPageData
    }
  } catch (error) {
    console.error('❌ [PAGE] Error fetching page data:', error)
  }
  return defaultPageData
}

const fetchSettings = async () => {
  try {
    const response = await fetch('/api/settings', { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      console.log('📡 [PAGE] Fetched settings from API:', data)
      return data || defaultSettings
    }
  } catch (error) {
    console.error('❌ [PAGE] Error fetching settings:', error)
  }
  return defaultSettings
}

const fetchEvents = async () => {
  try {
    const response = await fetch('/api/events', { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      console.log('📡 [PAGE] Fetched events from API:', data)
      return data || defaultEvents
    }
  } catch (error) {
    console.error('❌ [PAGE] Error fetching events:', error)
  }
  return defaultEvents
}

export default function Home() {
  const [pageData, setPageData] = useState(defaultPageData)
  const [settings, setSettings] = useState(defaultSettings)
  const [events, setEvents] = useState(defaultEvents)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🚀 [PAGE] Component mounted, loading data from API...')
    
    const loadData = async () => {
      try {
        const [pageDataResult, settingsResult, eventsResult] = await Promise.all([
          fetchPageData(),
          fetchSettings(),
          fetchEvents()
        ])
        
        setPageData(pageDataResult)
        setSettings(settingsResult)
        setEvents(eventsResult)
        setLoading(false)
        console.log('✅ [PAGE] Data loaded successfully')
      } catch (error) {
        console.error('❌ [PAGE] Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()

    // Listen for custom admin data saved event
    const handleAdminDataSaved = async () => {
      console.log('🎉 [PAGE] Admin data saved event received, reloading data...')
      const [pageDataResult, settingsResult, eventsResult] = await Promise.all([
        fetchPageData(),
        fetchSettings(),
        fetchEvents()
      ])
      
      setPageData(pageDataResult)
      setSettings(settingsResult)
      setEvents(eventsResult)
    }

    // Listen for cross-tab messages
    const handleMessage = async (e: MessageEvent) => {
      console.log('📨 [PAGE] Message received:', e.data)
      if (e.data?.type === 'adminDataSaved') {
        console.log('🎉 [PAGE] Admin data saved message received, reloading data...')
        const [pageDataResult, settingsResult, eventsResult] = await Promise.all([
          fetchPageData(),
          fetchSettings(),
          fetchEvents()
        ])
        
        setPageData(pageDataResult)
        setSettings(settingsResult)
        setEvents(eventsResult)
      }
    }

    // Add event listeners
    window.addEventListener('adminDataSaved', handleAdminDataSaved)
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('adminDataSaved', handleAdminDataSaved)
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    )
  }

  console.log('🎨 [PAGE] Rendering with data:', { pageData, settings, events })

  return (
    <main className="min-h-screen">
      <Header siteName={pageData?.header?.siteName || settings?.siteName} nav={pageData?.header?.nav} />
      <Hero data={pageData?.hero} />
      <About data={pageData?.about} />
      <Services data={pageData?.services} />
      <Gallery />
      <Events events={events} />
      <Story data={pageData?.story} />
      <Testimonials />
      <FAQ />
      <Contact data={pageData?.contact} />
      <Footer settings={settings} />
    </main>
  )
}