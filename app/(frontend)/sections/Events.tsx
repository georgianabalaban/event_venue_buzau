'use client'

import { motion } from 'framer-motion'
import { Calendar, Users } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  category: string
  price?: number
  availableSpots?: number
  image?: {
    url: string
    alt?: string
  }
}

interface EventsProps {
  events?: Event[]
}

const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Petrecere de Crăciun',
    description: 'Sărbătorește Crăciunul într-o atmosferă magică',
    date: '2025-12-20',
    category: 'party',
    price: 150,
    availableSpots: 50,
  },
  {
    id: '2',
    title: 'Revelion 2026',
    description: 'Întâmpină Anul Nou cu stil',
    date: '2025-12-31',
    category: 'party',
    price: 250,
    availableSpots: 30,
  },
]

export default function Events({ events }: EventsProps) {
  const [displayEvents, setDisplayEvents] = useState<Event[]>(defaultEvents)
  const [isLoading, setIsLoading] = useState(true)

  // Load from API (from database) with localStorage fallback
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Try loading from localStorage first (admin edits cache)
        const cached = localStorage.getItem('eventsCache')
        if (cached) {
          try {
            const cachedEvents = JSON.parse(cached)
            setDisplayEvents(cachedEvents.length > 0 ? cachedEvents : defaultEvents)
          } catch (e) {
            console.error('Error parsing cached events:', e)
          }
        }
        
        // Then try loading from DB (will update if DB responds)
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          setDisplayEvents(data.length > 0 ? data : defaultEvents)
        } else if (events && events.length > 0) {
          setDisplayEvents(events)
        } else if (!cached) {
          // No cache, no API, use default
          setDisplayEvents(defaultEvents)
        }
      } catch (error) {
        console.error('Error loading events from API:', error)
        // Fallback to cached, props, or default
        const cached = localStorage.getItem('eventsCache')
        if (cached) {
          try {
            setDisplayEvents(JSON.parse(cached))
          } catch (e) {
            if (events && events.length > 0) {
              setDisplayEvents(events)
            }
          }
        } else if (events && events.length > 0) {
          setDisplayEvents(events)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [events])

  const categoryLabels: Record<string, string> = {
    corporate: 'Corporate',
    party: 'Petrecere',
    wedding: 'Nuntă',
    birthday: 'Aniversare',
    other: 'Altele',
  }

  return (
    <section id="events" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
            Evenimente tematice
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Alătură-te evenimentelor noastre speciale organizate pe tot parcursul anului
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
                  {event.title}
                </div>
                
                {/* Category badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                  {categoryLabels[event.category] || event.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{formatDate(event.date)}</span>
                  </div>

                  {event.availableSpots && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{event.availableSpots} locuri disponibile</span>
                    </div>
                  )}
                </div>

                {event.price && (
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600">
                      {formatPrice(event.price)}
                    </span>
                    <a
                      href="#contact"
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      Rezervă
                    </a>
                  </div>
                )}
              </div>

              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}

