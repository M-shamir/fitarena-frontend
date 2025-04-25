"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface PendingSession {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  price: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function PendingApprovals() {
  const [sessions, setSessions] = useState<PendingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/trainer/pending-approvals/'); 
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleEdit = (id: string) => {
    console.log('Edit session:', id);
  };

  const handleCancel = async (id: string) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter(session => session.id !== id));
    } catch (error) {
      console.error("Error cancelling session:", error);
    }
  };

  // Helper function to format date (e.g., "2025-04-22" to "April 22, 2025")
  const formatDate = (date: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Helper function to format time (adjusting for local timezone)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Convert to the local time zone and return in 12-hour format
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pending Approvals</h2>
        <p className="text-sm text-gray-400">
          {sessions.length} session{sessions.length !== 1 && "s"} waiting approval
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No pending approvals</h3>
          <p className="mt-1 text-sm text-gray-500">All your session requests have been processed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-700/30 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{session.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(session.start_date)} to {formatDate(session.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{session.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(session.id)} className="text-[#22b664] hover:text-[#1da058]">
                      Edit
                    </button>
                    <button onClick={() => handleCancel(session.id)} className="text-red-500 hover:text-red-400">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
