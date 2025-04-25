import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fitarena | Book Sports Facilities & Trainers',
  description: 'Book stadiums, hire trainers, and host games with Fitarena',
  keywords: ['sports booking', 'stadium rental', 'personal trainers', 'game hosting'],
  openGraph: {
    title: 'Fitarena | Book Sports Facilities & Trainers',
    description: 'Book stadiums, hire trainers, and host games with Fitarena',
    url: 'https://fitarena.com',
    siteName: 'Fitarena',
    images: [
      {
        url: 'https://fitarena.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitarena | Book Sports Facilities & Trainers',
    description: 'Book stadiums, hire trainers, and host games with Fitarena',
    images: ['https://fitarena.com/twitter-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}