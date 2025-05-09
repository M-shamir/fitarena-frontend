'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiStar, FiMapPin, FiClock } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'
import api from '@/utils/api'

interface Stadium {
  id: number
  name: string
  description: string
  address: string
  city: string
  state: string
  distance: number | null
  image_url: string | null
}

export default function PopularStadiums({ userLocation }: { userLocation: { lat: number, lng: number } | null }) {
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        if (!userLocation) {
          console.log('User location not available.');
          setError('Location is required to fetch nearby stadiums.');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        console.log('Fetching stadiums with location:', userLocation);

        const endpoint = `/user/stadiums/nearby/?lat=${userLocation.lat}&lng=${userLocation.lng}`;
        console.log('API endpoint:', endpoint);

        const response = await api.get(endpoint);
        console.log('API response:', response.data);

        if (response.data && Array.isArray(response.data.stadiums)) {
          setStadiums(response.data.stadiums);
        } else {
          throw new Error('Invalid data format received from server.');
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to fetch stadiums.');
        console.log('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums();
  }, [userLocation]);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (stadiums.length === 0) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-medium mb-2">No stadiums found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {userLocation ? 'Try expanding your search area' : 'Please check back later'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="flex justify-between items-center mb-12">
          <div>
            <span className="text-green-500 font-medium">PREMIUM VENUES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              {userLocation ? 'Stadiums Near You' : 'Popular Stadiums'}
            </h2>
            {userLocation ? (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Showing stadiums within 50km of your location
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Showing popular stadiums across our network
              </p>
            )}
          </div>
          <button className="text-green-600 dark:text-green-400 font-medium flex items-center hover:underline group">
            View all <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stadiums.map((stadium, index) => (
            <AnimatedContainer key={stadium.id} delay={index * 0.1}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all h-full flex flex-col"
              >
                {stadium.image_url ? (
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src={stadium.image_url}
                      alt={stadium.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      {stadium.distance !== null && (
                        <div className="text-white text-sm font-medium">
                          {stadium.distance.toFixed(1)} km away
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No image available</span>
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{stadium.name}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <FiMapPin className="mr-2" /> 
                    {[stadium.address, stadium.city, stadium.state].filter(Boolean).join(', ')}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {stadium.description || 'No description available'}
                  </p>
                </div>
                
                <div className="px-6 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center"
                  >
                    Book Now <FiArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  )
}