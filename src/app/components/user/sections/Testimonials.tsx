'use client'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'

const testimonials = [
  {
    id: 1,
    name: "John D.",
    role: "Amateur Soccer Player",
    content: "Fitarena made booking a soccer field so easy! The process was seamless and the facilities were top-notch.",
    rating: 5,
    image: "https://source.unsplash.com/random/100x100?person=1"
  },
  {
    id: 2,
    name: "Sarah M.",
    role: "Fitness Enthusiast",
    content: "I found the perfect trainer for my fitness goals. The platform is user-friendly and the options are plentiful.",
    rating: 4,
    image: "https://source.unsplash.com/random/100x100?person=2"
  },
  {
    id: 3,
    name: "Alex T.",
    role: "Basketball Team Captain",
    content: "Hosting my basketball game was a breeze. All my friends could join easily and we had an amazing time.",
    rating: 5,
    image: "https://source.unsplash.com/random/100x100?person=3"
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedContainer className="text-center mb-16">
          <span className="text-green-500 font-medium">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What Our Users Say</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our community of sports enthusiasts.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedContainer 
              key={testimonial.id}
              delay={index * 0.1}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
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
                      className={`w-5 h-5 ${i < testimonial.rating ? 
                        'text-yellow-400 fill-yellow-400' : 
                        'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
                >
                  Read full story
                </motion.button>
              </motion.div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  ) 
}