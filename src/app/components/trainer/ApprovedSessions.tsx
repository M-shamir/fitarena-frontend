"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '@/utils/api';

interface ApprovedSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  days: string[];
  price: number;
  participants: {
    joined: number;
    max: number;
  };
  status: 'Published' | 'Draft' | 'Cancelled';
}

export default function ApprovedSessions() {
  const [sessions, setSessions] = useState<ApprovedSession[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/trainer/approved-sessions/')
      .then((response) => {
        setSessions(response.data); // assuming your backend returns an array of ApprovedSession
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch approved sessions:', error);
        setLoading(false);
      });
  }, []);

  const handleView = (id: string) => {
    console.log('View session:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit session:', id);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Approved Sessions</h2>
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
          {/* (same empty state block) */}
          <svg 
            className="mx-auto h-12 w-12 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">
            No published sessions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your approved sessions will appear here
          </p>
        </div>
      ) : (
        // your table rendering logic stays the same
        <div className="overflow-x-auto">
          {/* (keep your existing table code here) */}
        </div>
      )}
    </div>
  );
}
