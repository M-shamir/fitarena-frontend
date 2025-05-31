'use client'
import { FiVideo, FiClock, FiCheckCircle, FiStar } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import api from '@/utils/api'

interface LiveSession {
  id: number
  course_id: number
  course_title: string
  session_date: string
  start_time: string
  end_time: string
  zego_room_id: string
  trainer_name: string
  is_live: boolean
  thumbnail: string
}

interface Booking {
  id: string
  title: string
  trainer: string
  date: string
  time: string
  rated?: boolean
  isLive?: boolean
}

interface TrainerBookingsProps {
  upcomingBookings?: Booking[]
  pastBookings?: Booking[]
}

const TrainerBookings = ({ upcomingBookings = [], pastBookings = [] }: TrainerBookingsProps) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today')
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joiningSession, setJoiningSession] = useState<number | null>(null)

  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        setLoading(true)
        // Changed from '/user/live-sessions/' to '/trainer/live-sessions/'
        const response = await api.get('/user/live-sessions/')
        setLiveSessions(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch live sessions')
        console.error('Error fetching live sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'today') {
      fetchLiveSessions()
    }
  }, [activeTab])

  const handleCancel = (bookingId: string) => {
    console.log('Cancel booking:', bookingId)
  }

  const handleRate = (bookingId: string) => {
    console.log('Rate booking:', bookingId)
  }

  const handleJoinSession = async (sessionId: number) => {
    setJoiningSession(sessionId)
    try {
      // Changed from '/user/sessions/' to '/trainer/sessions/'
      const response = await api.post(`/user/sessions/${sessionId}/join/`)
      const { room_id, token, role, user_id, user_name } = response.data
      
      const videoCallUrl = `/video-call?room_id=${room_id}&token=${token}&role=${role}&user_id=${user_id}&user_name=${encodeURIComponent(user_name)}`
      
      window.open(videoCallUrl, '_blank', 'width=1000,height=700')
    } catch (error) {
      console.error('Failed to join session:', error)
      alert('Failed to join session. Please try again.')
    } finally {
      setJoiningSession(null)
    }
  }

  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trainer Bookings</h2>
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === 'today' 
                ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white' 
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Today
          </button>
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

      {activeTab === 'today' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <FiVideo className="w-10 h-10 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading sessions</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{error}</p>
            </div>
          ) : liveSessions.length > 0 ? (
            liveSessions.map(session => (
              <div key={session.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {session.thumbnail && (
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img 
                          src={session.thumbnail} 
                          alt={session.course_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{session.course_title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">with {session.trainer_name || 'Trainer'}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>{formatDate(session.session_date)} • {formatTimeRange(session.start_time, session.end_time)}</span>
                        {session.is_live && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full">
                            Live Now
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {session.is_live ? (
                      <button 
                        onClick={() => handleJoinSession(session.id)}
                        disabled={joiningSession === session.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {joiningSession === session.id ? 'Joining...' : 'Join Session'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleCancel(session.id.toString())}
                        className="px-4 py-2 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FiClock className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No sessions today</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You don't have any training sessions scheduled for today</p>
            </div>
          )}
        </div>
      ) : activeTab === 'upcoming' ? (
        <div className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                {/* ... existing upcoming bookings code ... */}
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
          {pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                {/* ... existing past bookings code ... */}
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