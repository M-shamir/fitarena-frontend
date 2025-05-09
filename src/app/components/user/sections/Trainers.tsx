'use client'
import { motion } from 'framer-motion'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'

const trainers = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Basketball",
    rating: 4.8,
    experience: 7,
    price: "$60/hr",
    image: "https://source.unsplash.com/random/300x300?trainer=1"
  },
  {
    id: 2,
    name: "Michael Chen",
    specialty: "Soccer",
    rating: 4.9,
    experience: 9,
    price: "$75/hr",
    image: "https://source.unsplash.com/random/300x300?trainer=2"
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    specialty: "Tennis",
    rating: 4.7,
    experience: 6,
    price: "$55/hr",
    image: "https://source.unsplash.com/random/300x300?trainer=3"
  },
  {
    id: 4,
    name: "Jamie Wilson",
    specialty: "Fitness",
    rating: 4.9,
    experience: 8,
    price: "$65/hr",
    image: "https://source.unsplash.com/random/300x300?trainer=4"
  }
]

export default function Trainers() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-16">
          <span className="text-green-500 font-medium">PROFESSIONAL TRAINERS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Meet Our Experts</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Certified professionals ready to help you achieve your fitness and sports goals.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, index) => (
            <AnimatedContainer 
              key={trainer.id}
              delay={index * 0.1}
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all text-center p-6 group"
              >
                <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden border-4 border-green-100 dark:border-green-900/50 mb-6">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
                <p className="text-green-500 font-medium mb-3">{trainer.specialty} Coach</p>
                
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(trainer.rating) ? 
                        'text-yellow-400 fill-yellow-400' : 
                        'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {trainer.experience}+ years
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {trainer.price}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-4 rounded-full transition-all"
                >
                  View Profile
                </motion.button>
              </motion.div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  )
}