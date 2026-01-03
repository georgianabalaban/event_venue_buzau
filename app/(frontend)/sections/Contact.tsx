'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'

const bookingSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  email: z.string().email('Email invalid'),
  phone: z.string().min(10, 'Număr de telefon invalid'),
  eventDate: z.string().min(1, 'Data este obligatorie'),
  eventType: z.string().min(1, 'Tipul evenimentului este obligatoriu'),
  guestCount: z.number().min(1, 'Numărul de invitați este obligatoriu').optional(),
  message: z.string().optional(),
})

type BookingForm = z.infer<typeof bookingSchema>

interface ContactProps {
  data?: {
    title?: string
    phone?: string
    email?: string
    address?: string
  }
}

export default function Contact({ data }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = async (formData: BookingForm) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      setSubmitStatus('success')
      reset()
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
            {data?.title || 'Contactează-ne'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Completează formularul și te vom contacta în cel mai scurt timp
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Informații de contact
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Telefon</h4>
                    <a href={`tel:${data?.phone || '+40766441140'}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                      {data?.phone || '+40 766 441 140'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <a href={`mailto:${data?.email || 'contact@eventvenue.ro'}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                      {data?.email || 'contact@eventvenue.ro'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Adresă</h4>
                    <p className="text-gray-600">
                      {data?.address || 'Strada Bordei, Potoceni 127327'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500" />
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
                Hartă / Imagine locație
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Solicită o rezervare
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nume complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Ion Popescu"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="ion@email.ro"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="0712345678"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Event Date & Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Data eveniment *
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      {...register('eventDate')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    {errors.eventDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                      Tip eveniment *
                    </label>
                    <select
                      id="eventType"
                      {...register('eventType')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selectează</option>
                      <option value="petreceri-copii">Petreceri de copii</option>
                      <option value="petreceri-botez">Petreceri de botez</option>
                      <option value="serbari">Serbări școli / grădinițe</option>
                      <option value="aniversare">Petreceri aniversare</option>
                    </select>
                    {errors.eventType && (
                      <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
                    )}
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Număr invitați
                  </label>
                  <input
                    type="number"
                    id="guestCount"
                    {...register('guestCount', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="50"
                    min="1"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj (opțional)
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Detalii suplimentare despre eveniment..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white px-6 py-5 rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      Trimite cererea
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Cererea a fost trimisă cu succes! Te vom contacta în curând.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>A apărut o eroare. Te rugăm să încerci din nou.</span>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

