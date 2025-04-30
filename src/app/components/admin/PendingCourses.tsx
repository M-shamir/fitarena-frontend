import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PendingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'

  useEffect(() => {
    // Simulate fetching data with dummy data
    const fetchPendingCourses = async () => {
      try {
        // Dummy data for courses
        const dummyCourses = [
          {
            id: 1,
            title: 'React for Beginners',
            trainer: { user: { username: 'john_doe', email: 'john@example.com' }, trainer_type: { name: 'Online' } },
            days_of_week: ['Monday', 'Wednesday'],
            start_time: '09:00',
            end_time: '11:00',
            start_date: '2025-05-01',
            end_date: '2025-06-01',
            max_participants: 30,
            price: 99.99,
            thumbnail: 'https://via.placeholder.com/100',
          },
          {
            id: 2,
            title: 'Advanced JavaScript',
            trainer: { user: { username: 'jane_smith', email: 'jane@example.com' }, trainer_type: { name: 'In-person' } },
            days_of_week: ['Tuesday', 'Thursday'],
            start_time: '14:00',
            end_time: '16:00',
            start_date: '2025-06-01',
            end_date: '2025-07-01',
            max_participants: 25,
            price: 150.00,
            thumbnail: 'https://via.placeholder.com/100',
          },
        ];
        setCourses(dummyCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending courses:', error);
        toast.error('Failed to load pending courses');
        setLoading(false);
      }
    };
    fetchPendingCourses();
  }, []);

  const handleActionClick = (course, type) => {
    setSelectedCourse(course);
    setActionType(type);
    setApprovalNote('');
    setIsModalOpen(true);
  };

  const handleSubmitAction = async () => {
    try {
      toast.success(`Course ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
      // Update the local state to remove the processed course
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
      
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${actionType}ing course:`, error);
      toast.error(`Failed to ${actionType} course`);
    }
  };

  const formatDays = (days) => {
    return days.join(', ');
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Trainer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Participants
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
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
                        <div className="text-xs text-gray-400">{course.trainer?.trainer_type?.name || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{course.trainer.user.username}</div>
                    <div className="text-xs text-gray-400">{course.trainer.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {formatDays(course.days_of_week)} • {formatTime(course.start_time)}-{formatTime(course.end_time)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {course.max_participants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ${course.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleActionClick(course, 'approve')}
                      className="text-[#22b664] hover:text-[#1da058] mr-4"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleActionClick(course, 'reject')}
                      className="text-red-500 hover:text-red-400"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {actionType === 'approve' ? 'Approve Course' : 'Reject Course'}
            </h3>
            
            <p className="text-gray-300 mb-2">
              Course: <span className="font-medium text-white">{selectedCourse?.title}</span>
            </p>
            
            <div className="mt-4">
              <label htmlFor="approvalNote" className="block text-sm font-medium text-gray-300 mb-1">
                {actionType === 'approve' ? 'Approval Note (Optional)' : 'Rejection Reason (Required)'}
              </label>
              <textarea
                id="approvalNote"
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22b664]"
                placeholder={actionType === 'approve' ? 'Add any notes for the trainer...' : 'Explain why this course is being rejected...'}
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                required={actionType === 'reject'}
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAction}
                disabled={actionType === 'reject' && !approvalNote}
                className={`px-4 py-2 rounded-md text-white ${actionType === 'approve' ? 'bg-[#22b664] hover:bg-[#1da058]' : 'bg-red-600 hover:bg-red-500'} disabled:opacity-50`}
              >
                {actionType === 'approve' ? 'Approve Course' : 'Reject Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
