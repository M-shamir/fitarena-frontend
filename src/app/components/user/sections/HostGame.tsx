'use client'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'

const features = [
  "Choose date, time, and sport",
  "Select from top-rated venues",
  "Invite players and manage teams",
  "Set custom rules and requirements",
  "Real-time game updates"
]

export default function HostGame() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="People playing sports"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent"></div>
            </div>
            
            <div className="p-8 md:w-1/2 text-white">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                Host Your Perfect Game
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-green-100 mb-8"
              >
                Organize your ideal sports event with our easy-to-use platform. Invite friends, set rules, and find the perfect venue all in one place.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                viewport={{ once: true }}
                className="space-y-4 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                      <FiCheck className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-white">{feature}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
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
              </motion.div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  )
}