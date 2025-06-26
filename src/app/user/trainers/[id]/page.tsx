'use client'
import React, { useEffect, useState } from "react";
import { use } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi'
import Image from 'next/image'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'
import api from '@/utils/api'
import { useRouter} from 'next/navigation'

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

interface Course {
  id: number
  title: string
  description: string
  trainer: Trainer
  trainer_type: TrainerType
  thumbnail: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  days_of_week: string[]
  max_participants: number
  price: string
  status: string
  approval_status: string
  approval_note: string
  duration_minutes: number
  created_at: string
  available_slots: number
  current_enrollments: number
}

export default function TrainerCoursesPage({ params }: { params: { id: string } }) {
  const unwrappedParams = use(params) as { id: string }
  const trainerId = unwrappedParams.id
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/user/trainers/${trainerId}/courses/`)
        setCourses(response.data)
        setLoading(false)
      } catch (err) {
        console.log(err);
        
        setError("Failed to fetch courses")
        setLoading(false)
      }
    }

    fetchCourses()
  }, [trainerId])

  function handleEnroll(courseId: number) {
    router.push(`/user/bookings/courses/${courseId}/checkout`)
    console.log(`Enrolling in course ${courseId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <p className="text-gray-600 dark:text-gray-300">No courses found for this trainer.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const trainer = courses[0].trainer

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={() => {}} />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
<h1 className="text-3xl md:text-4xl font-bold mb-4">{trainer.user.username}&apos;s Courses</h1>
<div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500 mr-4">
              <FiStar className="mr-1" /> 4.9
            </div>
            <div className="flex flex-wrap gap-2">
              {trainer.trainer_type.map(type => (
                <span key={type.id} className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 text-sm rounded-full">
                  {type.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
            <FiMapPin className="mr-2" /> Location not specified
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Speaks {trainer.languages_spoken.map(lang => lang.name).join(", ")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                
                  src={course.thumbnail}
                  alt={course.title}
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-white font-bold text-xl">{course.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Dates</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{course.start_date} to {course.end_date}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Time</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{course.start_time} - {course.end_time}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Days</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{course.days_of_week.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Participants</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {course.current_enrollments} enrolled • {course.available_slots} slots available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Price</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">₹{course.price}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEnroll(course.id)}
                  className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all"
                  disabled={course.status !== "approved" || course.available_slots <= 0}
                >
                  {course.status !== "approved" ? "Not Available" : 
                   course.available_slots <= 0 ? "Fully Booked" : "Enroll Now"}
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}