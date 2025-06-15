'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiMail, FiArrowRight } from 'react-icons/fi'
import AnimatedContainer from '../ui/AnimatedContainer'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate subscription
    setIsSubscribed(true)
    setEmail('')
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Join Our Community
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-green-100 mb-8 max-w-2xl mx-auto"
          >
            Subscribe to our newsletter for the latest sports facilities, special offers, and fitness tips.
          </motion.p>

          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl inline-block"
            >
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p>You&apos;ve been subscribed to our newsletter.</p>            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-full focus:outline-none text-gray-800"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-green-700 hover:bg-green-800 px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center whitespace-nowrap"
              >
                Subscribe <FiArrowRight className="ml-2" />
              </motion.button>
            </motion.form>
          )}
        </AnimatedContainer>
      </div>
    </section>
  )
}