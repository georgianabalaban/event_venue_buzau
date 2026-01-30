'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

interface FooterProps {
  settings?: {
    siteName?: string
    tagline?: string
    socialMedia?: {
      facebook?: string
      instagram?: string
      tiktok?: string
      whatsapp?: string
    }
    contact?: {
      email?: string
      phone?: string
      address?: string
    }
  }
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4">
        {/* Minimalist Footer - Flying Fox Inspired */}
        <div className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            {/* Top Section: Left Links - Center Logo - Right Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start mb-8">
              {/* Left Links */}
              <nav className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
                <a 
                  href="#about" 
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Despre Noi
                </a>
                <a 
                  href="#services" 
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Servicii
                </a>
              </nav>

              {/* Center Logo */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-6">
                  <Image
                    src="https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/logo/SinglaKidsClub.png"
                    alt={settings?.siteName || 'Kids Club'}
                    width={180}
                    height={50}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                
                {/* Social Media - Centered Below Logo */}
                <div className="flex gap-4 justify-center">
                  <a
                    href={settings?.socialMedia?.facebook || 'https://www.facebook.com/p/Kids-Club-100093204601027/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  
                  <a
                    href={settings?.socialMedia?.instagram || 'https://www.instagram.com/kidsclubbuzau?igsh=MTJpNGpxbTJuZmphOA=='}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>

                  <a
                    href={settings?.socialMedia?.whatsapp || 'https://wa.me/40766441140'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Right Links */}
              <nav className="flex flex-col items-center md:items-end space-y-3 text-center md:text-right">
                <a 
                  href="#testimonials" 
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Testimoniale
                </a>
                <a 
                  href="#contact" 
                  className="text-sm hover:text-white transition-colors duration-300"
                >
                  Contact
                </a>
              </nav>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 border-t border-gray-800">
              <p className="text-xs text-gray-500 text-center">
                © {currentYear} {settings?.siteName || 'Kids Club'}. Toate drepturile rezervate.
              </p>
            </div>

            {/* Minimal Footer (Flying Fox Style) */}
            <div className="pt-6 border-t border-gray-800 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-gray-500">
                {/* CUI Link */}
                <div>
                  <a 
                    href="https://listafirme.ro/deco-inspiration-srl-41121751/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors duration-300"
                  >
                    RO41121751
                  </a>
                </div>

                {/* Termene si Conditii */}
                <div>
                  <span className="text-gray-500 cursor-not-allowed">
                    Termene si Conditii
                  </span>
                </div>

                {/* Politica de Confidentialitate */}
                <div>
                  <span className="text-gray-500 cursor-not-allowed">
                    Politica de Confidentialitate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

