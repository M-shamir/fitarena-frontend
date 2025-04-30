import React, { useEffect, useState } from "react";
import api from '@/utils/api';

interface StadiumOwner {
  id: number;
  username: string;
  email: string;
  is_approved: string;
  stadiumowner_profile: number;
}

const PendingStadiums: React.FC = () => {
  const [owners, setOwners] = useState<StadiumOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingStadiums();
  }, []);

  const fetchPendingStadiums = async () => {
    try {
      const response = await api.get("/admin-api/stadium_owner/pending/");
      const pendingOwners = response.data.pending_stadium_owners || [];
      pendingOwners.sort((a: StadiumOwner, b: StadiumOwner) => a.id - b.id);
      setOwners(pendingOwners);
    } catch (err) {
      setError("Failed to fetch pending stadium owners");
      console.error("Error fetching stadium owners:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (ownerId: number, action: 'approve' | 'reject') => {
    if (!window.confirm(`Are you sure you want to ${action} this stadium owner?`)) return;
    
    setActionLoading(ownerId);
    try {
      await api.post(`/admin-api/stadium_owner/${ownerId}/${action}/`);
     
      setOwners(prev => prev.filter(owner => owner.id !== ownerId));
    } catch (err) {
      alert(`Failed to ${action} stadium owner`);
      console.error(`Error ${action}ing stadium owner:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Pending Stadium Owners</h3>
        <button 
          onClick={fetchPendingStadiums}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-[#22b664]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {owners.length === 0 && !loading && !error && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-gray-300">No pending stadium owners found.</p>
        </div>
      )}

      {owners.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {owners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{owner.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{owner.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{owner.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveReject(owner.id, 'approve')}
                          disabled={actionLoading === owner.id}
                          className={`px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold ${
                            actionLoading === owner.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {actionLoading === owner.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleApproveReject(owner.id, 'reject')}
                          disabled={actionLoading === owner.id}
                          className={`px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold ${
                            actionLoading === owner.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {actionLoading === owner.id ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingStadiums;