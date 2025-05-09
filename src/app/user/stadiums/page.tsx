'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'

const stadiums = [
  {
    id: 1,
    name: "Elite Stadium Downtown",
    price: "$25/hr",
    rating: 4.8,
    location: "Downtown",
    image: "https://plus.unsplash.com/premium_photo-1664304605904-d0aa3a50a5b7?q=80&w=1996&auto=format&fit=crop",
    hours: "9:00 AM - 10:00 PM",
    sports: ["Soccer", "Basketball", "Volleyball"]
  },
  {
    id: 2,
    name: "Pro Arena Westside",
    price: "$35/hr",
    rating: 4.6,
    location: "Westside",
    image: "https://plus.unsplash.com/premium_photo-1684446464405-71867f88356b?w=500&auto=format&fit=crop",
    hours: "7:00 AM - 9:00 PM",
    sports: ["Tennis", "Badminton", "Squash"]
  },
  {
    id: 3,
    name: "Community Field Eastside",
    price: "$20/hr",
    rating: 4.9,
    location: "Eastside",
    image: "https://images.unsplash.com/photo-1650327987377-90bf6c9789fd?w=500&auto=format&fit=crop",
    hours: "8:00 AM - 11:00 PM",
    sports: ["Football", "Rugby", "Athletics"]
  }
]

export default function StadiumsPage() {
  const [darkMode, setDarkMode] = useState(false);

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Premium Stadiums</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Book top-quality sports facilities for your next game or training session
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stadiums.map((stadium, index) => (
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
                  <Image
                    src={stadium.image}
                    alt={stadium.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-white font-bold text-xl">{stadium.name}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="mr-1" /> {stadium.rating}
                    </div>
                    <span className="font-bold text-green-600 dark:text-green-400">{stadium.price}</span>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <FiMapPin className="mr-2" /> {stadium.location}
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <FiClock className="mr-2" /> {stadium.hours}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {stadium.sports.map((sport) => (
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
      </div>
      <Footer />
    </div>
  )
}
