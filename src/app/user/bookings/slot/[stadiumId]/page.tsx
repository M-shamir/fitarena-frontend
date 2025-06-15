'use client'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiArrowLeft } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import { useState, useEffect } from 'react'
import api from '@/utils/api'
import Image from 'next/image'

interface Slot {
  id: number
  date: string
  start_time: string
  end_time: string
  price: string
  status: string
}

interface Stadium {
  id: number
  name: string
  image_url: string
  address: string
  city: string
  state: string
  slots: Slot[]
}

export default function SlotSelectionPage({ params }: { params: { stadiumId: string } }) {
  const router = useRouter()
  const [stadium, setStadium] = useState<Stadium | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        // Fetch stadium details and slots in parallel
        const [stadiumRes, slotsRes] = await Promise.all([
          api.get(`/user/stadiums/${params.stadiumId}/`),
          api.get(`/user/stadiums/${params.stadiumId}/available-slots/`)
        ]);
        
        setStadium({
          ...stadiumRes.data,
          slots: slotsRes.data
        });
        
        if (slotsRes.data.length > 0) {
          setSelectedDate(slotsRes.data[0].date);
        }
      } catch (err) {
        console.log(err);
        
        setError('Failed to fetch stadium details');
      } finally {
        setLoading(false);
      }
    }
    fetchStadium();
  }, [params.stadiumId]);

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

  if (error || !stadium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error || 'Stadium not found'}</span>
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

  // Get unique dates from available slots
  const availableDates = Array.from(new Set(stadium.slots.map(slot => slot.date)))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Filter slots by selected date
  const availableSlots = stadium.slots
    .filter(slot => slot.date === selectedDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedSlots([])
  }

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId)
      } else {
        return [...prev, slotId]
      }
    })
  }

  const handleProceedToCheckout = () => {
    if (selectedSlots.length > 0) {
      const slotIds = selectedSlots.join(',')
      router.push(`/user/bookings/slot/${params.stadiumId}/checkout?slotIds=${slotIds}`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Calculate total price of selected slots
  const totalPrice = selectedSlots.reduce((total, slotId) => {
    const slot = stadium.slots.find(s => s.id === slotId)
    return total + (slot ? parseFloat(slot.price) : 0)
  }, 0)

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
          <FiArrowLeft className="mr-2" /> Back to stadium
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stadium Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image 
                  src={stadium.image_url} 
                  alt={stadium.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{stadium.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {stadium.address}, {stadium.city}, {stadium.state}
                </p>
                
                {selectedSlots.length > 0 && (
                  <div className="mt-6 bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-2">Selected Slots ({selectedSlots.length})</h3>
                    <div className="space-y-2">
                      {selectedSlots.map(slotId => {
                        const slot = stadium.slots.find(s => s.id === slotId)
                        if (!slot) return null
                        return (
                          <div key={slotId} className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2 last:border-0">
                            <p>{formatDate(slot.date)}</p>
                            <p>{slot.start_time} - {slot.end_time}</p>
                            <p className="text-green-600 dark:text-green-400 font-medium">₹{slot.price}</p>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="font-medium text-gray-800 dark:text-white">
                        Total: <span className="text-green-600 dark:text-green-400">₹{totalPrice.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Select Date & Time</h2>
              </div>

              {/* Date Selection */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-white mb-4">
                  <FiCalendar className="mr-2" /> Select Date
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      onClick={() => handleDateChange(date)}
                      className={`py-3 px-2 rounded-lg text-center transition ${selectedDate === date 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {formatDate(date)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="p-6">
                <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-white mb-4">
                  <FiClock className="mr-2" /> Available Time Slots
                </h3>
                
                {availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No available slots for this date
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelection(slot.id)}
                        disabled={slot.status !== 'available'}
                        className={`p-4 rounded-lg border transition ${selectedSlots.includes(slot.id)
                          ? 'border-green-500 bg-green-50 dark:bg-gray-700' 
                          : slot.status === 'available'
                            ? 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${
                            selectedSlots.includes(slot.id)
                              ? 'text-green-600 dark:text-green-400'
                              : slot.status === 'available'
                                ? 'text-gray-800 dark:text-gray-200'
                                : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {slot.start_time} - {slot.end_time}
                          </span>
                          <span className={`font-medium ${
                            selectedSlots.includes(slot.id)
                              ? 'text-green-600 dark:text-green-400'
                              : slot.status === 'available'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            ₹{slot.price}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {slot.status === 'available' ? 'Available' : 'Booked'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Proceed Button */}
            <motion.button
              whileHover={{ scale: selectedSlots.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: selectedSlots.length > 0 ? 0.98 : 1 }}
              onClick={handleProceedToCheckout}
              disabled={selectedSlots.length === 0}
              className={`w-full mt-6 py-4 px-6 rounded-lg shadow-lg transition-all ${selectedSlots.length > 0
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-pointer' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedSlots.length > 0 
                ? `Proceed to Checkout (${selectedSlots.length} slot${selectedSlots.length > 1 ? 's' : ''})`
                : 'Select slots to continue'}
            </motion.button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}