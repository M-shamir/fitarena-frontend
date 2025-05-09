'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiStar, FiMapPin, FiClock } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'
import TabSwitcher from '../ui/TabSwitcher'

const bookingTabs = ['stadiums', 'trainers', 'host']

const bookingItems = [
  {
    id: 1,
    title: 'Elite Stadium',
    description: 'Professional-grade facility with all amenities for your perfect game',
    price: '$25/hr',
    rating: 4.8,
    location: 'Downtown',
    image: 'https://source.unsplash.com/random/600x400?sports=1'
  },
  {
    id: 2,
    title: 'Pro Stadium',
    description: 'Premium venue with Olympic-standard equipment and facilities',
    price: '$35/hr',
    rating: 4.6,
    location: 'Westside',
    image: 'https://source.unsplash.com/random/600x400?sports=2'
  },
  {
    id: 3,
    title: 'Community Arena',
    description: 'Friendly neighborhood sports center perfect for casual games',
    price: '$45/hr',
    rating: 4.9,
    location: 'Eastside',
    image: 'https://source.unsplash.com/random/600x400?sports=3'
  }
]

export default function QuickBooking() {
  const [activeTab, setActiveTab] = useState(bookingTabs[0])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {bookingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: item.id * 0.1 }
              }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(item.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <AnimatePresence>
                  {hoveredCard === item.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 text-green-600 font-bold px-3 py-1 rounded-full text-xs shadow">
                  {item.price}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">
                    {activeTab === 'stadiums' ? item.title : 
                     activeTab === 'trainers' ? `Coach ${item.title}` : 
                     `${item.title} Event`}
                  </h3>
                  <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <FiStar className="mr-1" /> {item.rating}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-5">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FiMapPin className="mr-1" />
                    {item.location}
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
              
              <AnimatePresence>
                {hoveredCard === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
                  >
                    <div className="flex items-center text-white text-sm">
                      <FiClock className="mr-2" />
                      Available: {item.id === 1 ? '9AM-10PM' : item.id === 2 ? '7AM-9PM' : '8AM-11PM'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}