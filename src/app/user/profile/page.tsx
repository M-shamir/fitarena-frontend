'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/user/layout/Header'
import { FiUser, FiCalendar, FiVideo, FiSettings, FiLogOut, FiHome, FiMenu } from 'react-icons/fi'
import ProfileSection from '@/app/components/user/profile/ProfileSection'
import TrainerBookings from '@/app/components/user/profile/TrainerBookings'
import StadiumBookings from '@/app/components/user/profile/StadiumBookings'
import api from '@/utils/api' // Axios instance

const ProfilePage = () => {
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
  
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile/')
        const profile = response.data.profile
        setUserData({
          username: profile.username,
          email: profile.email,
          profilePhoto: profile.profile_photo,
          joinDate: 'Joined May 2025',
          stats: {
            completedSessions: 12,
            upcomingSessions: 3,
            favoriteSport: 'Basketball'
          }
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const trainerBookings = {
    upcoming: [
      { id: 1, title: 'Personal Training', trainer: 'Alex Johnson', date: '2023-08-20', time: '17:00 - 18:00' },
      { id: 2, title: 'Yoga Class', trainer: 'Sarah Miller', date: '2023-08-22', time: '09:00 - 10:00' }
    ],
    past: [
      { id: 3, title: 'Cardio Session', trainer: 'Mike Chen', date: '2023-08-15', time: '18:00 - 19:00', completed: true },
      { id: 4, title: 'Strength Training', trainer: 'Emma Wilson', date: '2023-08-10', time: '17:00 - 18:00', completed: true }
    ]
  }

  const stadiumBookings = {
    upcoming: [
      { id: 1, stadium: 'Central Arena', date: '2023-08-18', time: '17:00 - 19:00', sport: 'Basketball' },
      { id: 2, stadium: 'Sports Complex', date: '2023-08-21', time: '15:00 - 17:00', sport: 'Badminton' }
    ],
    past: [
      { id: 3, stadium: 'Olympic Center', date: '2023-08-05', time: '16:00 - 18:00', sport: 'Tennis', completed: true }
    ]
  }

  const handleLogout = () => {
    // Implement logout logic
    console.log('User logged out')
  }

  if (loading || !userData) {
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
              {userData.profilePhoto ? (
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
              <h2 className="font-semibold text-gray-800 dark:text-white">{userData.username}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</p>
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

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'profile' && (
              <ProfileSection userData={userData} />
            )}
            {activeTab === 'trainer' && (
              <TrainerBookings bookings={trainerBookings} />
            )}
            {activeTab === 'stadium' && (
              <StadiumBookings bookings={stadiumBookings} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage