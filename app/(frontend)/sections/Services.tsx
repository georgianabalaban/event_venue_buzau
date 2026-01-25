'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, PartyPopper, Heart, Cake, Sparkles } from 'lucide-react'
import ServiceModal from '../components/ServiceModal'

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
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [serviceDetails, setServiceDetails] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const defaultItems = [
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

  const services = (Array.isArray(data?.items) && data!.items!.length > 0)
    ? data!.items!
    : defaultItems

  // Fetch service details when a service is clicked
  useEffect(() => {
    if (selectedService) {
      // Try localStorage first (from admin panel)
      const savedDetails = localStorage.getItem('serviceDetails')
      if (savedDetails) {
        try {
          const allDetails = JSON.parse(savedDetails)
          const details = allDetails[selectedService]
          
          if (details && details.length > 0) {
            // Transform localStorage format to modal format
            setServiceDetails({
              name: selectedService,
              gallery: details.map((d: any) => ({
                image: {
                  url: d.imageUrl,
                  externalUrl: d.imageUrl,
                  alt: selectedService
                },
                description: d.description
              })),
              ctaText: 'Rezervă acum',
              ctaLink: '#contact'
            })
            setIsModalOpen(true)
            return
          }
        } catch (err) {
          console.error('Error parsing localStorage:', err)
        }
      }
      
      // Fallback to API
      fetch(`/api/service-details?name=${encodeURIComponent(selectedService)}`)
        .then(res => res.json())
        .then(data => {
          setServiceDetails(data)
          setIsModalOpen(true)
        })
        .catch(err => {
          console.error('Error fetching service details:', err)
          // Open modal anyway with basic info
          setServiceDetails({
            name: selectedService,
            gallery: []
          })
          setIsModalOpen(true)
        })
    }
  }, [selectedService])

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setSelectedService(null)
      setServiceDetails(null)
    }, 300)
  }

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
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
            {data?.title || 'Tipuri de evenimente'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
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
                className="group relative h-full"
              >
                <button
                  onClick={() => handleServiceClick(service.name)}
                  className="relative h-full w-full p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col text-center items-center justify-center cursor-pointer"
                >
                  {/* Content */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    {service.description}
                  </p>
                  <p className="text-xs text-primary-600 mt-4 font-medium">
                    Click pentru detalii →
                  </p>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={serviceDetails}
      />
    </section>
  )
}

