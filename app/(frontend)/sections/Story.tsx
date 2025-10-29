'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function Story() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
              <Heart className="w-5 h-5 text-primary-600" />
              <span className="text-primary-700 font-semibold">Povestea noastră</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Cum a început totul
            </h2>
          </motion.div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Locația noastră este un <strong>proiect de suflet</strong>, născut din dorința de a oferi 
                oamenilor un loc special unde să sărbătorească momentele importante alături de cei dragi.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Am transformat cu grijă acest spațiu într-o <strong>oază de liniște și frumusețe</strong>, 
                situată lângă Buzău, unde natura se îmbină perfect cu confortul modern. 
                Am pus aici toată energia și pasiunea noastră pentru a crea un cadru 
                în care fiecare eveniment devine o amintire de neuitat.
              </p>

              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Cu <strong>experiență în organizarea a sute de evenimente</strong>, de la nunți de vis 
                și petreceri corporate până la aniversări intime și celebrări speciale, 
                am învățat că fiecare eveniment este unic și merită o atenție personalizată.
              </p>

              <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border-l-4 border-primary-600">
                <p className="text-lg text-gray-700 italic">
                  <strong>Nu există mândrie mai mare</strong> decât să știm că am făcut parte din 
                  bucuria celor care ne-au ales și să vedem cum visurile lor prind viață 
                  în grădina noastră.
                </p>
              </div>

              <div className="mt-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Misiunea noastră
                  </h3>
                  <p className="text-gray-600">
                    Să creăm cadrul perfect pentru <strong>evenimente de suflet</strong>, 
                    unde fiecare detaliu este gândit cu grijă și pasiune, 
                    pentru ca tu să te bucuri din plin de momentele tale speciale.
                  </p>
                </div>
                
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <Heart className="w-12 h-12 text-white fill-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Autenticitate',
                description: 'Suntem o afacere de familie, gândită cu suflet pentru a crea amintiri reale',
              },
              {
                title: 'Atenție la detalii',
                description: 'Fiecare element este ales cu grijă pentru experiența perfectă',
              },
              {
                title: 'Pasiune',
                description: 'Iubim ceea ce facem și se vede în fiecare eveniment',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}




