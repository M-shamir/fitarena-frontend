'use client'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiClock, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import { useEffect, useState } from 'react'
import { use } from 'react'
import api from '@/utils/api'

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
  description: string
  address: string
  city: string
  state: string
  pincode: string
  image_url: string
  location: {
    type: string
    coordinates: number[]
  }
  owner: {
    user: {
      username: string
      email: string
    }
    phone_number: string
  }
  approval_status: string
  listed: boolean
  created_at: string
  slots: Slot[]
  amenities?: string[] // Optional if your API might include this later
  capacity?: string   // Optional
  sports?: string[]   // Optional
}

export default function StadiumDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [stadium, setStadium] = useState<Stadium | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const unwrappedParams = use(params) as { id: string }
  const StadiumId = unwrappedParams.id

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const response = await api.get(`/user/stadiums/${StadiumId}/`)
        setStadium(response.data)
      } catch (err) {
        setError('Failed to fetch stadium details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStadium()
  }, [StadiumId])

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

  // Helper functions
  const getOperatingHours = () => {
    if (!stadium.slots || stadium.slots.length === 0) return "No available slots"
    
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }

    const earliest = stadium.slots.reduce((prev, current) => 
      timeToMinutes(prev.start_time) < timeToMinutes(current.start_time) ? prev : current
    )
    const latest = stadium.slots.reduce((prev, current) => 
      timeToMinutes(prev.end_time) > timeToMinutes(current.end_time) ? prev : current
    )

    return `${earliest.start_time} - ${latest.end_time}`
  }

  const getPriceRange = () => {
    if (!stadium.slots || stadium.slots.length === 0) return "₹NA/hr"
    
    const prices = stadium.slots.map(slot => parseFloat(slot.price))
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return minPrice === maxPrice 
      ? `₹${minPrice}/hr` 
      : `₹${minPrice} - ₹${maxPrice}/hr`
  }

  // Default amenities if not provided by API
  const amenities = stadium.amenities || [
    "Parking",
    "Changing Rooms",
    "Flood Lights",
    "Water Facility",
    "Seating"
  ]

  // Default sports if not provided by API
  const sports = stadium.sports || ["Football", "Cricket"]

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
          ← Back to stadiums
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
              <Image 
                src={stadium.image_url} 
                alt={stadium.name} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            {/* Placeholder for additional images - can be removed if not needed */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((index) => (
                <div key={index} className="relative h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                  <Image 
                    src={stadium.image_url} 
                    alt={`${stadium.name} ${index}`} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              {stadium.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center text-yellow-500 bg-yellow-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                <FiStar className="mr-1" /> 4.5
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                <FiMapPin className="mr-1" /> {stadium.city}, {stadium.state}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              {stadium.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  icon: FiClock, 
                  label: "Operating Hours", 
                  value: getOperatingHours() 
                },
                { 
                  icon: FiUsers, 
                  label: "Capacity", 
                  value: stadium.capacity || "100 people" 
                },
                { 
                  icon: FiDollarSign, 
                  label: "Price Range", 
                  value: getPriceRange(), 
                  highlight: true 
                },
                { 
                  icon: FiCalendar, 
                  label: "Available Sports", 
                  value: sports.join(", ") 
                }
              ].map(({ icon: Icon, label, value, highlight }, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <Icon className="mr-2" /> 
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className={`font-medium ${highlight ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/user/bookings/slot/${stadium.id}/`)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Book Now
            </motion.button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}