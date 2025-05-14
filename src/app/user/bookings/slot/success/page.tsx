'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import api from '@/utils/api'

export default function SlotBookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      router.push('/')
      return
    }

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        await api.post('/payment/verify-slot/', { session_id: sessionId })
      } catch (error) {
        console.error('Payment verification failed:', error)
      }
    }

    verifyPayment()
  }, [sessionId, router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={() => {}} />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your stadium slots have been successfully booked. A confirmation has been sent to your email.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">
                Booking Details
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Session ID: {sessionId}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/home')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Back to Home
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}