'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiStar, FiMapPin, FiClock, FiAward, FiUser } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'
import TabSwitcher from '../ui/TabSwitcher'
import api from '@/utils/api'
import Link from 'next/link'

interface Stadium {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  distance: number
  image_url: string
}

interface TrainerType {
  id: number
  name: string
}

interface Language {
  id: number
  name: string
}

interface User {
  username: string
  email: string
}

interface Trainer {
  id: number
  user: User
  phone_number: string
  gender: string
  trainer_type: TrainerType[]
  certifications: string
  languages_spoken: Language[]
  training_photo: string
  listed: boolean
}

interface Location {
  lat: number
  lng: number
}

const bookingTabs = ['stadiums', 'trainers', 'host']

export default function QuickBooking() {
  const [activeTab, setActiveTab] = useState(bookingTabs[0])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<Location | null>(null)

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation')
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation)
        if (parsedLocation.lat && parsedLocation.lng) {
          setUserLocation(parsedLocation)
        }
      } catch (error) {
        console.error('Error parsing location:', error)
      }
    }
  }, [])

  const fetchStadiums = useCallback(async () => {
    if (!userLocation) return
    
    try {
      setLoading(true)
      const endpoint = `/user/stadiums/nearby/?lat=${userLocation.lat}&lng=${userLocation.lng}`
      const response = await api.get(endpoint)
      const data = response.data
      
      if (!data || !Array.isArray(data.stadiums)) {
        throw new Error('Invalid data format received from server.')
      }
  
      setStadiums(data.stadiums.slice(0, 3))
    } catch (err) {
      setError('Failed to fetch stadiums')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [userLocation])

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/user/trainers/available/')
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received from server.')
      }
      setTrainers(response.data.slice(0, 3))
    } catch (err) {
      setError('Failed to fetch trainers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'stadiums' && userLocation) {
      fetchStadiums()
    } else if (activeTab === 'trainers') {
      fetchTrainers()
    }
  }, [activeTab, userLocation, fetchStadiums, fetchTrainers])

  const getTabDescription = () => {
    switch (activeTab) {
      case 'stadiums':
        return "Book premium sports facilities for your next game or training session"
      case 'trainers':
        return "Connect with certified professionals to elevate your skills"
      case 'host':
        return "Organize and manage your sports events with ease"
      default:
        return "Find what you need for your sports experience"
    }
  }

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 w-2/3"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderStadiums = () => (
    <AnimatePresence mode="wait">
      {loading ? (
        renderLoadingSkeleton()
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stadiums.map((stadium) => (
            <motion.div
              key={stadium.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: stadium.id * 0.1 }
              }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(stadium.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={stadium.image_url}
                  alt={stadium.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <AnimatePresence>
                  {hoveredCard === stadium.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 text-green-600 font-bold px-3 py-1 rounded-full text-xs shadow">
                  {Math.round(stadium.distance)} km away
                </div>
              </div>
              <Link href={`/user/stadiums/${stadium.id}`} passHref>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">
                    {stadium.name}
                  </h3>
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <FiStar className="mr-1" /> 4.5
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-5">
                  {stadium.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiMapPin className="mr-1" />
                    {stadium.city}, {stadium.state}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-5 rounded-full shadow hover:shadow-md transition-all flex items-center"
                  >
                    Book Now <FiArrowRight className="ml-2" />
                  </motion.button>
                  
                </div>
                
              </div>
              </Link>
              <AnimatePresence>
                {hoveredCard === stadium.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
                  >
                    <div className="flex items-center text-white text-sm">
                      <FiClock className="mr-2" />
                      Available: 8AM-10PM
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const renderTrainers = () => (
    <AnimatePresence mode="wait">
      {loading ? (
        renderLoadingSkeleton()
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: trainer.id * 0.1 }
              }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(trainer.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={trainer.training_photo}
                  alt={trainer.user.username}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <AnimatePresence>
                  {hoveredCard === trainer.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">
                    {trainer.user.username}
                  </h3>
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <FiStar className="mr-1" /> 4.8
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trainer.trainer_type.map((type) => (
                      <span 
                        key={type.id}
                        className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2.5 py-1 rounded-full"
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <FiUser className="mr-2" />
                    {trainer.gender === 'male' ? 'Male' : 'Female'} Trainer
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiAward className="mr-2" />
                    {trainer.languages_spoken.map(l => l.name).join(', ')}
                  </div>
                </div>
                <Link href={`/user/trainers/${trainer.id}`} passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-5 rounded-full shadow hover:shadow-md transition-all flex items-center justify-center"
                >
                  Book Session <FiArrowRight className="ml-2" />
                </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )

  const renderHost = () => (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-block bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <h3 className="text-2xl font-bold mb-4">Coming Soon!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We re working on exciting features to help you host your sports events.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-6 rounded-full shadow hover:shadow-md transition-all"
        >
          Notify Me When Ready
        </motion.button>
      </motion.div>
    </div>
  )

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-16">
          <span className="text-green-500 font-medium">EASY BOOKING</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Find Your Perfect Match</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {getTabDescription()}
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={0.2} className="flex justify-center mb-12">
          <TabSwitcher 
            tabs={bookingTabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            activeColor="bg-gradient-to-r from-green-500 to-emerald-600"
          />
        </AnimatedContainer>

        {error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : (
          <>
            {activeTab === 'stadiums' && renderStadiums()}
            {activeTab === 'trainers' && renderTrainers()}
            {activeTab === 'host' && renderHost()}
          </>
        )}
      </div>
    </section>
  )
}