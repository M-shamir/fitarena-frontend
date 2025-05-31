// components/trainer/LiveSessions.tsx
import { useState, useEffect } from 'react'
import api from '@/utils/api'

interface LiveSession {
  id: number
  course_id: number
  course_title: string
  session_date: string
  start_time: string
  zego_room_id: string
  zego_token: string
  participants_count: number
}

export default function LiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [joiningSession, setJoiningSession] = useState<number | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/trainer/live-sessions/')
        setSessions(response.data)
      } catch (error) {
        console.error('Failed to fetch live sessions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  const handleJoinSession = async (sessionId: number) => {
    setJoiningSession(sessionId)
    try {
      const response = await api.post(`/trainer/sessions/${sessionId}/join/`)
      const { room_id, token, role, user_id, user_name } = response.data
      
      
      const videoCallUrl = `/video-call?room_id=${room_id}&token=${token}&role=${role}&user_id=${user_id}&user_name=${encodeURIComponent(user_name)}`
      
      window.open(videoCallUrl, '_blank', 'width=1000,height=700,scrollbars=no,resizable=yes')
    } catch (error) {
      console.error('Failed to join session:', error)
      alert('Failed to join session. Please try again.')
    } finally {
      setJoiningSession(null)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Live Sessions</h2>
      
      {loading ? (
        <div>Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-gray-400">No upcoming live sessions</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <div key={session.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{session.course_title}</h3>
              <div className="text-sm text-gray-400 mb-2">
                <div>📅 {new Date(session.session_date).toLocaleDateString()}</div>
                <div>⏰ {session.start_time}</div>
                <div>👥 {session.participants_count} participants</div>
              </div>
              <button
                onClick={() => handleJoinSession(session.id)}
                disabled={joiningSession === session.id}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
              >
                {joiningSession === session.id ? 'Joining...' : 'Join Session'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}