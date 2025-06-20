"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ApprovedStadium {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  image: string;
  status: 'approved';
  listed: boolean;
}

interface ApiResponse {
  approved_stadiums: ApprovedStadium[];
}

export default function ApprovedStadiums() {
  const [stadiums, setStadiums] = useState<ApprovedStadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchApprovedStadiums();
  }, []);

  const fetchApprovedStadiums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse>('/admin-api/stadiums/approved/');
      setStadiums(response.data.approved_stadiums);
    } catch (err) {
      setError("Failed to fetch approved stadiums. Please try again.");
      console.error("Error fetching stadiums:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStadiumListing = async (stadiumId: number) => {
    if (!window.confirm("Are you sure you want to list/unlist this stadium?")) return;
    
    setActionLoading(stadiumId);
    try {
      await api.post(`/admin-api/stadiums/${stadiumId}/list-toggle/`);
      setStadiums(prev => 
        prev.map(stadium => 
          stadium.id === stadiumId 
            ? { ...stadium, listed: !stadium.listed } 
            : stadium
        )
      );
      toast.success(`Stadium ${stadiums.find(s => s.id === stadiumId)?.listed ? 'unlisted' : 'listed'} successfully!`);
    } catch (err) {
      toast.error("Failed to update stadium listing status");
      console.error("Error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatLocation = (stadium: ApprovedStadium) => {
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
        <h2 className="text-xl font-bold">Approved Stadiums</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">
            {stadiums.length} stadium{stadiums.length !== 1 && "s"}
          </p>
          <button 
            onClick={fetchApprovedStadiums}
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
              fetchApprovedStadiums();
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
          <h3 className="mt-2 text-sm font-medium text-gray-300">No approved stadiums</h3>
          <p className="mt-1 text-sm text-gray-500">No stadiums have been approved yet.</p>
        </div>
      ) : (
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
    <div className="h-full w-full relative">
      <Image
        src={stadium.image}
        alt={stadium.name}
        fill
        className="rounded-md object-cover"
        onError={handleImageError}
        unoptimized={true} // Only if you're hosting images externally
      />
    </div>
  ) : (
    <span className="text-xs text-gray-500">No image</span>
  )}
</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      stadium.listed 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {stadium.listed ? 'Listed' : 'Unlisted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleStadiumListing(stadium.id)}
                      disabled={actionLoading === stadium.id}
                      className={`px-3 py-1 ${
                        stadium.listed
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white rounded text-xs font-semibold ${
                        actionLoading === stadium.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {actionLoading === stadium.id 
                        ? 'Processing...' 
                        : stadium.listed 
                          ? 'Unlist' 
                          : 'List'}
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