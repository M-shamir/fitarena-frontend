'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/user/layout/Header'
import { FiUser, FiCalendar, FiVideo, FiLogOut } from 'react-icons/fi'
import ProfileSection from '@/app/components/user/profile/ProfileSection'
import TrainerBookings from '@/app/components/user/profile/TrainerBookings'
import StadiumBookings from '@/app/components/user/profile/StadiumBookings'
import api from '@/utils/api'

type UserData = {
  username: string
  email: string
  profilePhoto: string
  joinDate: string
  stats: {
    completedSessions: number
    upcomingSessions: number
    favoriteSport: string
  }
}

type CourseEnrollment = {
  id: number
  course_details: {
    id: number
    title: string
    description: string
    trainer: number
    start_time: string
    end_time: string
    days_of_week: string[]
    thumbnail: string
    start_date: string
    end_date: string
  }
  enrolled_at: string
  is_cancelled: boolean
}

type SlotBooking = {
  id: number
  booking_date: string
  is_cancelled: boolean
  booked_at?: string
  slot: {
    id: number
    start_time: string
    end_time: string
    stadium: {
      name: string
      location: string
    }
    sport: string
  }
}

type BookingData = {
  course_enrollments: CourseEnrollment[]
  slot_bookings: SlotBooking[]
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileResponse = await api.get('/user/profile/')
        const profile = profileResponse.data.profile
        
        // Set default user data
        const defaultUserData = {
          username: profile.username,
          email: profile.email,
          profilePhoto: profile.profile_photo,
          joinDate: new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          stats: {
            completedSessions: 0,
            upcomingSessions: 0,
            favoriteSport: 'None'
          }
        }
        
        setUserData(defaultUserData)

        // Fetch bookings
        const bookingsResponse = await api.get('/orders/bookings/')
        setBookingData(bookingsResponse.data)
        
        // Calculate stats based on bookings
        if (bookingsResponse.data) {
          const upcomingCourses = bookingsResponse.data.course_enrollments.filter(
            (e: CourseEnrollment) => !e.is_cancelled
          ).length
          
          const upcomingSlots = bookingsResponse.data.slot_bookings.filter(
            (b: SlotBooking) => !b.is_cancelled
          ).length
          
          // Determine favorite sport from bookings
          const sportsCount: Record<string, number> = {}
          bookingsResponse.data.slot_bookings.forEach((b: SlotBooking) => {
            if (!b.is_cancelled) {
              sportsCount[b.slot.sport] = (sportsCount[b.slot.sport] || 0) + 1
            }
          })
          
          const favoriteSport = Object.keys(sportsCount).length > 0 
            ? Object.entries(sportsCount).sort((a, b) => b[1] - a[1])[0][0]
            : 'None'

          setUserData(prev => ({
            ...prev!,
            stats: {
              completedSessions: 0,
              upcomingSessions: upcomingCourses + upcomingSlots,
              favoriteSport
            }
          }))
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getTrainerBookings = () => {
    if (!bookingData) return { upcoming: [], past: [], cancelled: [] }

    const now = new Date()
    return {
      upcoming: bookingData.course_enrollments
        .filter(enrollment => !enrollment.is_cancelled)
        .map(enrollment => ({
          id: enrollment.id,
          title: enrollment.course_details.title,
          trainer: `Trainer #${enrollment.course_details.trainer}`,
          date: new Date(enrollment.course_details.start_date).toLocaleDateString(),
          time: `${enrollment.course_details.start_time} - ${enrollment.course_details.end_time}`,
          days: [...new Set(enrollment.course_details.days_of_week)].join(', '),
          thumbnail: enrollment.course_details.thumbnail,
          enrolledAt: new Date(enrollment.enrolled_at).toLocaleString()
        })),
      past: bookingData.course_enrollments
        .filter(enrollment => enrollment.is_cancelled)
        .map(enrollment => ({
          id: enrollment.id,
          title: enrollment.course_details.title,
          trainer: `Trainer #${enrollment.course_details.trainer}`,
          date: new Date(enrollment.course_details.start_date).toLocaleDateString(),
          time: `${enrollment.course_details.start_time} - ${enrollment.course_details.end_time}`,
          days: [...new Set(enrollment.course_details.days_of_week)].join(', '),
          enrolledAt: new Date(enrollment.enrolled_at).toLocaleString(),
          cancelled: true
        }))
    }
  }

  const getStadiumBookings = () => {
    if (!bookingData) return { upcoming: [], past: [] }

    return {
      upcoming: bookingData.slot_bookings
        .filter(booking => !booking.is_cancelled)
        .map(booking => ({
          id: booking.id,
          stadium: booking.slot.stadium.name,
          date: new Date(booking.booking_date).toLocaleDateString(),
          time: `${booking.slot.start_time} - ${booking.slot.end_time}`,
          sport: booking.slot.sport,
          location: booking.slot.stadium.location,
          bookedAt: booking.booked_at ? new Date(booking.booked_at).toLocaleString() : 'N/A'
        })),
      past: bookingData.slot_bookings
        .filter(booking => booking.is_cancelled)
        .map(booking => ({
          id: booking.id,
          stadium: booking.slot.stadium.name,
          date: new Date(booking.booking_date).toLocaleDateString(),
          time: `${booking.slot.start_time} - ${booking.slot.end_time}`,
          sport: booking.slot.sport,
          location: booking.slot.stadium.location,
          bookedAt: booking.booked_at ? new Date(booking.booked_at).toLocaleString() : 'N/A',
          cancelled: true
        }))
    }
  }

  const handleLogout = () => {
    console.log('User logged out')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={false} setDarkMode={() => {}} />
        <div className="flex justify-center items-center pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={() => {}} />
      
      <div className="flex pt-24">
        {/* Sidebar Navigation */}
        <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
          <div className="flex items-center space-x-3 p-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              {userData?.profilePhoto ? (
                <img 
                  src={userData.profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-white">{userData?.username || 'User'}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{userData?.email || ''}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FiUser className="w-5 h-5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('trainer')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'trainer' ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FiVideo className="w-5 h-5" />
              <span>Trainer Bookings</span>
            </button>

            <button
              onClick={() => setActiveTab('stadium')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'stadium' ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FiCalendar className="w-5 h-5" />
              <span>Stadium Bookings</span>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'profile' && userData && <ProfileSection userData={userData} />}
            {activeTab === 'trainer' && <TrainerBookings bookings={getTrainerBookings()} />}
            {activeTab === 'stadium' && <StadiumBookings bookings={getStadiumBookings()} />}
          </div>
        </div>
      </div>
    </div>
  ) 
}

export default ProfilePage