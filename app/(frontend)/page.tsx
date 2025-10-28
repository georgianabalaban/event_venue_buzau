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

async function getPageData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=home`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching page data:', error)
    return null
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/globals/settings`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

async function getEvents() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/events?limit=6&sort=-date`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function Home() {
  const [pageData, settings, events] = await Promise.all([
    getPageData(),
    getSettings(),
    getEvents(),
  ])

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
