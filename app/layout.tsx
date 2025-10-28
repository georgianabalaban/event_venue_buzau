import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="ro" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
