'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/user/layout/Header'
import { FiUser, FiCalendar, FiVideo, FiLogOut } from 'react-icons/fi'
import ProfileSection from '@/app/components/user/profile/ProfileSection'
import TrainerBookings from '@/app/components/user/profile/TrainerBookings'
import StadiumBookings from '@/app/components/user/profile/StadiumBookings'
import api from '@/utils/api'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

const ProfilePage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile only
        const profileResponse = await api.get('/user/profile/')
        const profile = profileResponse.data.profile
       
        
        // Set default user data
        const defaultUserData = {
          username: profile.username,
          email: profile.email,
          profilePhoto: profile.profile_photo,
          joinDate: new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          stats: {
            completedSessions: 0,
            upcomingSessions: 0,
            favoriteSport: 'None'
          }
        }
        
        setUserData(defaultUserData)
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await api.post('/user/logout/');
  
      if (response.status === 200) {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('locationPermissionAsked');
        localStorage.removeItem('userLocation');
        router.push('/user/login');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
<div className="relative w-10 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center overflow-hidden">              {userData?.profilePhoto ? (
                <Image
                  src={userData.profilePhoto}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
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
            {activeTab === 'trainer' && <TrainerBookings />}
            {activeTab === 'stadium' && <StadiumBookings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage