'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  text: string
  rating: number
  date?: string
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Maria & Alexandru',
      text: 'Flying Fox este un loc în care te simți atât de bine! Locația este superbă, o grădină foarte relaxantă cu multă verdeață. Mâncarea delicioasă, aranjamentele florale și muzica bună au fost parte din rețeta unei petreceri de succes. Evenimentul a fost peste așteptări!',
      rating: 5,
      date: '2024',
    },
    {
      id: 2,
      name: 'Ana',
      text: 'Am intuit bine că în colțul vostru de Rai vom avea cele mai frumoase amintiri de la botezul copilului nostru! Impecabilă organizare, decorul de vis, echipa promptă și mereu acolo! Singurul meu task a fost acela de a fi relaxată! A fost totul peste așteptări!',
      rating: 5,
      date: '2024',
    },
    {
      id: 3,
      name: 'Ioana & Mihai',
      text: 'Este un loc minunat. Atmosfera, piscina, grădina, totul este wow. Abia așteptăm următoarea petrecere. Voi faceți ca lucrurile să se întâmple atât de frumos! Un eveniment memorabil în grădina secretă.',
      rating: 5,
      date: '2024',
    },
  ]

  const averageRating = 4.9
  const totalReviews = 150

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Păreri de la oaspeții noștri
          </h2>
          
          {/* Rating Display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-2xl font-bold text-gray-900">{averageRating}</div>
          </div>
          
          <p className="text-gray-600">
            Bazat pe {totalReviews}+ evenimente organizate
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                {testimonial.date && (
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 mb-6">
            Alătură-te celor care au avut evenimente memorabile
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Rezervă acum
          </a>
        </motion.div>
      </div>
    </section>
  )
}

