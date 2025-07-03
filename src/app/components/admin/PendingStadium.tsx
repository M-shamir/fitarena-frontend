"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';

import Image from 'next/image';
import { toast } from 'react-toastify';

interface PendingStadium {
    status: string;
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    image: string;
  }
  
  interface ApiResponse {
    pending_stadiums: PendingStadium[];
  }
  
  export default function PendingStadiums() {
    const [stadiums, setStadiums] = useState<PendingStadium[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
  
    useEffect(() => {
      fetchPendingStadiums();
    }, []);
  
    const fetchPendingStadiums = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<ApiResponse>('/admin-api/stadiums/pending-approval/');
        setStadiums(response.data.pending_stadiums);
      } catch (err) {
        setError("Failed to fetch pending stadiums. Please try again.");
        console.error("Error fetching stadiums:", err);
      } finally {
        setLoading(false);
      }
    };

    const handleApproveReject = async (stadiumId: number, action: 'approve' | 'reject') => {
      const confirmAction = await new Promise((resolve) => {
        toast(
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg max-w-md mx-auto shadow-xl">
            <div className="text-sm font-medium text-white mb-3">
              Are you sure you want to {action} this stadium?
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  toast.dismiss();
                  resolve(false);
                }}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss();
                  resolve(true);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                  action === 'approve' 
                    ? 'bg-green-600 border border-green-500 hover:bg-green-700' 
                    : 'bg-red-600 border border-red-500 hover:bg-red-700'
                }`}
              >
                {action === 'approve' ? 'Approve' : 'Reject'}
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
    
      if (!confirmAction) return;
    
      setActionLoading(stadiumId);
      try {
        await api.post(`/admin-api/stadiums/${stadiumId}/${action}/`);
        setStadiums(prev => prev.filter(stadium => stadium.id !== stadiumId));
        toast.success(`Stadium ${action}d successfully!`);
      } catch (err) {
        toast.error(`Failed to ${action} stadium. Please try again.`);
        console.error(`Error ${action}ing stadium:`, err);
      } finally {
        setActionLoading(null);
      }
    };

  const formatLocation = (stadium: PendingStadium) => {
    const locationParts = [
      stadium.address,
      stadium.city,
      stadium.state,
      stadium.pincode
    ].filter(Boolean);
    
    return locationParts.join(', ');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.parentElement!.innerHTML = '<span class="text-xs text-gray-500">No image</span>';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pending Stadium Approvals</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">
            {stadiums.length} stadium{stadiums.length !== 1 && "s"} waiting approval
          </p>
          <button 
            onClick={fetchPendingStadiums}
            disabled={loading}
            className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && stadiums.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => {
              setError(null);
              fetchPendingStadiums();
            }} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : stadiums.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No pending approvals</h3>
          <p className="mt-1 text-sm text-gray-500">All stadium requests have been processed.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stadium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {stadiums.map((stadium) => (
                  <tr key={stadium.id} className="hover:bg-gray-700/30 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{stadium.name}</div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-2">{stadium.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{formatLocation(stadium)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-10 w-10 flex items-center justify-center">
                        {stadium.image ? (
                          <Image 
                          src={stadium.image} 
                          alt={stadium.name} 
                          width={800} 
                          height={500} 
                          className="rounded-md object-cover"
                          onError={handleImageError}
                        />
                        ) : (
                          <span className="text-xs text-gray-500">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                        {stadium.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleApproveReject(stadium.id, 'approve')}
                        disabled={actionLoading === stadium.id}
                        className={`px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold ${
                          actionLoading === stadium.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {actionLoading === stadium.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleApproveReject(stadium.id, 'reject')}
                        disabled={actionLoading === stadium.id}
                        className={`px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold ${
                          actionLoading === stadium.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {actionLoading === stadium.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </>
      )}
    </div>
  );
}


