'use client'
import React from "react";
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi'
import Image from 'next/image'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'

interface Course {
  id: number
  title: string
  description: string
  thumbnail: string | null
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  days_of_week: string[]
  max_participants: number
  current_participants: number
  price: number
  status: string
  trainer: {
    id: number
    name: string
    rating: number
    expertise: string
    image: string
    location: string
    bio: string
  }
}

// Dummy data for courses (based on trainer ID)
const getCoursesByTrainer = (trainerId: number): Course[] => {
  const dummyCourses: Course[] = [
    {
      id: 1,
      title: "Weight Training Basics",
      description: "Learn fundamental weight training techniques to build strength and muscle.",
      thumbnail: "https://media.istockphoto.com/id/2159296626/photo/fitness-instructor-assisting-athletic-woman-in-exercising-at-gym.webp?s=2048x2048&w=is&k=20&c=RdFVbFBH9e9mKKbJfwl5IC0QUW1HWeAi5ljGi_UWj8s=",
      start_date: "2025-06-01",
      end_date: "2025-08-01",
      start_time: "18:00",
      end_time: "19:30",
      days_of_week: ["Monday", "Wednesday", "Friday"],
      max_participants: 15,
      current_participants: 8,
      price: 99.99,
      status: "Open",
      trainer: {
        id: 1,
        name: "John Doe",
        rating: 4.9,
        expertise: "Fitness & Strength Training",
        image: "https://media.istockphoto.com/id/2158236373/photo/man-with-clipboard-in-fitness-center.webp?s=2048x2048&w=is&k=20&c=oLsE2Aonh0HfV9IfU-fl8l0DOxbUEnNORN5_idYNBXo=",
        location: "Downtown",
        bio: "Experienced fitness trainer with 10+ years in strength training."
      }
    },
    {
      id: 2,
      title: "Endurance Boost Program",
      description: "Improve your stamina and endurance with targeted workouts.",
      thumbnail: "https://media.istockphoto.com/id/2159296626/photo/fitness-instructor-assisting-athletic-woman-in-exercising-at-gym.webp?s=2048x2048&w=is&k=20&c=RdFVbFBH9e9mKKbJfwl5IC0QUW1HWeAi5ljGi_UWj8s=",
      start_date: "2025-07-01",
      end_date: "2025-09-01",
      start_time: "17:00",
      end_time: "18:30",
      days_of_week: ["Tuesday", "Thursday"],
      max_participants: 12,
      current_participants: 5,
      price: 79.99,
      status: "Open",
      trainer: {
        id: 2,
        name: "John Doe",
        rating: 4.9,
        expertise: "Fitness & Strength Training",
        image: "https://media.istockphoto.com/id/2158236373/photo/man-with-clipboard-in-fitness-center.webp?s=2048x2048&w=is&k=20&c=oLsE2Aonh0HfV9IfU-fl8l0DOxbUEnNORN5_idYNBXo=",
        location: "Downtown",
        bio: "Experienced fitness trainer with 10+ years in strength training."
      }
    },
  ]
  return dummyCourses.filter(course => course.trainer.id === trainerId)
}

export default function TrainerCoursesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params) // Unwrap the promise
  const trainerId = parseInt(id)
  const courses = getCoursesByTrainer(trainerId)
  const trainer = courses[0]?.trainer
  function handleEnroll(courseId: number) {
    console.log(`Enrolling in course ${courseId}`)
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="container mx-auto px-4 pt-20 pb-12">
          <p className="text-gray-600 dark:text-gray-300">Trainer not found.</p>
        </div>
        <Footer />
      </div>
    )
  }

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{trainer.name}'s Courses</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500 mr-4">
              <FiStar className="mr-1" /> {trainer.rating}
            </div>
            <span className="text-gray-600 dark:text-gray-300">{trainer.expertise}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
            <FiMapPin className="mr-2" /> {trainer.location}
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">{trainer.bio}</p>
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
                  src={course.thumbnail || trainer.image}
                  alt={course.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-white font-bold text-xl">{course.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{course.description}</p>
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  <p><strong>Dates:</strong> {course.start_date} to {course.end_date}</p>
                  <p><strong>Time:</strong> {course.start_time} - {course.end_time}</p>
                  <p><strong>Days:</strong> {course.days_of_week.join(", ")}</p>
                  <p><strong>Participants:</strong> {course.current_participants}/{course.max_participants}</p>
                  <p><strong>Price:</strong> ${course.price.toFixed(2)}</p>
                  <p><strong>Status:</strong> {course.status}</p>
                </div>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-all"
                  disabled={course.status !== "Open" || course.current_participants >= course.max_participants}
                >
                  {course.status === "Open" && course.current_participants < course.max_participants
                    ? "Enroll Now"
                    : "Course Full"}
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