import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/utils/api';

interface Course {
  id: number;
  title: string;
  trainer_name: string;
  trainer_type: number;
  days_of_week?: string[];
  start_time?: string;
  end_time?: string;
  start_date: string;
  end_date: string;
  max_participants?: number;
  price?: number;
  thumbnail?: string;
}

export default function PendingCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const response = await api.get('/admin-api/trainers/cource/pending/');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching pending courses:', error);
        toast.error('Failed to load pending courses');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingCourses();
  }, []);

  const handleAction = async (courseId: number, actionType: 'approve' | 'reject') => {
    try {
      const endpoint = actionType === 'approve' 
        ? `/admin-api/trainers/cource/${courseId}/approve/`
        : `/admin-api/trainers/cource/${courseId}/reject/`;

      await api.post(endpoint);

      toast.success(`Course ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);

      setCourses((prevCourses) => prevCourses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error(`Error ${actionType}ing course:`, error);
      toast.error(`Failed to ${actionType} course`);
    }
  };

  const formatDays = (days?: string[]) => {
    if (!days) return 'N/A';
    return [...new Set(days)].join(', ');
  };

  const formatTime = (time?: string) => {
    if (!time) return 'N/A';
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTrainerType = (type: number) => {
    return type === 1 ? 'Online' : 'In-person';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h3 className="text-2xl font-semibold text-white mb-6">Pending Courses Approval</h3>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22b664]"></div>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-gray-400 py-4">No pending courses for approval.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trainer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {course.thumbnail && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={course.thumbnail} alt={course.title} />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{course.title}</div>
                        <div className="text-xs text-gray-400">{getTrainerType(course.trainer_type)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.trainer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatDays(course.days_of_week)} • {formatTime(course.start_time)}-{formatTime(course.end_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.max_participants || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${course.price || '0.00'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleAction(course.id, 'approve')} className="text-[#22b664] hover:text-[#1da058] mr-4">Approve</button>
                    <button onClick={() => handleAction(course.id, 'reject')} className="text-red-500 hover:text-red-400">Reject</button>
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
