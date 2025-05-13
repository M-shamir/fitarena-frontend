// app/courses/[courseId]/checkout/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/utils/api'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'

export default function CourseCheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/user/courses/${courseId}/`)
        setCourse(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch course details")
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handlePayment = async () => {
    setPaymentProcessing(true)
    try {
      // Create payment session on backend
      const response = await api.post(`/payment/course/${courseId}/`) 
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.payment_url
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed to initialize')
      setPaymentProcessing(false)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
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
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
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
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
            <p className="text-lg font-bold">₹{course.price}</p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{course.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{course.price}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={paymentProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {paymentProcessing ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}