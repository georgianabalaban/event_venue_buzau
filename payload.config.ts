import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Import collections
import { Pages } from './collections/Pages'
import { Events } from './collections/Events'
import { Gallery } from './collections/Gallery'
import { Settings } from './collections/Settings'
import { Bookings } from './collections/Bookings'
import { Users } from './collections/Users'
import { Testimonials } from './collections/Testimonials'
import { FAQs } from './collections/FAQs'
import { ServiceDetails } from './collections/ServiceDetails'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Event Venue Admin',
    },
  },
  editor: lexicalEditor({}),
  collections: [Pages, Events, Gallery, Bookings, Testimonials, FAQs, ServiceDetails, Users],
  globals: [Settings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      serverSelectionTimeoutMS: 10000, // 10 secunde timeout
      socketTimeoutMS: 45000, // 45 secunde socket timeout
      maxPoolSize: 10, // Limiteaza conexiunile simultane
    },
  }),
  sharp: require('sharp'),
  onInit: async (payload) => {
    // Graceful shutdown handler
    const gracefulShutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...')
      try {
        // Close database connections
        if (payload.db && typeof payload.db.destroy === 'function') {
          await payload.db.destroy()
          console.log('✅ Database connections closed')
        }
        process.exit(0)
      } catch (error) {
        console.error('❌ Error during shutdown:', error)
        process.exit(1)
      }
    }

    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)
    process.on('SIGUSR2', gracefulShutdown) // nodemon restart
  },
})

