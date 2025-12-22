import type { Metadata } from 'next'
import { Inter, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Event Venue Buzău - Spațiu pentru evenimente',
  description: 'Organizăm evenimente memorabile lângă Buzău - spațiu exterior cu piscină și interior elegant. Perfect pentru nunți, petreceri corporate, aniversări și alte evenimente speciale.',
  keywords: ['evenimente buzau', 'spatiu evenimente', 'sala evenimente buzau', 'nunti buzau', 'corporate events'],
  authors: [{ name: 'Event Venue Buzău' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: 'Event Venue Buzău - Spațiu pentru evenimente',
    description: 'Organizăm evenimente memorabile lângă Buzău',
    type: 'website',
    locale: 'ro_RO',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
