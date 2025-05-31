import { useState, useEffect } from 'react'
import api from '@/utils/api'

interface Course {
  id: number
  title: string
  enrolled_users_count: number
  upcoming_sessions_count: number
}

interface EnrolledUser {
  id: number
  name: string
  email: string
  enrolled_at: string
}

export default function CourseEnrollments() {
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledUsers, setEnrolledUsers] = useState<Record<number, EnrolledUser[]>>({})
  const [loading, setLoading] = useState(true)
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)
  const [usersLoading, setUsersLoading] = useState<number | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/trainer/courses/enrollments/')
        setCourses(response.data)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleViewEnrollments = async (courseId: number) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null)
      return
    }

    setUsersLoading(courseId)
    try {
      const response = await api.get(`/trainer/courses/${courseId}/enrolled-users/`)
      setEnrolledUsers(prev => ({
        ...prev,
        [courseId]: response.data
      }))
      setExpandedCourse(courseId)
    } catch (error) {
      console.error('Failed to fetch enrolled users:', error)
    } finally {
      setUsersLoading(null)
    }
  }

  const handleJoinSession = (courseId: number) => {
    // Implement your join session logic here
    console.log(`Joining session for course ${courseId}`)
    // This would typically open a video session or redirect to the session page
  }


  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Course Enrollments</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>👥 {course.enrolled_users_count} enrolled</span>
                <span>📅 {course.upcoming_sessions_count} upcoming</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewEnrollments(course.id)}
                  className="flex-1 bg-[#22b664] hover:bg-[#1e9b56] text-white py-2 rounded-lg transition"
                  disabled={usersLoading === course.id}
                >
                  {usersLoading === course.id ? 'Loading...' : 
                   expandedCourse === course.id ? 'Hide Enrollments' : 'View Enrollments'}
                </button>
                
                {course.upcoming_sessions_count > 0 && (
                  <button
                    onClick={() => handleJoinSession(course.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    Join Session
                  </button>
                )}
              </div>

              {expandedCourse === course.id && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Enrolled Users:</h4>
                  <div className="max-h-60 overflow-y-auto">
                    {enrolledUsers[course.id]?.length > 0 ? (
                      <ul className="space-y-2">
                        {enrolledUsers[course.id].map(user => (
                          <li key={user.id} className="p-2 bg-gray-700 rounded">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            <div className="text-xs text-gray-500">
                              Enrolled: {new Date(user.enrolled_at).toLocaleDateString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-400">No enrolled users found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}