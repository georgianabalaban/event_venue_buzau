'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import Image from 'next/image'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    name: string
    heroImage?: {
      url?: string
      externalUrl?: string
      alt?: string
    }
    gallery?: Array<{
      image: {
        url?: string
        externalUrl?: string
        alt?: string
      }
      title?: string
      description: string
    }>
    ctaText?: string
    ctaLink?: string
  } | null
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!service) return null

  const heroImageUrl = service.heroImage?.externalUrl || service.heroImage?.url

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>

                {/* Content */}
                <div className="max-h-[85vh] overflow-y-auto">
                  {/* Hero Section */}
                  {heroImageUrl && (
                    <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-primary-600 to-secondary-600">
                      <Image
                        src={heroImageUrl}
                        alt={service.heroImage?.alt || service.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                          {service.name}
                        </h2>
                      </div>
                    </div>
                  )}

                  {/* Gallery Grid */}
                  {service.gallery && service.gallery.length > 0 && (
                    <div className="p-6 md:p-8 lg:p-12">
                      <div className="space-y-12">
                        {service.gallery.map((item, index) => {
                          const imageUrl = item.image.externalUrl || item.image.url
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              viewport={{ once: true }}
                              className={`flex flex-col ${
                                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                              } gap-6 md:gap-8 items-center`}
                            >
                              {/* Image */}
                              {imageUrl && (
                                <div className="w-full md:w-1/2">
                                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg group">
                                    <Image
                                      src={imageUrl}
                                      alt={item.title || service.name}
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Text */}
                              <div className="w-full md:w-1/2 space-y-3">
                                {item.title && (
                                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                                    {item.title}
                                  </h3>
                                )}
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {(!service.gallery || service.gallery.length === 0) && (
                    <div className="p-12 text-center text-gray-500">
                      <p>Nu există imagini adăugate pentru acest serviciu.</p>
                      <p className="text-sm mt-2">Adaugă imagini din Admin Panel.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

