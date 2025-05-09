'use client'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiClock, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'

const stadium = {
  id: 1,
  name: "Elite Stadium Downtown",
  price: "$25/hr",
  rating: 4.8,
  location: "123 Sports Ave, Downtown",
  images: [
    "https://plus.unsplash.com/premium_photo-1664304605904-d0aa3a50a5b7?q=80&w=1996&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1684446464405-71867f88356b?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1650327987377-90bf6c9789fd?w=500&auto=format&fit=crop"
  ],
  hours: "9:00 AM - 10:00 PM",
  sports: ["Soccer", "Basketball", "Volleyball"],
  capacity: "500 people",
  amenities: [
    "Locker rooms",
    "Showers",
    "Parking",
    "Cafeteria",
    "WiFi",
    "First aid"
  ],
  description: "Professional-grade sports facility with Olympic-standard equipment. Perfect for competitive games and training sessions. Our stadium features premium turf, modern lighting, and comfortable seating areas."
}

export default function StadiumDetailPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={function (mode: boolean): void {
        throw new Error('Function not implemented.')
      } } />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition"
        >
          ← Back to stadiums
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
              <Image src={stadium.images[0]} alt={stadium.name} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stadium.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                  <Image src={image} alt={`${stadium.name} ${index + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{stadium.name}</h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-500 mr-4">
                <FiStar className="mr-1" /> {stadium.rating}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <FiMapPin className="mr-1" /> {stadium.location}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8">{stadium.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: FiClock, label: "Operating Hours", value: stadium.hours },
                { icon: FiUsers, label: "Capacity", value: stadium.capacity },
                { icon: FiDollarSign, label: "Price", value: stadium.price, highlight: true },
                { icon: FiCalendar, label: "Available Sports", value: stadium.sports.join(", ") }
              ].map(({ icon: Icon, label, value, highlight }, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <Icon className="mr-2" /> {label}
                  </div>
                  <p className={`font-medium ${highlight ? "text-green-600 dark:text-green-400" : ""}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stadium.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => router.push(`/user/stadiums/${stadium.id}/booking`)}
  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
>
  Book Now
</motion.button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
