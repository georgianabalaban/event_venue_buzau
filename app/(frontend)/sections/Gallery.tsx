'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const categories = [
  { id: 'all', label: 'Toate' },
  { id: 'indoor', label: 'Interior' },
  { id: 'outdoor', label: 'Exterior' },
  { id: 'pool', label: 'Piscină' },
  { id: 'events', label: 'Evenimente' },
]

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Placeholder images - replace with actual gallery data from Payload
  const images = [
    { id: 1, category: 'indoor', alt: 'Sală interioară' },
    { id: 2, category: 'outdoor', alt: 'Spațiu exterior' },
    { id: 3, category: 'pool', alt: 'Piscină' },
    { id: 4, category: 'events', alt: 'Eveniment' },
    { id: 5, category: 'indoor', alt: 'Sală interioară 2' },
    { id: 6, category: 'outdoor', alt: 'Grădină' },
  ]

  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter((img) => img.category === selectedCategory)

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

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* Placeholder gradient - Replace with actual images */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400" />
              
              {/* Overlay - always visible, gets darker on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300" />
              
              {/* Image info - always visible */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-bold text-lg drop-shadow-lg">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

