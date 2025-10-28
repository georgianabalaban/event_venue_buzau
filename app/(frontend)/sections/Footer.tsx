'use client'

import Link from 'next/link'
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
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {settings?.siteName || 'Event Venue Buzău'}
            </h3>
            <p className="text-gray-400 mb-6">
              {settings?.tagline || 'Spațiul tău pentru evenimente perfecte'}
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 flex-wrap">
              {/* Facebook */}
              <a
                href={settings?.socialMedia?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              
              {/* Instagram */}
              <a
                href={settings?.socialMedia?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>

              {/* WhatsApp */}
              <a
                href={settings?.socialMedia?.whatsapp || 'https://wa.me/40123456789'}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#25D366] transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>

              {/* TikTok */}
              {settings?.socialMedia?.tiktok && (
                <a
                  href={settings.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigare</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Despre noi
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Servicii
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Galerie
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Evenimente
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  Testimoniale
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Servicii</h4>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Evenimente Corporate
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Nunți
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Petreceri Private
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Aniversări
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Evenimente Tematice
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              {settings?.contact?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <a
                    href={`tel:${settings.contact.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contact.phone}
                  </a>
                </li>
              )}
              
              {settings?.contact?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contact.email}
                  </a>
                </li>
              )}
              
              {settings?.contact?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{settings.contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} {settings?.siteName || 'Event Venue Buzău'}. Toate drepturile rezervate.
            </p>
            
            <div className="flex gap-6 text-sm">
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
              <button className="hover:text-white transition-colors">
                Politica de confidențialitate
              </button>
              <button className="hover:text-white transition-colors">
                Termeni și condiții
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

