'use client'
import { FiEdit, FiUser, FiCalendar, FiActivity, FiAward } from 'react-icons/fi'
import { useState } from 'react'
import api from '@/utils/api'
import toast from 'react-hot-toast'

const ProfileSection = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: userData.username,
    email: userData.email
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const profileResponse = await api.patch('/user/profile/edit/', formData)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      // Update the displayed user data with the new values
      userData.username = formData.username
      userData.email = formData.email
    } catch (error:unknown) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center overflow-hidden">
              <FiUser className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600"
            >
              <FiEdit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{userData.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
            
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiCalendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{userData.stats.completedSessions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiActivity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{userData.stats.upcomingSessions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiAward className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{userData.stats.favoriteSport}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Favorite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h3>
                <p className="mt-1 text-gray-800 dark:text-white">{userData.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="mt-1 text-gray-800 dark:text-white">{userData.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
                <p className="mt-1 text-gray-800 dark:text-white">{userData.joinDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorite Sport</h3>
                <p className="mt-1 text-gray-800 dark:text-white">{userData.stats.favoriteSport}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileSection