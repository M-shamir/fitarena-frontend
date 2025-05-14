'use client'
import { useState } from 'react'
import Header from '@/app/components/user/layout/Header'
import { FiUser, FiCalendar, FiVideo, FiSettings, FiLogOut, FiHome, FiMenu } from 'react-icons/fi'
import ProfileSection from '@/app/components/user/profile/ProfileSection'
import TrainerBookings from '@/app/components/user/profile/TrainerBookings'
import StadiumBookings from '@/app/components/user/profile/StadiumBookings'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  
  // Dummy user data
  const userData = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    profilePhoto: '/default-profile.jpg',
    joinDate: 'Joined January 2023',
    stats: {
      completedSessions: 12,
      upcomingSessions: 3,
      favoriteSport: 'Basketball'
    }
  }

  // Dummy trainer bookings
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

  // Dummy stadium bookings
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={function (mode: boolean): void {
              throw new Error('Function not implemented.')
          } } />
      
      <div className="flex pt-24">
        {/* Sidebar Navigation */}
        <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
          <div className="flex items-center space-x-3 p-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <FiUser className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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