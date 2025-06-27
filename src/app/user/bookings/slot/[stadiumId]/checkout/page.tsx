'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import api from '@/utils/api'
import Image from 'next/image'

interface Slot {
  id: number
  date: string
  start_time: string
  end_time: string
  price: string
  status: string
  stadium_id: number
  stadium?: {
    id: number
    name: string
    image_url: string
    address: string
  }
}

interface ApiResponse {
  slots: Slot[]
  total_price: string
  stadium?: {
    id: number
    name: string
    image_url: string
    address: string
  }
}

export default function SlotCheckoutPage({
  params,
}: {
  params: { stadiumId: string }
}) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [stadium, setStadium] = useState<ApiResponse['stadium']>()
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const slotIds = urlSearchParams?.get('slotIds')?.split(',') || []
    
    const fetchSlots = async () => {
      try {
         
        const response = await api.get<ApiResponse>(
          `/user/stadiums/${params.stadiumId}/slots/book/?ids=${slotIds.join(',')}`
        )
        
        if (response.data.slots.length !== slotIds.length) {
          throw new Error('Some slots are no longer available')
        }
        
        const unavailableSlots = response.data.slots.filter(slot => slot.status !== 'available')
        if (unavailableSlots.length > 0) {
          throw new Error('Some selected slots are no longer available')
        }
        
        setSlots(response.data.slots)
        setTotalAmount(parseFloat(response.data.total_price))
        
        if (response.data.stadium) {
          setStadium(response.data.stadium)
        } else {
          const stadiumRes = await api.get(`/user/stadiums/${stadiumId}/`)
          setStadium(stadiumRes.data)
        }
        
      } catch (err: unknown) {
        setError(err.message || 'Failed to fetch slot details')
        router.push(`/user/bookings/slot/${params.stadiumId}`)
      } finally {
        setLoading(false)
      }
    }
    
    if (slotIds.length > 0) {
      fetchSlots()
    } else {
      router.push(`/user/bookings/slot/${params.stadiumId}`)
    }
  }, [params.stadiumId, urlSearchParams, router])

  const handlePayment = async () => {
    setPaymentProcessing(true)
    try {
      const slotIds = slots.map(slot => slot.id)
      const response = await api.post('/payment/slot/', { 
        slot_ids: slotIds,
        stadium_id: params.stadiumId,
        total_amount: totalAmount
      })
      
      // Redirect to Stripe checkout
      window.location.href = response.data.payment_url
    } catch (err: unknown) {
      setError(err.response?.data?.error || 'Payment initiation failed')
      setPaymentProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12 text-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => router.back()} 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
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
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition"
        >
          <FiArrowLeft className="mr-2" /> Back to slot selection
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                {stadium?.image_url && (
                  <Image 
                    src={stadium.image_url} 
                    alt={stadium.name} 
                    fill 
                    className="object-cover" 
                    priority
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {stadium?.name || 'Stadium'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {stadium?.address || ''}
                </p>
                
                <div className="mt-6 bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                    Selected Slots ({slots.length})
                  </h3>
                  <div className="space-y-2">
                    {slots.map(slot => (
                      <div key={slot.id} className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2 last:border-0">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" />
                          <p>{formatDate(slot.date)}</p>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-2" />
                          <p>{slot.start_time} - {slot.end_time}</p>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-medium">₹{slot.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="font-medium text-gray-800 dark:text-white">
                      Total: <span className="text-green-600 dark:text-green-400">₹{totalAmount.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Payment Details</h2>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                    Payment Method
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="stripe" 
                        name="payment" 
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 dark:border-gray-600" 
                        checked 
                        readOnly
                      />
                      <label htmlFor="stripe" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Credit/Debit Card (Stripe)
                      </label>
                    </div>
                    <div className="mt-2 pl-6 text-sm text-gray-500 dark:text-gray-400">
                      Secure payment processed by Stripe
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                    Booking Summary
                  </h3>
                  <div className="space-y-3">
                    {slots.map(slot => (
                      <div key={slot.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {formatDate(slot.date)} • {slot.start_time}-{slot.end_time}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {stadium?.name || 'Stadium'}
                          </p>
                        </div>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          ₹{slot.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="text-gray-800 dark:text-white">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Tax (if any)</span>
                    <span className="text-gray-800 dark:text-white">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-800 dark:text-white">Total</span>
                    <span className="text-green-600 dark:text-green-400">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={paymentProcessing}
              className={`w-full mt-6 py-4 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center ${
                paymentProcessing
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-pointer'
              }`}
            >
              {paymentProcessing ? (
                'Processing...'
              ) : (
                <>
                  <FiCheckCircle className="mr-2" />
                  Pay ₹{totalAmount.toFixed(2)} and Confirm Booking
                </>
              )}
            </motion.button>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              By completing your purchase, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}