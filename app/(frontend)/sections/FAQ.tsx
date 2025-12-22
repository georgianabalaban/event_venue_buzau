'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1)

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'Care este capacitatea maximă a locației?',
      answer: 'Locația noastră poate găzdui până la 200 de persoane. Avem atât spațiu exterior cu piscină, cât și sală interioară elegantă, perfect echipate pentru evenimente de orice dimensiune. Facilități precum parcarea, toaletele și zona de catering sunt proiectate pentru a susține acest număr de participanți.',
    },
    {
      id: 2,
      question: 'Ce facem în caz de vreme nefavorabilă?',
      answer: 'Avem atât spațiu exterior, cât și interior complet acoperit și amenajat. În cazul ploii sau vremii nefavorabile, evenimentul poate fi mutat în sala interioară, fără a compromite atmosfera sau calitatea petrecerii. Echipa noastră este pregătită să se adapteze rapid oricăror condiții meteo.',
    },
    {
      id: 3,
      question: 'Aveți parcare disponibilă?',
      answer: 'Da, avem o parcare privată suficient de mare pentru a acomoda toți invitații. Parcarea este gratuită și este situată în imediata apropiere a locației pentru confortul maxim al oaspeților.',
    },
    {
      id: 4,
      question: 'Putem aduce noi mâncarea și băutura?',
      answer: 'Pentru a menține standardele de calitate și siguranță alimentară, colaborăm cu parteneri verificați pentru catering. Putem discuta despre preferințele voastre culinare și vă putem recomanda opțiuni personalizate care să se potrivească perfect evenimentului vostru.',
    },
    {
      id: 5,
      question: 'Organizați mai multe evenimente în același timp?',
      answer: 'Nu. Organizăm un singur eveniment pe zi pentru un singur client. Locația este disponibilă exclusiv pentru dumneavoastră în acea zi, asigurând intimitate completă și atenție deplină din partea echipei noastre.',
    },
    {
      id: 6,
      question: 'Ce servicii sunt incluse în pachetul de bază?',
      answer: 'Pachetul de bază include: închirierea spațiului pentru întreaga zi, mobilier (mese, scaune), decorațiuni de bază, echipament audio-video modern, iluminat ambiental, acces la piscină și grădină, și suportul echipei noastre pe toată durata evenimentului. Putem personaliza pachetul în funcție de nevoile voastre specifice.',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
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
            Întrebări frecvente
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Răspunsuri la cele mai comune întrebări despre locația noastră
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg md:text-xl font-bold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Nu ai găsit răspunsul la întrebarea ta?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contactează-ne
          </a>
        </motion.div>
      </div>
    </section>
  )
}







