'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiArrowDown } from 'react-icons/fi';

export default function Hero() {
  return (
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
          <FiArrowDown className="w-8 h-8 text-white" />
        </div>
      </motion.div>
    </section>
  );
}