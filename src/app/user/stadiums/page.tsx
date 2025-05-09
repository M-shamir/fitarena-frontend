'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiMapPin, FiClock, FiArrowRight, FiFilter, FiX } from 'react-icons/fi'
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
  price?: number;
  rating?: number;
  hours?: string;
  sports?: string[];
  location?: string; // For compatibility with existing code
}

export default function StadiumsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [filters, setFilters] = useState({
    cities: [],
    states: [],
    priceRange: null,
    minRating: 0
  });

  useEffect(() => {
    // Try to get user location from localStorage
    const storedLocation = localStorage.getItem('userLocation');
  
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
  
        if (parsedLocation.lat && parsedLocation.lng) {
          setUserLocation(parsedLocation);
        } else {
          console.error('Invalid location format in localStorage.');
        }
      } catch (error) {
        console.error('Error parsing location:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (userLocation) {
      fetchStadiums();
    }
  }, [userLocation]);
  
  const fetchStadiums = async () => {
    try {
      if (!userLocation) {
        console.warn('User location not available, sending empty lat/lng.');
        return; // Stop the request if userLocation is unavailable
      }
  
      const endpoint = `/user/stadiums/nearby/?lat=${userLocation.lat}&lng=${userLocation.lng}`;
      console.log('API request:', endpoint);
  
      const response = await api.get(endpoint);
      const data = response.data;
  
      if (!data || !Array.isArray(data.stadiums)) {
        throw new Error('Invalid data format received from server.');
      }
  
      // Enhance stadium data with mock fields for demo
      const enhancedStadiums = data.stadiums.map((stadium: Stadium) => ({
        ...stadium,
        location: stadium.city,
        price: Math.floor(Math.random() * 30) + 10,
        rating: Number((Math.random() * 0.5 + 4.5).toFixed(1)),
        hours: "9:00 AM - 10:00 PM",
        sports: ["Soccer", "Basketball"]
      }));
  
      setStadiums(enhancedStadiums);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stadiums');
      setLoading(false);
      console.error('Fetch error:', err);
    }
  };

  // Extract all unique cities, states for filters
  const allCities = [...new Set(stadiums.map(stadium => stadium.city))];
  const allStates = [...new Set(stadiums.map(stadium => stadium.state))];
  const priceRanges = [
    { label: "Under $20", min: 0, max: 20 },
    { label: "$20 - $30", min: 20, max: 30 },
    { label: "$30 - $40", min: 30, max: 40 },
    { label: "Over $40", min: 40, max: Infinity }
  ];

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

  const setPriceRange = (range: any) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range
    }));
  };

  const setMinRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
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
    // City filter
    if (filters.cities.length > 0 && !filters.cities.includes(stadium.city)) {
      return false;
    }
    
    // State filter
    if (filters.states.length > 0 && !filters.states.includes(stadium.state)) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange && (stadium.price! < filters.priceRange.min || stadium.price! >= filters.priceRange.max)) {
      return false;
    }
    
    // Rating filter
    if (stadium.rating! < filters.minRating) {
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
                  {/* City Filter */}
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

                  {/* State Filter */}
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

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <button
                          key={range.label}
                          onClick={() => setPriceRange(range)}
                          className={`block w-full text-left px-3 py-2 rounded ${filters.priceRange?.label === range.label ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="font-medium mb-2">Minimum Rating</h3>
                    <div className="flex items-center gap-2">
                      {[4, 4.5, 4.8].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          className={`flex items-center px-3 py-2 rounded ${filters.minRating === rating ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                          <FiStar className="mr-1 text-yellow-500" />
                          {rating}+
                        </button>
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
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
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h2 className="text-white font-bold text-xl">{stadium.name}</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-yellow-500">
                        <FiStar className="mr-1" /> {stadium.rating}
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">${stadium.price}/hr</span>
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <FiMapPin className="mr-2" /> {stadium.city}, {stadium.state}
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <FiClock className="mr-2" /> {stadium.hours}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {stadium.sports?.map((sport) => (
                        <span 
                          key={sport}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
                        >
                          {sport}
                        </span>
                      ))}
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