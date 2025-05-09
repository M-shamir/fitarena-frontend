'use client'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'

const trainers = [
  {
    id: 1,
    name: "John Doe",
    rating: 4.9,
    expertise: "Fitness & Strength Training",
    image: "https://media.istockphoto.com/id/2158236373/photo/man-with-clipboard-in-fitness-center.webp?s=2048x2048&w=is&k=20&c=oLsE2Aonh0HfV9IfU-fl8l0DOxbUEnNORN5_idYNBXo=",
    location: "Downtown",
    courses: ["Weight Training", "Endurance Boost", "Cardio Fitness"]
  },
  {
    id: 2,
    name: "Michael Johnson",
    rating: 4.8,
    expertise: "Sports Coaching",
    image: "https://media.istockphoto.com/id/2159296626/photo/fitness-instructor-assisting-athletic-woman-in-exercising-at-gym.webp?s=2048x2048&w=is&k=20&c=RdFVbFBH9e9mKKbJfwl5IC0QUW1HWeAi5ljGi_UWj8s=",
    location: "Eastside",
    courses: ["Soccer Coaching", "Basketball Drills", "Agility & Speed Training"]
  },
  {
    id: 3,
    name: "Emma Smith",
    rating: 4.7,
    expertise: "Yoga & Meditation",
    image: "https://media.istockphoto.com/id/2158236373/photo/man-with-clipboard-in-fitness-center.webp?s=2048x2048&w=is&k=20&c=oLsE2Aonh0HfV9IfU-fl8l0DOxbUEnNORN5_idYNBXo=",
    location: "Westside",
    courses: ["Beginner Yoga", "Mindfulness Meditation", "Flexibility Enhancement"]
  },
  
];

export default function TrainersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={function (mode: boolean): void {
              throw new Error('Function not implemented.')
          } } />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Expert Trainers</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">Find skilled trainers for your fitness and sports journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div key={trainer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
              <Link href={`/user/trainers/${trainer.id}`}>
                <div className="relative h-48 w-full">
                  <Image src={trainer.image} alt={trainer.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-white font-bold text-xl">{trainer.name}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="mr-1" /> {trainer.rating}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">{trainer.expertise}</span>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <FiMapPin className="mr-2" /> {trainer.location}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {trainer.courses.map((course) => (
                      <span key={course} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">{course}</span>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all">
                    View Courses <FiArrowRight className="ml-2" />
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
