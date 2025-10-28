'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  siteName?: string
}

export default function Header({ siteName }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#about', label: 'Despre' },
    { href: '#services', label: 'Servicii' },
    { href: '#gallery', label: 'Galerie' },
    { href: '#events', label: 'Evenimente' },
    { href: '#testimonials', label: 'Testimoniale' },
    { href: '#contact', label: 'Contact' },
  ]

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
            className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {siteName || 'Event Venue'}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                isScrolled
                  ? 'bg-white text-gray-900'
                  : 'border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-gray-900'
              }`}
            >
              Rezervă acum
            </a>
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
              {/* Close button */}
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
                style={{ 
                  backgroundColor: '#ffffff',
                  backgroundImage: 'none'
                }}
              >
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 font-semibold hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 py-3 px-4 rounded-lg"
                  >
                    {link.label}
                  </a>
                ))}
                
                {/* CTA Button */}
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-full font-bold transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                >
                  Rezervă acum
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

