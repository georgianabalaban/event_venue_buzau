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

// Static data for demo purposes
const getPageData = () => {
  return {
    hero: {
      heading: "Event Venue Buzău",
      subheading: "Spațiu perfect pentru evenimente memorabile",
      ctaText: "Rezervă acum"
    },
    about: {
      title: "Despre noi",
      description: "Oferim un spațiu elegant și modern pentru evenimente de toate tipurile, cu facilități de top și servicii personalizate.",
      features: [
        { feature: 'Spațiu exterior cu piscină' },
        { feature: 'Sală interioară elegantă' },
        { feature: 'Capacitate până la 200 persoane' },
        { feature: 'Parcare privată' },
        { feature: 'Catering personalizat' }
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
    contact: {
      phone: "+40 234 567 890",
      email: "contact@eventvenue.ro",
      address: "Strada Exemplu, Nr. 123, Buzău"
    }
  }
}

const getSettings = () => {
  return {
    siteName: "Event Venue Buzău",
    tagline: "Spațiu perfect pentru evenimente memorabile",
    socialMedia: {
      facebook: "https://facebook.com/eventvenuebuzau",
      instagram: "https://instagram.com/eventvenuebuzau",
      tiktok: "https://tiktok.com/@eventvenuebuzau",
      whatsapp: "40723456789"
    },
    contact: {
      email: "contact@eventvenue.ro",
      phone: "+40 234 567 890",
      address: "Strada Exemplu, Nr. 123, Buzău"
    }
  }
}

const getEvents = () => {
  return [
    {
      id: "1",
      title: "Workshop de Fotografie",
      description: "Învață tehnici profesionale de fotografie cu experți în domeniu.",
      date: "2024-12-15",
      category: "Workshop",
      price: 150,
      availableSpots: 20,
      image: {
        url: "/api/placeholder/400/300",
        alt: "Workshop de Fotografie"
      }
    },
    {
      id: "2", 
      title: "Petrecere de Anul Nou",
      description: "Celebrează anul nou într-un mod memorabil cu prietenii și familia.",
      date: "2024-12-31",
      category: "Petrecere",
      price: 200,
      availableSpots: 100,
      image: {
        url: "/api/placeholder/400/300",
        alt: "Petrecere de Anul Nou"
      }
    }
  ]
}

export default function Home() {
  const pageData = getPageData()
  const settings = getSettings()
  const events = getEvents()

  return (
    <main className="min-h-screen">
      <Header siteName={settings?.siteName} />
      <Hero data={pageData?.hero} />
      <About data={pageData?.about} />
      <Services data={pageData?.services} />
      <Gallery />
      <Events events={events} />
      <Story />
      <Testimonials />
      <FAQ />
      <Contact data={pageData?.contact} />
      <Footer settings={settings} />
    </main>
  )
}
