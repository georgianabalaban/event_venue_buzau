import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.variable}>
      {children}
    </div>
  )
}

