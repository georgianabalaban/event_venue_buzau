'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface HeaderProps {
  siteName?: string;
  nav?: Array<{ label: string; href: string; cta?: boolean }>
}

export default function Header({ siteName, nav }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const defaultNav = [
    { label: 'Despre', href: '#about' },
    { label: 'Servicii', href: '#services' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'Evenimente', href: '#events' },
    { label: 'Testimoniale', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
    { label: 'Rezervă acum', href: '#contact', cta: true }
  ]
  const navLinks = Array.isArray(nav) && nav.length ? nav : defaultNav
  const regularLinks = navLinks.filter(l=>!l.cta)
  const ctaLinks = navLinks.filter(l=>!!l.cta)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className="relative h-60 w-auto transition-all duration-300 hover:scale-105"
          >
            <Image
              src="https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/logo/singla_kids_club.png"
              alt={siteName || 'Kids Club'}
              width={840}
              height={240}
              className="h-full w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {regularLinks.map((link) => (
              <a
                key={link.href+link.label}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            {ctaLinks.map(link => (
              <a
                key={link.href+link.label}
                href={link.href}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                  isScrolled
                    ? 'bg-white text-gray-900'
                    : 'border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-gray-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button - Modern burger icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${
              isScrolled 
                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                : 'bg-white text-gray-900 shadow-md hover:shadow-lg'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Mobile Menu - ALWAYS WHITE BACKGROUND */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] force-bg-white shadow-2xl z-50 md:hidden"
              style={{ 
                backgroundColor: '#ffffff',
                backgroundImage: 'none'
              }}
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Navigation links */}
              <nav 
                className="px-6 py-4 flex flex-col gap-2 force-bg-white"
                style={{ backgroundColor: '#ffffff', backgroundImage: 'none' }}
              >
                {regularLinks.map((link) => (
                  <a
                    key={link.href+link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 py-3 px-4 rounded-lg"
                  >
                    {link.label}
                  </a>
                ))}
                {ctaLinks.map(link => (
                  <a
                    key={link.href+link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-full font-bold transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

