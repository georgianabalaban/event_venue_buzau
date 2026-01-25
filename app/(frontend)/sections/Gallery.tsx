'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type GallerySlide = {
  title: string
  isTitle?: boolean
  imageUrl: string
  alt: string
}

const gallerySlides: GallerySlide[] = [
  { 
    title: 'Ce veți găsi la noi?', 
    isTitle: true,
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/events/whatsapp-image-2025-11-19-at-11-50-43-4--1763546411714.jpeg',
    alt: 'Ce veți găsi la noi?'
  },
  { 
    title: 'O grădină plină de verdeață',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/events/whatsapp-image-2025-11-19-at-11-50-43-2--1763546510042.jpeg',
    alt: 'O grădină plină de verdeață'
  },
  { 
    title: 'Multe locuri de stat la povești',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/img_4567-1761770813244.JPG',
    alt: 'Multe locuri de stat la povești'
  },
  { 
    title: 'O piscină ce îi așteaptă pe curajoși',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/pool/whatsapp-image-2025-11-19-at-12-05-34-1--1763546982351.jpeg',
    alt: 'O piscină ce îi așteaptă pe curajoși'
  },
  { 
    title: 'Un foișor ce poate găzdui până la 70 de persoane',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/indoor/whatsapp-image-2025-11-19-at-12-14-13-1--1763547340444.jpeg',
    alt: 'Un foișor ce poate găzdui până la 70 de persoane'
  },
  { 
    title: 'Aranjamente cu flori proaspete de sezon',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/indoor/whatsapp-image-2025-11-19-at-12-14-13-2--1763547339885.jpeg',
    alt: 'Aranjamente cu flori proaspete de sezon'
  },
  { 
    title: 'Un foișor separat acoperit',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/22730850-f44e-42dd-aee9-2dda7b3cec5f-1761770789925.jpg',
    alt: 'Un foișor separat acoperit'
  },
  { 
    title: 'O zonă de bufet pentru preparate delicioase',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/indoor/whatsapp-image-2025-11-19-at-12-14-13-6--1763547336861.jpeg',
    alt: 'O zonă de bufet pentru preparate delicioase'
  },
  { 
    title: 'Multă bucurie și energie bună',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/img_4598-1761770820795.JPG',
    alt: 'Multă bucurie și energie bună'
  },
  { 
    title: 'Un strop de magie',
    imageUrl: 'https://event-venue-buzau.s3.eu-central-1.amazonaws.com/gallery/outdoor/WhatsApp+Image+2025-11-11+at+12.26.39.jpeg',
    alt: 'Un strop de magie'
  },
]

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isInViewport, setIsInViewport] = useState(true)
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer to detect when gallery is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting)
      },
      {
        threshold: 0.3, // Trigger when 30% of the gallery is visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % gallerySlides.length
    const img = new Image()
    img.src = gallerySlides[nextIndex].imageUrl
  }, [currentIndex])

  // Auto-slide with play/pause (only when in viewport)
  useEffect(() => {
    if (isPlaying && isInViewport) {
      intervalRef.current = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % gallerySlides.length)
      }, 4000) // 4 seconds autoplay

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, isInViewport])

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % gallerySlides.length)
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + gallerySlides.length) % gallerySlides.length)
  }, [])

  const handleDotClick = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  const currentSlide = gallerySlides[currentIndex]

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <section 
      ref={sectionRef}
      id="gallery" 
      className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-screen bg-gray-900 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image Container with AnimatePresence for smooth transitions */}
      <div className="relative w-full h-screen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.8, ease: 'easeInOut' },
            }}
            className="absolute inset-0"
          >
            {currentSlide.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-700 to-green-500" />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

        {/* Text overlay with animation */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4 max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`font-bold text-white ${
                  currentSlide.isTitle 
                    ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl' 
                    : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
                }`}
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.5)',
                  letterSpacing: '-0.02em',
                } as React.CSSProperties}
              >
                {currentSlide.title}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Controls - Only Dots */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 md:pb-12">
          <div className="container mx-auto px-4">
            {/* Dots Navigation */}
            <div className="flex items-center justify-center gap-2 md:gap-3">
              {gallerySlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`group transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 md:w-10'
                      : 'w-2 md:w-3 hover:w-4 md:hover:w-5'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                >
                  <div
                    className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-white shadow-lg'
                        : 'bg-white/40 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility: Reduced motion preference */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  )
}
