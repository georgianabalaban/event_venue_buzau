'use client'

"use client"

import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroProps {
  data?: {
    heading?: string
    secondaryHeading?: string
    subheading?: string
    ctaText?: string
    backgroundImage?: {
      url: string
      alt?: string
    }
  }
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
        <div className="absolute inset-0 bg-black/40" />
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight"
          >
            <span className="block text-white">
              {data?.heading ?? ''}
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-blue-200">
              {data?.secondaryHeading ?? ''}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100 font-light leading-relaxed"
          >
            {data?.subheading || 'Creăm evenimente memorabile lângă Buzău, într-un cadru natural cu piscină și grădină, unde fiecare detaliu contează pentru evenimentul tău de suflet'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA Button - href="#contact" */}
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              {data?.ctaText || 'Rezervă acum'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
            
            {/* Secondary CTA Button - href="#about" */}
            <a
              href="#about"
              className="group inline-flex items-center gap-2 border-2 border-white text-white bg-white/10 backdrop-blur-sm px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              Descoperă spațiul
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/80 text-sm">Scroll pentru mai mult</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-6 h-6 text-white/80" />
        </motion.div>
      </motion.div>
    </section>
  )
}

