'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiClock, FiArrowRight, FiFilter } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import api from '@/utils/api'

type Stadium = {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  distance: number | null;
  image_url: string | null;
}

type PriceRange = {
  label: string;
  min: number;
  max: number;
}

export default function StadiumsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [filters, setFilters] = useState({
    cities: [] as string[],
    states: [] as string[],
    priceRange: null as PriceRange | null,
    minRating: 0
  });

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        if (parsedLocation.lat && parsedLocation.lng) {
          setUserLocation(parsedLocation);
        }
      } catch (error) {
        console.error('Error parsing location:', error);
      }
    }
  }, []);
  
  const fetchStadiums = useCallback(async () => {
    try {
      const endpoint = `/user/stadiums/nearby/?lat=${userLocation?.lat || 0}&lng=${userLocation?.lng || 0}`;
      const response = await api.get(endpoint);
      const data = response.data;
      
      if (!data || !Array.isArray(data.stadiums)) {
        throw new Error('Invalid data format received from server.');
      }
  
      setStadiums(data.stadiums);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stadiums');
      setLoading(false);
      console.error('Fetch error:', err);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchStadiums();
    }
  }, [userLocation, fetchStadiums]);

  const allCities = [...new Set(stadiums.map(stadium => stadium.city))];
  const allStates = [...new Set(stadiums.map(stadium => stadium.state))];

  const toggleCity = (city: string) => {
    setFilters(prev => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter(c => c !== city)
        : [...prev.cities, city]
    }));
  };

  const toggleState = (state: string) => {
    setFilters(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state]
    }));
  };

  const resetFilters = () => {
    setFilters({
      cities: [],
      states: [],
      priceRange: null,
      minRating: 0
    });
  };

  const filteredStadiums = stadiums.filter(stadium => {
    if (filters.cities.length > 0 && !filters.cities.includes(stadium.city)) {
      return false;
    }
    if (filters.states.length > 0 && !filters.states.includes(stadium.state)) {
      return false;
    }
    return true;
  });

  const activeFilterCount = [
    filters.cities.length,
    filters.states.length,
    filters.priceRange ? 1 : 0,
    filters.minRating > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container mx-auto px-4 pt-20 pb-12 text-center">
          <p>Loading stadiums...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container mx-auto px-4 pt-20 pb-12 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchStadiums}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Premium Stadiums</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {filteredStadiums.length} {filteredStadiums.length === 1 ? 'stadium' : 'stadiums'} available
                {userLocation && <span className="ml-2 text-sm">(Nearby)</span>}
              </p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              <FiFilter />
              Filters {activeFilterCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    Reset all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">City</h3>
                    <div className="space-y-2">
                      {allCities.map(city => (
                        <label key={city} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.cities.includes(city)}
                            onChange={() => toggleCity(city)}
                            className="rounded text-blue-500 focus:ring-blue-500"
                          />
                          <span>{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">State</h3>
                    <div className="space-y-2">
                      {allStates.map(state => (
                        <label key={state} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.states.includes(state)}
                            onChange={() => toggleState(state)}
                            className="rounded text-blue-500 focus:ring-blue-500"
                          />
                          <span>{state}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredStadiums.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-medium mb-2">No stadiums match your filters</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={resetFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStadiums.map((stadium, index) => (
              <motion.div
                key={stadium.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <Link href={`/user/stadiums/${stadium.id}`}>
                  <div className="relative h-48 w-full">
                    {stadium.image_url ? (
                      <Image
                        src={stadium.image_url}
                        alt={stadium.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No image available</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h2 className="text-white font-bold text-xl drop-shadow-md">{stadium.name}</h2>
                      <p className="text-white/90 text-sm mt-1 line-clamp-1 drop-shadow-md">{stadium.description}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                      <FiMapPin className="mr-2 flex-shrink-0" />
                      <span className="truncate">{stadium.address}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                        <FiMapPin className="mr-2 flex-shrink-0" />
                        <span>{stadium.city}, {stadium.state}</span>
                      </div>
                      
                      <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
                        stadium.distance === 0 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                      }`}>
                        <FiClock className="mr-1.5 flex-shrink-0" />
                        {stadium.distance === 0 ? (
                          <span>You&apos;re here</span>
                        ) : stadium.distance ? (
                          <span>{stadium.distance.toFixed(1)} km</span>
                        ) : (
                          <span>Distance N/A</span>
                        )}
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all">
                      View Details <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}