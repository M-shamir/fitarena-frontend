'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiStar, FiCheck, FiMail, FiMapPin,  FiClock } from 'react-icons/fi';

export default function Home() {
  const [activeTab, setActiveTab] = useState('stadiums');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with:', email);
    setEmail('');
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Head>
          <title>Fitarena | Premium Sports Booking Platform</title>
          <meta name="description" content="Book stadiums, hire trainers, and host games with Fitarena" />
        </Head>

        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Fitarena</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex space-x-8"
              >
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Home</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Stadiums</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Trainers</a>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Host</a>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Sign In
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Home</a>
                  <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Stadiums</a>
                  <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Trainers</a>
                  <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition">Host</a>
                  <div className="flex items-center space-x-4 pt-2">
                    <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {darkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </button>
                    <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                      Sign In
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen pt-24">
          <div className="absolute inset-0 overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Sports players"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Elevate Your <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Sports Experience</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Book premium facilities, connect with elite trainers, and organize unforgettable games with our seamless platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Explore Facilities
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 text-white font-bold py-4 px-8 rounded-lg border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </section>

        {/* Quick Booking Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-green-500 font-medium">EASY BOOKING</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Find Your Perfect Match</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Whether you are looking for a venue, a trainer, or organizing an event, we have got you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center mb-12"
            >
              <div className="inline-flex rounded-full shadow-md bg-gray-100 dark:bg-gray-800 p-1">
                {['stadiums', 'trainers', 'host'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium rounded-full transition-all ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[1, 2, 3].map((item) => (
                <motion.div 
                  key={item}
                  variants={item}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
                >
                  <div className="h-64 relative overflow-hidden">
                    <Image
                      src={`https://source.unsplash.com/random/600x400?sports=${item}`}
                      alt="Sports facility"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 text-green-600 font-bold px-3 py-1 rounded-full text-xs shadow">
                      ${item === 1 ? '25' : item === 2 ? '35' : '45'}/hr
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">
                        {activeTab === 'stadiums' ? 'Elite Stadium' : activeTab === 'trainers' ? 'Pro Trainer' : 'Game Event'} {item}
                      </h3>
                      <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <FiStar className="mr-1" /> 4.{item}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-5">
                      {activeTab === 'stadiums' 
                        ? 'Professional-grade facility with all amenities for your perfect game' 
                        : activeTab === 'trainers' 
                        ? 'Certified trainer with 5+ years experience in sports training' 
                        : 'Organize your perfect game with our easy-to-use platform'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiMapPin className="mr-1" />
                        {item === 1 ? 'Downtown' : item === 2 ? 'Westside' : 'Eastside'}
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
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Popular Stadiums Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-between items-center mb-12"
            >
              <div>
                <span className="text-green-500 font-medium">PREMIUM VENUES</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Popular Stadiums</h2>
              </div>
              <button className="text-green-600 dark:text-green-400 font-medium flex items-center hover:underline">
                View all <FiArrowRight className="ml-2" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div 
                  key={item}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all"
                >
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src={`https://source.unsplash.com/random/600x400?stadium=${item}`}
                      alt="Stadium"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">Elite Stadium {item}</h3>
                      <div className="flex items-center text-sm text-yellow-500">
                        <FiStar className="mr-1" /> 4.{item}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <FiMapPin className="mr-2" /> {item === 1 ? 'Downtown' : item === 2 ? 'Westside' : 'Eastside'}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="mr-2" /> {item * 2}:00 AM - {item * 2 + 8}:00 PM
                      </div>
                      <span className="text-lg font-bold">${item * 15}/hr</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trending Trainers Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-green-500 font-medium">PROFESSIONAL TRAINERS</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Meet Our Experts</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Certified professionals ready to help you achieve your fitness and sports goals.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { name: 'Sarah Johnson', specialty: 'Basketball', rating: 4.8, experience: 7 },
                { name: 'Michael Chen', specialty: 'Soccer', rating: 4.9, experience: 9 },
                { name: 'Alex Rodriguez', specialty: 'Tennis', rating: 4.7, experience: 6 },
                { name: 'Jamie Wilson', specialty: 'Fitness', rating: 4.9, experience: 8 }
              ].map((trainer, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all text-center p-6 group"
                >
                  <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden border-4 border-green-100 dark:border-green-900/50 mb-6">
                    <Image
                      src={`https://source.unsplash.com/random/300x300?trainer=${index}`}
                      alt={trainer.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
                  <p className="text-green-500 font-medium mb-3">{trainer.specialty} Coach</p>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(trainer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{trainer.experience}+ years experience</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-6 rounded-full shadow hover:shadow-md transition-all"
                  >
                    View Profile
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Host Your Game Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="People playing sports"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>
                </div>
                <div className="p-8 md:w-1/2 text-white">
                  <h2 className="text-3xl font-bold mb-4">Host Your Perfect Game</h2>
                  <p className="text-green-100 mb-8">
                    Organize your ideal sports event with our easy-to-use platform. Invite friends, set rules, and find the perfect venue all in one place.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                        <FiCheck className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-white">Choose date, time, and sport</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                        <FiCheck className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-white">Select from top-rated venues</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                        <FiCheck className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-white">Invite players and manage teams</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      Create Game
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 text-white font-bold py-3 px-6 rounded-lg border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-green-500 font-medium">TESTIMONIALS</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What Our Users Say</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don t just take our word for it - hear from our community of sports enthusiasts.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "John D.",
                  role: "Amateur Soccer Player",
                  content: "Fitarena made booking a soccer field so easy! The process was seamless and the facilities were top-notch.",
                  rating: 5
                },
                {
                  name: "Sarah M.",
                  role: "Fitness Enthusiast",
                  content: "I found the perfect trainer for my fitness goals. The platform is user-friendly and the options are plentiful.",
                  rating: 4
                },
                {
                  name: "Alex T.",
                  role: "Basketball Team Captain",
                  content: "Hosting my basketball game was a breeze. All my friends could join easily and we had an amazing time.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                      <Image
                        src={`https://source.unsplash.com/random/100x100?person=${index}`}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {testimonial.content}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest sports facilities, special offers, and fitness tips.
              </p>
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-md mx-auto flex shadow-xl rounded-full overflow-hidden"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-6 py-4 focus:outline-none text-gray-800"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 px-6 py-4 font-medium transition-all flex items-center"
                >
                  <FiMail className="mr-2" /> Subscribe
                </motion.button>
              </motion.form>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">Fitarena</h3>
                <p className="text-gray-400 mb-6">
                  Your premium platform for sports bookings, trainers, and game hosting.
                </p>
                <div className="flex space-x-4">
                  {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                    <a 
                      key={social} 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition"
                    >
                      <span className="sr-only">{social}</span>
                    </a>
                  ))}
                </div>
              </motion.div>

              {[
                {
                  title: "Quick Links",
                  links: ["Home", "Stadiums", "Trainers", "Host Game", "Pricing"]
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Blog", "Press", "Contact"]
                },
                {
                  title: "Legal",
                  links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
                }
              ].map((column, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-bold text-lg mb-4">{column.title}</h4>
                  <ul className="space-y-3">
                    {column.links.map((link, i) => (
                      <li key={i}>
                        <a 
                          href="#" 
                          className="text-gray-400 hover:text-green-400 transition"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
            >
              <p>© {new Date().getFullYear()} Fitarena. All rights reserved.</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}