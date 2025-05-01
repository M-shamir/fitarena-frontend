'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface ApprovedSession {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  price: number;
  max_participants: number;
}

export default function ApprovedSessions() {
  const [sessions, setSessions] = useState<ApprovedSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/trainer/approved-sessions/')
      .then((response) => {
        setSessions(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch approved sessions:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Approved Sessions</h2>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-400">
            {loading ? 'Loading...' : `Showing ${sessions.length} published sessions`}
          </p>
          <button className="text-sm text-[#22b664] hover:text-[#1da058] transition duration-200">
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-sm text-gray-400">Fetching sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">
            No published sessions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your approved sessions will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Participants</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-white">{session.title}</td>
                  <td className="px-6 py-4 text-white">
                    {session.days_of_week.join(', ')} • {session.start_time} - {session.end_time}
                  </td>
                  <td className="px-6 py-4 text-white">${session.price}</td>
                  <td className="px-6 py-4 text-white">{session.max_participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
