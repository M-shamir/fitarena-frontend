'use client'
import { motion } from 'framer-motion'
import { FiArrowRight, FiStar, FiMapPin, FiClock } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'

const stadiums = [
  {
    id: 1,
    name: "Elite Stadium Downtown",
    price: "$25/hr",
    rating: 4.8,
    location: "Downtown",
    image: "https://source.unsplash.com/random/600x400?stadium=1",
    hours: "9:00 AM - 10:00 PM",
    features: ["Indoor", "Air Conditioned", "Locker Rooms"]
  },
  {
    id: 2,
    name: "Pro Arena Westside",
    price: "$35/hr",
    rating: 4.6,
    location: "Westside",
    image: "https://source.unsplash.com/random/600x400?stadium=2",
    hours: "7:00 AM - 9:00 PM",
    features: ["Olympic Standard", "Floodlights", "Parking"]
  },
  {
    id: 3,
    name: "Community Field Eastside",
    price: "$20/hr",
    rating: 4.9,
    location: "Eastside",
    image: "https://source.unsplash.com/random/600x400?stadium=3",
    hours: "8:00 AM - 11:00 PM",
    features: ["Outdoor", "Family Friendly", "Cafeteria"]
  }
]

export default function PopularStadiums() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="flex justify-between items-center mb-12">
          <div>
            <span className="text-green-500 font-medium">PREMIUM VENUES</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Popular Stadiums</h2>
          </div>
          <button className="text-green-600 dark:text-green-400 font-medium flex items-center hover:underline group">
            View all <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stadiums.map((stadium, index) => (
            <AnimatedContainer 
              key={stadium.id}
              delay={index * 0.1}
            >
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all h-full flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <Image
                    src={stadium.image}
                    alt={stadium.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{stadium.price}</span>
                      <div className="flex items-center text-yellow-400">
                        <FiStar className="mr-1" /> {stadium.rating}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{stadium.name}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <FiMapPin className="mr-2" /> {stadium.location}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <FiClock className="mr-2" /> {stadium.hours}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {stadium.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
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