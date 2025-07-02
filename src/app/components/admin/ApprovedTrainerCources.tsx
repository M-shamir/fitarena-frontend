"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface TrainerCourse {
  id: number;
  title: string;
  trainer_name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  max_participants: number;
  price: string;
  duration_minutes: number;
}

interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
}

export default function ApprovedTrainerCourses() {
  const [courses, setCourses] = useState<TrainerCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    count: 0,
    next: null,
    previous: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Fixed page size

  useEffect(() => {
    fetchApprovedCourses();
  }, [currentPage]);

  const fetchApprovedCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: TrainerCourse[];
      }>(`admin-api/trainer-courses/approved/?page=${currentPage}&page_size=${pageSize}`);
      
      setCourses(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      });
    } catch (err) {
      setError("Failed to fetch approved courses. Please try again.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Approved Training Programs</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, pagination.count)} of {pagination.count} programs
          </span>
          <button 
            onClick={fetchApprovedCourses}
            disabled={loading}
            className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && courses.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Loading programs...</div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => {
              setError(null);
              fetchApprovedCourses();
            }} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No approved programs</h3>
          <p className="mt-1 text-sm text-gray-500">No training programs have been approved yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {courses.map((course) => (
            <div key={course.id} className="bg-gray-700/30 rounded-lg border border-gray-600 p-5 hover:border-gray-500 transition duration-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                  <p className="text-sm text-gray-400">{course.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    {course.trainer_name}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    ₹{course.price}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">
                    {formatDate(course.start_date)} - {formatDate(course.end_date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">
                    {formatTime(course.start_time)} - {formatTime(course.end_time)} ({course.duration_minutes} mins)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-300">
                    Max {course.max_participants} participants
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span className="text-gray-300">
                    {course.days_of_week.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {Math.ceil(pagination.count / pageSize)}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.previous}
                className={`px-3 py-1 rounded ${!pagination.previous ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'}`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.next}
                className={`px-3 py-1 rounded ${!pagination.next ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'}`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}  