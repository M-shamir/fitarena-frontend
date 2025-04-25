'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiStar, FiCheck, FiMail, FiMapPin, FiClock } from 'react-icons/fi'

export const StadiumTabs = ({ stadiums }: { stadiums: any[] }) => {
  const [activeTab, setActiveTab] = useState('stadiums')
  
  return (
    <div className="flex justify-center mb-12">
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
    </div>
  )
}

export const TrendingTrainers = ({ trainers }: { trainers: Trainer[] }) => {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-500 font-medium">PROFESSIONAL TRAINERS</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Meet Our Experts</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Certified professionals ready to help you achieve your fitness and sports goals.
            </p>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer) => (
              <motion.div 
                key={trainer.id}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all text-center p-6"
              >
                <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden border-4 border-green-100 dark:border-green-900/50 mb-6">
                  <Image
                    src={trainer.image || '/default-trainer.jpg'}
                    alt={`${trainer.name} - ${trainer.specialty} Coach`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                {trainer.experience && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {trainer.experience}+ years experience
                  </p>
                )}
                <a 
                  href={`/trainers/${trainer.id}`}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-6 rounded-full shadow hover:shadow-md transition-all inline-block"
                >
                  View Profile
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }
