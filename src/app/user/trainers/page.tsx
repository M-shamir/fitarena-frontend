'use client'
import { motion } from 'framer-motion'
import { FiStar, FiArrowRight } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import api from '@/utils/api'
import { useEffect, useState } from 'react'

interface TrainerType {
  id: number
  name: string
}

interface Language {
  id: number
  name: string
}

interface Trainer {
  id: number
  user: {
    username: string
    email: string
  }
  phone_number: string
  gender: string
  trainer_type: TrainerType[]
  certifications: string | null
  languages_spoken: Language[]
  training_photo: string
  listed: boolean
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get('/user/trainers/available/')
        setTrainers(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching trainers:', error)
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12 text-center">
          <p>Loading trainers...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={() => {}} />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Expert Trainers</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">Find skilled trainers for your fitness and sports journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-center text-gray-600 dark:text-gray-300">No trainers available at the moment.</p>
            </motion.div>
          ) : (
            trainers.map((trainer, index) => (
              <motion.div 
                key={trainer.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: index * 0.1 }} 
                whileHover={{ y: -5 }} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <Link href={`/user/trainers/${trainer.id}`} className="flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={trainer.training_photo || '/default-trainer.jpg'} 
                      alt={trainer.user.username} 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-500" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h2 className="text-white font-bold text-xl mb-2">{trainer.user.username}</h2>
                      <div className="flex flex-wrap gap-2">
                        {trainer.trainer_type.map(type => (
                          <span key={type.id} className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                            {type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    {trainer.languages_spoken.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          <span className="text-sm">Languages Spoken</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {trainer.languages_spoken.map((language) => (
                            <span 
                              key={language.id} 
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full"
                            >
                              {language.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-yellow-500">
                          <FiStar className="mr-1" />
                          <span>4.5</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(24 reviews)</span>
                        </div>
                      </div>
                      
                      <button className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all">
                        View Profile <FiArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}