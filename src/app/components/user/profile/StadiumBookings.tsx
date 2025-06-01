import { FiClock, FiCheckCircle, FiX, FiCalendar, FiMapPin } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import api from '@/utils/api'
import { toast } from 'react-toastify'

interface UpcomingBooking {
  id: number
  date: string
  start_time: string
  end_time: string
  price: string
  status: 'booked' | 'cancelled'
  booking_id: number
  booking_date: string
  booked_at: string
  stadium_name: string
  stadium_image: string
  can_cancel?: boolean
}

interface PastBooking {
  id: number
  date: string
  start_time: string
  end_time: string
  price: string
  status: 'completed' | 'cancelled'
  booking_id: number
  booking_date: string
  booked_at: string
  cancelled_at?: string | null
  stadium_name: string
  stadium_image: string
}

const StadiumBooking = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([])
  const [pastBookings, setPastBookings] = useState<PastBooking[]>([])
  const [loading, setLoading] = useState({
    upcoming: true,
    past: true
  })
  const [error, setError] = useState({
    upcoming: null as string | null,
    past: null as string | null
  })
  const [cancellingBooking, setCancellingBooking] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'upcoming') {
        try {
          setLoading(prev => ({ ...prev, upcoming: true }))
          const response = await api.get('/user/upcoming-slots/')
          const bookingsWithCancelFlag = response.data.map((booking: UpcomingBooking) => ({
            ...booking,
            can_cancel: new Date(booking.date) > new Date() // Can cancel if booking is in future
          }))
          setUpcomingBookings(bookingsWithCancelFlag)
          setError(prev => ({ ...prev, upcoming: null }))
        } catch (err) {
          setError(prev => ({ ...prev, upcoming: 'Failed to fetch upcoming bookings' }))
          console.error('Error fetching upcoming bookings:', err)
        } finally {
          setLoading(prev => ({ ...prev, upcoming: false }))
        }
      } else if (activeTab === 'past') {
        try {
          setLoading(prev => ({ ...prev, past: true }))
          const response = await api.get('/user/stadium-bookings/past/')
          setPastBookings(response.data)
          setError(prev => ({ ...prev, past: null }))
        } catch (err) {
          setError(prev => ({ ...prev, past: 'Failed to fetch past bookings' }))
          console.error('Error fetching past bookings:', err)
        } finally {
          setLoading(prev => ({ ...prev, past: false }))
        }
      }
    }

    fetchData()
  }, [activeTab])

  const handleCancelBooking = async (bookingId: number) => {
    setCancellingBooking(bookingId)
    try {
      await api.delete(`/user/stadium-bookings/${bookingId}/cancel/`)
      setUpcomingBookings(prev => 
        prev.filter(booking => booking.id !== bookingId)
      )
      toast.success('Booking cancelled successfully')
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      toast.error('Failed to cancel booking. Please try again.')
    } finally {
      setCancellingBooking(null)
    }
  }

  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Stadium Bookings</h2>
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'upcoming' 
                ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'past' 
                ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {activeTab === 'upcoming' ? (
  <div className="space-y-4">
    {loading.upcoming ? (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    ) : error.upcoming ? (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-red-500 dark:text-red-400 mb-4">
          <FiX className="w-10 h-10 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading bookings</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{error.upcoming}</p>
      </div>
    ) : upcomingBookings.length > 0 ? (
      upcomingBookings.map(booking => (
        <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                {booking.stadium_image && (
                  <img 
                    src={booking.stadium_image} 
                    alt={booking.stadium_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{booking.stadium_name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Booking #{booking.booking_id}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      <span>Date: {formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <FiClock className="w-4 h-4 mr-1" />
                      <span>Time: {formatTimeRange(booking.start_time, booking.end_time)}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <span>Booked on: {formatDate(booking.booked_at)}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <span>Price: ₹{booking.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {booking.can_cancel && (
                <button 
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={cancellingBooking === booking.id}
                  className="px-4 py-2 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                >
                  {cancellingBooking === booking.id ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
              
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <FiClock className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No upcoming bookings</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any upcoming stadium bookings</p>
      </div>
    )}
  </div>
) : (
        <div className="space-y-4">
          {loading.past ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : error.past ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <FiX className="w-10 h-10 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading bookings</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{error.past}</p>
            </div>
          ) : pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start space-x-4">
                    {booking.stadium_image && (
                      <div className="flex-shrink-0">
                        <img 
                          src={booking.stadium_image} 
                          alt={booking.stadium_name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {booking.stadium_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Booking #{booking.booking_id}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}>
                          {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>Date: {formatDate(booking.date)}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FiClock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>Time: {formatTimeRange(booking.start_time, booking.end_time)}</span>
                        </div>

                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <span>Booked on: {formatDate(booking.booked_at)}</span>
                        </div>

                        {booking.status === 'cancelled' && booking.cancelled_at && (
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <FiX className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Cancelled on: {formatDate(booking.cancelled_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-700/20">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Amount:</span> ₹{booking.price}
                    </div>
                    <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
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
              <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any completed or cancelled stadium bookings</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StadiumBooking