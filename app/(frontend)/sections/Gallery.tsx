'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const categories = [
  { id: 'all', label: 'Toate' },
  { id: 'indoor', label: 'Interior' },
  { id: 'outdoor', label: 'Exterior' },
  { id: 'pool', label: 'Piscină' },
  { id: 'events', label: 'Evenimente' },
]

type GalleryImage = {
  id?: string
  externalUrl?: string
  url?: string
  alt?: string
  title?: string
  category?: string
  [key: string]: unknown
}

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [grouped, setGrouped] = useState<Record<string, GalleryImage[]>>({
    indoor: [],
    outdoor: [],
    pool: [],
    events: [],
  })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/gallery?category=all', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load gallery')
        const data = await res.json()
        setGrouped({
          indoor: data.indoor || [],
          outdoor: data.outdoor || [],
          pool: data.pool || [],
          events: data.events || [],
        })
      } catch {
        // silent fail, UI shows skeletons on error then empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const allImages = useMemo(() => ([
    ...grouped.indoor,
    ...grouped.outdoor,
    ...grouped.pool,
    ...grouped.events,
  ]), [grouped])

  // Visible images for current category - used for lightbox navigation and counter
  const visibleImages = useMemo(() => (
    selectedCategory === 'all'
      ? allImages
      : allImages.filter((img) => img.category === selectedCategory)
  ), [allImages, selectedCategory])

  const visibleIndexById = useMemo(() => {
    const map = new Map<string, number>()
    visibleImages.forEach((img, idx) => {
      if (img?.id) map.set(img.id, idx)
    })
    return map
  }, [visibleImages])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(visibleImages.length, 1))
  }, [visibleImages.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(visibleImages.length, 1)) % Math.max(visibleImages.length, 1))
  }, [visibleImages.length])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, nextImage, prevImage, closeLightbox])

  const activeImage = visibleImages[currentImageIndex] ?? null
  const activeImageUrl = activeImage?.externalUrl ?? activeImage?.url ?? ''
  const activeImageAlt = activeImage?.alt ?? activeImage?.title ?? 'Imagine'

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Galerie foto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descoperă spațiile noastre unice
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white shadow-xl'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-xl hover:bg-gray-900 hover:text-white hover:-translate-y-1'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid - Masonry style */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <div className={`rounded-2xl bg-gray-200 animate-pulse ${
                i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-80' : 'h-72'
              }`} />
            </div>
          ))}
          {!loading && allImages.map((image: GalleryImage, index: number) => {
            const isVisible = selectedCategory === 'all' || image.category === selectedCategory
            const keyId = image.id ?? `${index}-${image.externalUrl ?? image.url ?? 'image'}`
            const isFailed = failedIds.has(keyId)
            const visibleIndex = image.id ? (visibleIndexById.get(image.id) ?? -1) : -1
            if (!isVisible || isFailed) return null
            return (
              <motion.div
                key={keyId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl"
                onClick={() => {
                  if (isVisible && visibleIndex >= 0) {
                    openLightbox(visibleIndex)
                  }
                }}
              >
                <div className={`relative ${
                  index % 4 === 0 ? 'h-64' :
                  index % 4 === 1 ? 'h-80' :
                  index % 4 === 2 ? 'h-72' : 'h-60'
                }`}>
                  {image.externalUrl || image.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.externalUrl || image.url}
                      alt={image.alt || image.title || 'Imagine'}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={() => {
                        setFailedIds(prev => {
                          const next = new Set(prev)
                          next.add(keyId)
                          return next
                        })
                      }}
                      onLoad={(event) => {
                        const { naturalWidth, naturalHeight } = event.currentTarget
                        if (!naturalWidth || !naturalHeight || naturalWidth < 50 || naturalHeight < 50) {
                          setFailedIds(prev => {
                            const next = new Set(prev)
                            next.add(keyId)
                            return next
                          })
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-7xl max-h-[90vh] w-full"
                onClick={(event) => {
                  const target = event.target as HTMLElement
                  const isButton = target.closest('button')
                  const isImage = target.tagName === 'IMG'
                  if (isButton || isImage) {
                    event.stopPropagation()
                  }
                }}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-3 right-3 z-10 p-2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full"
                  aria-label="Închide imaginea"
                >
                  <X className="w-6 h-6" />
                </button>

                {visibleImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="relative w-full h-full flex items-center justify-center">
                  {activeImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeImageUrl}
                      alt={activeImageAlt}
                      className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
                      style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                    />
                  ) : (
                    <div className="w-96 h-96 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-lg" />
                  )}
                </div>

                {visibleImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                    <p className="text-sm font-medium">
                      {currentImageIndex + 1} din {visibleImages.length}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}