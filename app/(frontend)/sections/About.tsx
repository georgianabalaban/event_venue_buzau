'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface AboutProps {
  data?: {
    title?: string
    description?: string
    features?: Array<{ feature: string }>
  }
}

export default function About({ data }: AboutProps) {
  const features = data?.features || [
    { feature: 'Spațiu exterior cu piscină' },
    { feature: 'Sală interioară elegantă' },
    { feature: 'Capacitate până la 200 persoane' },
    { feature: 'Parcare privată' },
    { feature: 'Catering personalizat' },
    { feature: 'Echipament audio-video modern' },
  ]

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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {data?.title || 'Despre spațiul nostru'}
            </h2>
            
            <div className="prose prose-lg text-gray-600 mb-8">
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
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">{item.feature}</span>
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
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder gradient - Replace with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500" />
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
                Imagine spațiu
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-400 rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-400 rounded-full blur-2xl opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

