'use client'

import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import Image from 'next/image'
import AnimatedContainer from '../ui/AnimatedContainer'
import { useEffect, useState } from 'react'
import api from '@/utils/api'
import Link from 'next/link'

interface TrainerType {
  id: number
  name: string
}

interface Language {
  id: number
  name: string
}

interface User {
  username: string
  email: string
}

interface Trainer {
  id: number
  user: User
  phone_number: string
  gender: string
  trainer_type: TrainerType[]
  certifications: string
  languages_spoken: Language[]
  training_photo: string
  listed: boolean
}

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get('/user/trainers/available/')
        setTrainers(response.data)
      } catch (err) {
        setError('Failed to fetch trainers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p>Loading trainers...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    )
  }

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
                    src={trainer.training_photo}
                    alt={trainer.user.username}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{trainer.user.username}</h3>
                <p className="text-green-500 font-medium mb-3">
                  {trainer.trainer_type.map(type => type.name).join(' & ')}
                </p>
                
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-5 h-5 ${i < 4 ? 
                        'text-yellow-400 fill-yellow-400' : 
                        'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Speaks: {trainer.languages_spoken.map(lang => lang.name).join(', ')}
                  </span>
                </div>
                
                <Link href={`/user/trainers/${trainer.id}`} passHref>
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
</Link>
              </motion.div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  )
}