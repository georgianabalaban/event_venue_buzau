'use client'

import { motion } from 'framer-motion'
import { Briefcase, PartyPopper, Heart, Cake, Sparkles } from 'lucide-react'

interface ServicesProps {
  data?: {
    title?: string
    items?: Array<{
      name: string
      description: string
      icon?: string
    }>
  }
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  partypopper: PartyPopper,
  heart: Heart,
  cake: Cake,
  sparkles: Sparkles,
}

export default function Services({ data }: ServicesProps) {
  const services = data?.items || [
    {
      name: 'Evenimente Corporate',
      description: 'Conferințe, team building, lansări de produse și alte evenimente profesionale.',
      icon: 'briefcase',
    },
    {
      name: 'Petreceri Private',
      description: 'Petreceri personalizate pentru orice ocazie specială, într-un cadru unic.',
      icon: 'partypopper',
    },
    {
      name: 'Nunți',
      description: 'Transformăm visul tău în realitate cu servicii complete pentru ziua ta specială.',
      icon: 'heart',
    },
    {
      name: 'Aniversări',
      description: 'Sărbătorește împreună cu cei dragi într-un spațiu elegant și primitoare.',
      icon: 'cake',
    },
  ]

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {data?.title || 'Tipuri de evenimente'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organizăm și găzduim o varietate de evenimente, personalizate pentru nevoile tale
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon?.toLowerCase() || 'sparkles'] || Sparkles
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative p-8 bg-white border border-gray-200 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {/* Icon */}
                  <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

