'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: number
  name: string
  text: string
  imageUrl?: string
  googleReviewUrl?: string
}

export default function Testimonials() {
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Maria Popescu',
      text: 'Locație superbă pentru petreceri de copii! Am organizat aici ziua de naștere a fiicei mele și a fost o experiență minunată. Grădina este frumoasă, amenajările sunt gândite pentru copii, iar echipa este foarte prietenoasă și atentă la detalii.',
      googleReviewUrl: 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews',
    },
    {
      id: 2,
      name: 'Andrei & Elena',
      text: 'Am ales Kids Club pentru botezul copilului nostru și nu regretăm deloc! Atmosfera caldă și primitoare, decorurile frumoase și mâncarea delicioasă au făcut ziua perfectă. Invitații noștri au fost încântați de locație și de ambiență.',
      googleReviewUrl: 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews',
    },
    {
      id: 3,
      name: 'Ioana Dumitru',
      text: 'Un loc minunat pentru evenimente! Copiii s-au distrat de minune în grădină și la piscină, iar noi am putut să ne relaxăm știind că sunt într-un loc sigur și bine organizat. Recomand cu încredere pentru orice tip de petrecere!',
      googleReviewUrl: 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews',
    },
    {
      id: 4,
      name: 'Alexandru Radu',
      text: 'Locația ideală pentru petreceri de copii! Spațiul este generos, curățenia impecabilă, iar personalul foarte amabil. Copiii au avut parte de o zi memorabilă, iar noi părinții am fost mulțumiți de toate serviciile oferite. 5 stele meritate!',
      googleReviewUrl: 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews',
    },
    {
      id: 5,
      name: 'Diana Stan',
      text: 'O experiență excepțională! Am organizat aici petrecerea de 1 an a bebelușului și totul a fost perfect. De la decorațiuni la meniu, totul a fost gândit cu gust și profesionalism. Grădina este o oază de liniște și frumusețe. Mulțumim!',
      googleReviewUrl: 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews',
    },
    {
      id: 6,
      name: 'Cristina & Mihai',
      text: 'Recomandăm cu drag Kids Club pentru orice tip de eveniment! Staff-ul este profesionist și foarte amabil, locația este curată și primitoare, iar prețurile sunt corecte. Copiii s-au simțit minunat și s-au distrat de minune. O experiență de neuitat!',
      googleReviewUrl: 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews',
    },
  ]

  const googleMapsUrl = 'https://www.google.com/maps/place/Kids+Club/@45.1969109,26.7757652,17z/data=!4m8!3m7!1s0x40b3e19973dde5a3:0x1ecb920596cde42a!8m2!3d45.1969109!4d26.7783401!9m1!1b1!16s%2Fg%2F11t_zvvgtj?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D#lkt=LocalPoiReviews'
  const averageRating = 4.8
  const totalReviews = 38

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
            Păreri de la oaspeții noștri
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Ce spun cei care au avut evenimente la Kids Club
          </p>
        </motion.div>

        {/* Reviews Grid - Flying Fox Style */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
          {reviews.map((review, index) => (
            <motion.a
              key={review.id}
              href={review.googleReviewUrl || googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group block"
            >
              <div className="grid gap-3 sm:gap-4 md:gap-6">
                {/* Profile Image - Circular */}
                <div className="flex justify-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {review.imageUrl ? (
                      <Image
                        src={review.imageUrl}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Review Card */}
                <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-y-[-4px]">
                  <p className="text-center font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
                    {review.name}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 italic leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Google Reviews Widget - Flying Fox Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3 sm:gap-4 px-4"
        >
          {/* Google Customer Reviews Logo */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Google"
              width={74}
              height={24}
              className="mb-1 sm:mb-2"
            />
            <p className="text-xs text-gray-500 text-center">Customer Reviews</p>
          </a>

          {/* Rating Display */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{averageRating}</span>
            
            {/* 5 Stars SVG */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#FDB241"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
            
            <span className="text-sm sm:text-base md:text-lg text-gray-600">({totalReviews})</span>
          </a>

          {/* View All Reviews Link */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            Vezi toate recenziile pe Google Maps
          </a>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 px-4"
        >
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4 md:mb-6">
            Alătură-te celor care au avut evenimente memorabile
          </p>
          <a
            href="#contact"
            className="inline-block w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base"
          >
            Rezervă acum
          </a>
        </motion.div>
      </div>
    </section>
  )
}
