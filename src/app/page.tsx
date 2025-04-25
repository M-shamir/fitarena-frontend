import Image from 'next/image'
import { Metadata } from 'next'
import Header from './components/user/Header'
import Footer from './components/user/Footer'
import { Suspense } from 'react'
import TrendingTrainers from './components/user/TrendingTrainers'
import { StadiumTabs } from './components/user/ClientComponents'

export const metadata: Metadata = {
  title: 'Home | Fitarena - Book Sports Facilities & Trainers',
  description: 'Book top-quality stadiums, find expert trainers, and host your perfect game with Fitarena',
}

// Static data for server components
const stadiums = [
  {
    id: 1,
    name: 'Elite Stadium 1',
    price: 25,
    location: 'Downtown',
    rating: 4.5,
    image: '/stadium1.jpg'
  },
  // Add more stadiums...
]

const trainers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    specialty: 'Basketball',
    rating: 4.8,
    image: '/trainer1.jpg',
    experience: 7
  },
  // Add more trainers...
]

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section - Server Rendered */}
      <section className="relative h-screen pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/hero-image.jpg"
            alt="Sports players"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Elevate Your <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Sports Experience</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Book premium facilities, connect with elite trainers, and organize unforgettable games with our seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="/booking" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-center">
                Explore Facilities
              </a>
              <a href="/about" className="bg-white/10 text-white font-bold py-4 px-8 rounded-lg border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all text-center">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-green-500 font-medium">EASY BOOKING</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Find Your Perfect Match</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Whether you're looking for a venue, a trainer, or organizing an event, we've got you covered.
            </p>
          </div>

          {/* Client-side tabs will be loaded here */}
          <Suspense fallback={<div>Loading booking options...</div>}>
            <StadiumTabs stadiums={stadiums} />
          </Suspense>
        </div>
      </section>

      {/* Popular Stadiums - Server Rendered */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <span className="text-green-500 font-medium">PREMIUM VENUES</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Popular Stadiums</h2>
            </div>
            <a href="/stadiums" className="text-green-600 dark:text-green-400 font-medium flex items-center hover:underline">
              View all
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stadiums.map((stadium) => (
              <div key={stadium.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all">
                <div className="h-56 relative overflow-hidden">
                  <Image
                    src={stadium.image}
                    alt={stadium.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{stadium.name}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    <span className="mr-2">📍 {stadium.location}</span>
                    <span className="flex items-center">
                      ⭐ {stadium.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">${stadium.price}/hr</span>
                    <a href={`/stadiums/${stadium.id}`} className="text-green-600 dark:text-green-400 hover:underline">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client-side interactive components */}
      <Suspense fallback={<div>Loading trainers...</div>}>
        <TrendingTrainers trainers={trainers} />
      </Suspense>

      <Footer />
    </>
  )
}