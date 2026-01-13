'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check } from 'lucide-react'

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

type AboutFeature = { feature?: string | null }

interface AboutImage {
  url?: string
  externalUrl?: string
  alt?: string
}

interface AboutData {
  title?: string
  description?: string | unknown
  features?: Array<AboutFeature | null> | null
  image?: AboutImage | null
}

interface AboutProps {
  data?: AboutData | null
}

export default function About({ data }: AboutProps) {
  const fallbackFeatures: Array<{ feature: string }> = [
    { feature: 'Spațiu exterior cu piscină' },
    { feature: 'Sală interioară elegantă' },
    { feature: 'Capacitate până la 200 persoane' },
    { feature: 'Parcare privată' },
    { feature: 'Catering personalizat' },
    { feature: 'Echipament audio-video modern' },
  ]

  const payloadFeatures = Array.isArray(data?.features)
    ? data.features
        .map((feature) => {
          const label = isNonEmptyString(feature?.feature) ? feature?.feature.trim() : ''
          return label ? { feature: label } : null
        })
        .filter((featureItem): featureItem is { feature: string } => featureItem !== null)
    : []

  const features = payloadFeatures.length > 0 ? payloadFeatures : fallbackFeatures

  const imageData = data?.image ?? null
  const imageUrl = imageData?.externalUrl ?? imageData?.url ?? ''
  const hasImage = isNonEmptyString(imageUrl)

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-900">
              {data?.title || 'Despre spațiul nostru'}
            </h2>
            
            <div className="prose text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 whitespace-pre-line">
              {typeof data?.description === 'string' && data.description.trim().length > 0 ? (
                <p>{data.description}</p>
              ) : (
                <>
                  <p>
                    Situat într-o locație pitorească lângă Buzău, spațiul nostru oferă
                    ambianta perfectă pentru orice tip de eveniment. Cu un design modern
                    și facilități de top, garantăm că evenimentul tău va fi unul de neuitat.
                  </p>
                  <p>
                    Fie că organizezi un eveniment corporate, o nuntă de vis, o petrecere
                    privată sau orice altă celebrare, avem experiența și spațiul potrivit
                    pentru tine.
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">{item.feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {hasImage && imageData ? (
              <ResponsiveAboutImage image={imageData} />
            ) : (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                  Imagine spațiu
                </div>
              </div>
            )}

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-400 rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-400 rounded-full blur-2xl opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ResponsiveAboutImage({ image }: { image: AboutImage }) {
  const [isValid, setIsValid] = useState(true)
  const src = image.externalUrl ?? image.url ?? ''

  if (!isNonEmptyString(src) || !isValid) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
          Imagine spațiu
        </div>
      </div>
    )
  }

  const altText = isNonEmptyString(image.alt) ? image.alt : 'Imagine spațiu'

  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={altText}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setIsValid(false)}
        onLoad={(event) => {
          const img = event.currentTarget
          if (img.naturalWidth < 50 || img.naturalHeight < 50) {
            setIsValid(false)
          }
        }}
      />
    </div>
  )
}

