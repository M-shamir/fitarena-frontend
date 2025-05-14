'use client'
import { FiVideo, FiClock, FiCheckCircle, FiX, FiStar } from 'react-icons/fi'
import { useState } from 'react'



const TrainerBookings = ({ bookings }) => {
  const [activeTab, setActiveTab] = useState('upcoming')

  const handleCancel = (bookingId) => {
    // Implement cancel logic
    console.log('Cancel booking:', bookingId)
  }

  const handleRate = (bookingId) => {
    // Implement rating logic
    console.log('Rate booking:', bookingId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trainer Bookings</h2>
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm rounded-md ${activeTab === 'upcoming' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-sm rounded-md ${activeTab === 'past' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
          >
            Past
          </button>
        </div>
      </div>

      {activeTab === 'upcoming' ? (
        <div className="space-y-4">
          {bookings.upcoming.length > 0 ? (
            bookings.upcoming.map(booking => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <FiVideo className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{booking.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">with {booking.trainer}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>{booking.date} • {booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FiClock className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No upcoming bookings</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any upcoming training sessions</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.past.length > 0 ? (
            bookings.past.map(booking => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{booking.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">with {booking.trainer}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>{booking.date} • {booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {!booking.rated && (
                      <button 
                        onClick={() => handleRate(booking.id)}
                        className="flex items-center space-x-1 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition"
                      >
                        <FiStar className="w-4 h-4" />
                        <span>Rate</span>
                      </button>
                    )}
                    <button className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FiCheckCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No past bookings</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You haven't completed any training sessions yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TrainerBookings