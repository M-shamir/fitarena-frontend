import { FiVideo, FiClock, FiCheckCircle, FiStar, FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import api from '@/utils/api'
import Image from 'next/image';

import { toast } from 'react-toastify'

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

interface PastCourse {
  id: number
  course_id: number
  title: string
  trainer_name: string
  start_date: string
  end_date: string
  status: 'completed' | 'cancelled'
  sessions_completed: number
  cancelled_at: string | null
  thumbnail?: string
  rating?: number
}

interface UpcomingCourse {
  id: number
  course_id: number
  title: string
  trainer_name: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  price: string
  can_cancel: boolean
}

interface Booking {
  id: number
  // Add other booking properties as needed
}



const TrainerBookings = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today')
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [upcomingCourses, setUpcomingCourses] = useState<UpcomingCourse[]>([])
  const [pastCourses, setPastCourses] = useState<PastCourse[]>([])
  const [loading, setLoading] = useState({
    live: true,
    upcoming: true,
    past: true
  })
  const [error, setError] = useState({
    live: null as string | null,
    upcoming: null as string | null,
    past: null as string | null
  })
  const [joiningSession, setJoiningSession] = useState<number | null>(null)
  const [cancellingCourse, setCancellingCourse] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'today') {
        try {
          setLoading(prev => ({ ...prev, live: true }))
          const response = await api.get('/user/live-sessions/')
          setLiveSessions(response.data)
          setError(prev => ({ ...prev, live: null }))
        } catch (err) {
          setError(prev => ({ ...prev, live: 'Failed to fetch live sessions' }))
          console.error('Error fetching live sessions:', err)
        } finally {
          setLoading(prev => ({ ...prev, live: false }))
        }
      } else if (activeTab === 'upcoming') {
        try {
          setLoading(prev => ({ ...prev, upcoming: true }))
          const response = await api.get('/user/enrolled-courses/')
          setUpcomingCourses(response.data)
          setError(prev => ({ ...prev, upcoming: null }))
        } catch (err) {
          setError(prev => ({ ...prev, upcoming: 'Failed to fetch upcoming courses' }))
          console.error('Error fetching upcoming courses:', err)
        } finally {
          setLoading(prev => ({ ...prev, upcoming: false }))
        }
      } else if (activeTab === 'past') {
        try {
          setLoading(prev => ({ ...prev, past: true }))
          const response = await api.get('/user/past-courses/')
          setPastCourses(response.data)
          setError(prev => ({ ...prev, past: null }))
        } catch (err) {
          setError(prev => ({ ...prev, past: 'Failed to fetch past courses' }))
          console.error('Error fetching past courses:', err)
        } finally {
          setLoading(prev => ({ ...prev, past: false }))
        }
      }
    }

    fetchData()
  }, [activeTab])

  const handleCancelCourse = async (enrollmentId: number) => {
    setCancellingCourse(enrollmentId)
    try {
      await api.delete(`/user/enrolled-courses/${enrollmentId}/cancel/`)
      setUpcomingCourses(prev => 
        prev.filter(course => course.id !== enrollmentId)
      )
      toast.success('Course enrollment cancelled successfully')
    } catch (error) {
      console.error('Failed to cancel course:', error)
      toast.error('Failed to cancel course. Please try again.')
    } finally {
      setCancellingCourse(null)
    }
  }

  const handleJoinSession = async (sessionId: number) => {
    setJoiningSession(sessionId)
    try {
      const response = await api.post(`/user/sessions/${sessionId}/join/`)
      const { room_id, token, role, user_id, user_name } = response.data
      
      const videoCallUrl = `/video-call?room_id=${room_id}&token=${token}&role=${role}&user_id=${user_id}&user_name=${encodeURIComponent(user_name)}`
      
      window.open(videoCallUrl, '_blank', 'width=1000,height=700')
    } catch (error) {
      console.error('Failed to join session:', error)
      toast.error('Failed to join session. Please try again.')
    } finally {
      setJoiningSession(null)
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
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Bookings</h2>
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
          {loading.live ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : error.live ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <FiVideo className="w-10 h-10 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading sessions</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{error.live}</p>
            </div>
          ) : liveSessions.length > 0 ? (
            liveSessions.map(session => (
              <div key={session.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {session.thumbnail && (
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <Image
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
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        Upcoming
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
<p className="text-gray-500 dark:text-gray-400 mt-1">You don&apos;t have any training sessions scheduled for today</p><p className="text-gray-500 dark:text-gray-400 mt-1">You don&apos;t have any training sessions scheduled for today</p>            </div>
          )}
        </div>
      ) : activeTab === 'upcoming' ? (
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
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading courses</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{error.upcoming}</p>
            </div>
          ) : upcomingCourses.length > 0 ? (
            upcomingCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">with {course.trainer_name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>Starts: {formatDate(course.start_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span>Time: {formatTimeRange(course.start_time, course.end_time)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span>Ends: {formatDate(course.end_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span>Price: ₹{course.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {course.can_cancel && (
                      <button 
                        onClick={() => handleCancelCourse(course.id)}
                        disabled={cancellingCourse === course.id}
                        className="px-4 py-2 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                      >
                        {cancellingCourse === course.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FiClock className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No upcoming courses</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You don&apos;t have any upcoming course enrollments</p>            </div>
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
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Error loading courses</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{error.past}</p>
            </div>
          ) : pastCourses.length > 0 ? (
            pastCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {course.thumbnail && (
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 dark:text-white">{course.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}>
                          {course.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">with {course.trainer_name}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FiClock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>Period: {formatDate(course.start_date)} - {formatDate(course.end_date)}</span>
                        </div>
                        
                        {course.status === 'completed' ? (
                          <>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <FiCheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>Sessions completed: {course.sessions_completed}</span>
                            </div>
                            {course.rating && (
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <FiStar className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-500" />
                                <span>Your rating: {course.rating}/5</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <FiX className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Cancelled on: {course.cancelled_at ? formatDate(course.cancelled_at) : 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 bg-gray-50 dark:bg-gray-700/20">
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition">
                      View Details
                    </button>
                    {course.status === 'completed' && !course.rating && (
                      <button className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                        Rate Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FiCheckCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No past courses</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You don&apos;t have any completed or cancelled courses</p>            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TrainerBookings