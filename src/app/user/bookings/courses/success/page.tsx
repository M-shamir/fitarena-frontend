// app/courses/success/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/utils/api'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    if (!session_id) {
      setError('Invalid session ID')
      setLoading(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await api.get(`/payment/verify/?session_id=${session_id}`)
        if (response.data.success) {
          // Fetch course details if needed
          if (response.data.course_id) {
            const courseResponse = await api.get(`/user/courses/${response.data.course_id}/`)
            setCourse(courseResponse.data)
          }
        } else {
          setError('Payment verification failed')
        }
        setLoading(false)
      } catch (err: any) {
        setError(err.response?.data?.error || 'Payment verification error')
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <p className="text-gray-600 dark:text-gray-300">Verifying payment...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 text-red-500 dark:text-red-400">Payment Error</h1>
            <p className="mb-4">{error}</p>
            <Link 
              href="/courses" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Courses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={() => {}} />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">Payment Successful!</h1>
          
          {course && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">You've enrolled in: {course.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Link 
              href="/courses" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Browse More Courses
            </Link>
            {course && (
              <Link 
                href={`/courses/${course.id}`}
                className="inline-block ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Course
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}