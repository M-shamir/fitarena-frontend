import { FiClock, FiCheckCircle, FiX, FiCalendar, FiLoader } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import api from '@/utils/api'
import { toast } from 'react-toastify'
import Image from 'next/image';

interface Booking {
  id: number
  date: string
  start_time: string
  end_time: string
  price: string
  status: 'booked' | 'cancelled' | 'completed'
  stadium: number
  stadium_name: string
  stadium_image: string
  slotbooking_id: number
  cancelled_at?: string | null
}

interface TodaySlotsResponse {
  ongoing: Booking | null
  upcoming: Booking | null
}

type BookingTab = 'today' | 'upcoming' | 'past'

const StadiumBooking = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>('today')
  const [todaySlots, setTodaySlots] = useState<TodaySlotsResponse>({ ongoing: null, upcoming: null })
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState({
    today: true,
    upcoming: true,
    past: true
  })
  const [error, setError] = useState({
    today: null as string | null,
    upcoming: null as string | null,
    past: null as string | null
  })
  const [cancellingBooking, setCancellingBooking] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'today') {
          setLoading(prev => ({ ...prev, today: true }))
          const response = await api.get('/user/current-next/')
          setTodaySlots(response.data)
          setError(prev => ({ ...prev, today: null }))
        } else if (activeTab === 'upcoming') {
          setLoading(prev => ({ ...prev, upcoming: true }))
          const response = await api.get('/user/upcoming-slots/')
          setUpcomingBookings(Array.isArray(response.data) ? response.data : [])
          setError(prev => ({ ...prev, upcoming: null }))
        } else if (activeTab === 'past') {
          setLoading(prev => ({ ...prev, past: true }))
          const response = await api.get('/user/slots/past/')
          setPastBookings(Array.isArray(response.data) ? response.data : [])
          setError(prev => ({ ...prev, past: null }))
        }
      } catch (err) {
        const errorMessage = `Failed to fetch ${activeTab} bookings`
        setError(prev => ({ ...prev, [activeTab]: errorMessage }))
        console.error(errorMessage, err)
      } finally {
        setLoading(prev => ({ ...prev, [activeTab]: false }))
      }
    }

    fetchData()
  }, [activeTab])

  const handleCancelBooking = async (slotbookingId: number) => {
    // Show confirmation dialog
    const confirmCancel = await new Promise((resolve) => {
      toast(
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg max-w-md mx-auto">
          <div className="text-sm font-medium text-white mb-3">
            Are you sure you want to cancel this booking?
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                toast.dismiss();
                resolve(false);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600"
            >
              No
            </button>
            <button
              onClick={() => {
                toast.dismiss();
                resolve(true);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 border border-red-500 hover:bg-red-700 transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
          className: '!bg-transparent !shadow-none !p-0',
        }
      );
    });
  
    if (!confirmCancel) return;
  
    setCancellingBooking(slotbookingId);
    try {
      await api.post(`/user/bookings/${slotbookingId}/cancel/`);
      
      // Update the relevant booking list based on active tab
      if (activeTab === 'today') {
        setTodaySlots(prev => {
          const updated = {...prev};
          if (updated.ongoing?.slotbooking_id === slotbookingId) {
            updated.ongoing.status = 'cancelled';
            updated.ongoing.cancelled_at = new Date().toISOString();
          }
          if (updated.upcoming?.slotbooking_id === slotbookingId) {
            updated.upcoming.status = 'cancelled';
            updated.upcoming.cancelled_at = new Date().toISOString();
          }
          return updated;
        });
      } else if (activeTab === 'upcoming') {
        setUpcomingBookings(prev => 
          prev.map(booking => 
            booking.slotbooking_id === slotbookingId 
              ? { 
                  ...booking, 
                  status: 'cancelled',
                  cancelled_at: new Date().toISOString()
                } 
              : booking
          )
        );
      }
      
      toast.success('Booking cancelled successfully. Refund processed.');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error(error.response?.data?.detail || 'Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBooking(null);
    }
  };
  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const canCancelBooking = (bookingDate: string, status: string) => {
    const bookingDateTime = new Date(`${bookingDate}T${status === 'booked' ? '23:59:59' : '00:00:00'}`)
    const currentDateTime = new Date()
    return status === 'booked' && bookingDateTime >= currentDateTime
  }

  const renderBookingStatus = (status: string) => {
    switch (status) {
      case 'booked':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">Confirmed</span>
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">Completed</span>
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">Cancelled</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{status}</span>
    }
  }

  const renderBookingCard = (booking: Booking, type?: 'ongoing' | 'upcoming', showCancelButton = false) => (
    <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Image
            width={200}
            height={200}
              src={booking.stadium_image || 'https://via.placeholder.com/64'} 
              alt={booking.stadium_name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64'
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="truncate">
                <h3 className="font-medium text-gray-800 dark:text-white truncate">
                  {booking.stadium_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Booking #{booking.id}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {type && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    type === 'ongoing' 
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {type === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                  </span>
                )}
                {renderBookingStatus(booking.status)}
              </div>
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
          <div className="flex space-x-2">
            {showCancelButton && canCancelBooking(booking.date, booking.status) && (
             <button 
             onClick={() => handleCancelBooking(booking.slotbooking_id)}
             disabled={cancellingBooking === booking.slotbooking_id}
             className="px-3 py-1.5 text-sm border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50 flex items-center"
           >
             {cancellingBooking === booking.slotbooking_id ? (
               <>
                 <FiLoader className="animate-spin mr-1" />
                 Cancelling...
               </>
             ) : 'Cancel'}
           </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTodayTab = () => {
    if (loading.today) {
      return renderLoadingState()
    }

    if (error.today) {
      return renderErrorState('today')
    }

    if (!todaySlots.ongoing && !todaySlots.upcoming) {
      return renderEmptyState('today')
    }

    return (
      <div className="grid gap-4">
        {todaySlots.ongoing && renderBookingCard(todaySlots.ongoing, 'ongoing', false)}
        {todaySlots.upcoming && renderBookingCard(todaySlots.upcoming, 'upcoming', false)}
      </div>
    )
  }

  const renderUpcomingTab = () => {
    if (loading.upcoming) {
      return renderLoadingState()
    }

    if (error.upcoming) {
      return renderErrorState('upcoming')
    }

    if (upcomingBookings.length === 0) {
      return renderEmptyState('upcoming')
    }

    return (
      <div className="grid gap-4">
        {upcomingBookings.map(booking => renderBookingCard(booking, undefined, true))}
      </div>
    )
  }

  const renderPastTab = () => {
    if (loading.past) {
      return renderLoadingState()
    }

    if (error.past) {
      return renderErrorState('past')
    }

    if (pastBookings.length === 0) {
      return renderEmptyState('past')
    }

    return (
      <div className="grid gap-4">
        {pastBookings.map(booking => renderBookingCard(booking, undefined, false))}
      </div>
    )
  }

  const renderEmptyState = (tab: BookingTab) => {
    const emptyStates = {
      today: {
        icon: <FiClock className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />,
        title: "No bookings today",
        message: "You don't have any stadium bookings scheduled for today"
      },
      upcoming: {
        icon: <FiCalendar className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />,
        title: "No upcoming bookings",
        message: "You don't have any upcoming stadium bookings"
      },
      past: {
        icon: <FiCheckCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />,
        title: "No past bookings",
        message: "You don't have any completed or cancelled stadium bookings"
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        {emptyStates[tab].icon}
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{emptyStates[tab].title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{emptyStates[tab].message}</p>
      </div>
    )
  }

  const renderErrorState = (tab: BookingTab) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <FiX className="w-10 h-10 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading bookings</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{error[tab]}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
      >
        Try Again
      </button>
    </div>
  )

  const renderLoadingState = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Stadium Bookings</h2>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {(['today', 'upcoming', 'past'] as BookingTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-md capitalize ${
                activeTab === tab 
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white font-medium' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'today' && renderTodayTab()}
        {activeTab === 'upcoming' && renderUpcomingTab()}
        {activeTab === 'past' && renderPastTab()}
      </div>
    </div>
  )
}

export default StadiumBooking