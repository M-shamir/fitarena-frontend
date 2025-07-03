"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface PendingSession {
  id: string;
  title: string;
  trainer_type: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  price: number;
  days_of_week: string[];
  thumbnail: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface TrainerType {
  id: string;
  name: string;
}

export default function PendingApprovals() {
  const [sessions, setSessions] = useState<PendingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<PendingSession | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    trainer_type: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    max_participants: 0,
    price: 0,
    days_of_week: [] as string[],
    thumbnail: null as File | null
  });
  const [trainerTypes, setTrainerTypes] = useState<TrainerType[]>([]);

  const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sessions and trainer types in parallel
        const [sessionsResponse, typesResponse] = await Promise.all([
          api.get('/trainer/pending-approvals/'),
          api.get('/trainer/trainer-types/')
        ]);
        
        setSessions(sessionsResponse.data);
        setTrainerTypes(typesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (session: PendingSession) => {
    setEditingSession(session);
    setEditFormData({
      title: session.title,
      trainer_type: session.trainer_type,
      description: session.description,
      start_date: session.start_date,
      end_date: session.end_date,
      start_time: session.start_time,
      end_time: session.end_time,
      max_participants: session.max_participants,
      price: session.price,
      days_of_week: session.days_of_week,
      thumbnail: null
    });
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;

    try {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.entries(editFormData).forEach(([key, value]) => {
        if (key === 'days_of_week') {
          formData.append(key, JSON.stringify(value));
       
        } else if (key === 'thumbnail' && value) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await api.patch(
        `trainer/trainer-cources/${editingSession.id}/edit/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSessions(sessions.map(session => 
        session.id === editingSession.id ? { ...session, ...response.data } : session
      ));
      
      setEditingSession(null);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const day = value;
      setEditFormData(prev => ({
        ...prev,
        days_of_week: checked
          ? [...prev.days_of_week, day]
          : prev.days_of_week.filter(d => d !== day)
      }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setEditFormData(prev => ({
        ...prev,
        thumbnail: files ? files[0] : null
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleCancel = async (id: string) => {
    
    const confirmCancel = await new Promise((resolve) => {
      toast(
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg max-w-md mx-auto">
          <div className="text-sm font-medium text-white mb-3">
            Are you sure you want to cancel this session?
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                toast.dismiss();
                resolve(false);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600"
            >
              No
            </button>
            <button
              onClick={() => {
                toast.dismiss();
                resolve(true);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 border border-red-500 hover:bg-red-700 transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
          className: '!bg-transparent !shadow-none !p-0',
        }
      );
    });
  
    if (!confirmCancel) return;
  
    try {
      await api.delete(`trainer/trainer-cources/${id}/`);
      setSessions((prev) => prev.filter(session => session.id !== id));
      toast.success('Session cancelled successfully');
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast.error('Failed to cancel session');
    }
  };

  const formatDate = (date: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Edit Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Edit Session</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleFormChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Trainer Type*</label>
                    <select
                      name="trainer_type"
                      value={editFormData.trainer_type}
                      onChange={handleFormChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      required
                    >
                      <option value="">Select type</option>
                      {trainerTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description*</label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleFormChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div>
  <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail</label>
  <input
    type="file"
    name="thumbnail"
    accept="image/*"
    onChange={handleFormChange}
    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
  />
  
  {editingSession.thumbnail && (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Current thumbnail:</span>
        <button 
          type="button"
          onClick={() => window.open(editingSession.thumbnail, '_blank')}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          (View full size)
        </button>
      </div>
      
      <div className="mt-2 relative group">
        <Image
        width={200}
        height={200}
          src={editingSession.thumbnail} 
          alt="Current thumbnail" 
          className="h-24 w-24 rounded-md object-cover border border-gray-600 hover:border-gray-500 transition"
        />
        
      </div>
    </div>
  )}
</div>
                </div>
                
                {/* Schedule & Pricing */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Start Date*</label>
                      <input
                        type="date"
                        name="start_date"
                        value={editFormData.start_date}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">End Date*</label>
                      <input
                        type="date"
                        name="end_date"
                        value={editFormData.end_date}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Start Time*</label>
                      <input
                        type="time"
                        name="start_time"
                        value={editFormData.start_time}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">End Time*</label>
                      <input
                        type="time"
                        name="end_time"
                        value={editFormData.end_time}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Days of Week*</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {daysOptions.map(day => (
                        <label key={day} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="days_of_week"
                            value={day}
                            checked={editFormData.days_of_week.includes(day)}
                            onChange={handleFormChange}
                            className="h-4 w-4 text-[#22b664] rounded border-gray-600 bg-gray-700 focus:ring-[#22b664]"
                          />
                          <span className="ml-2 text-sm text-gray-300">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Max Participants</label>
                      <input
                        type="number"
                        name="max_participants"
                        value={editFormData.max_participants}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹)*</label>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#22b664] rounded-md hover:bg-[#1da058]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <button 
                      onClick={() => handleEdit(session)} 
                      className="text-[#22b664] hover:text-[#1da058]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleCancel(session.id)} 
                      className="text-red-500 hover:text-red-400"
                    >
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