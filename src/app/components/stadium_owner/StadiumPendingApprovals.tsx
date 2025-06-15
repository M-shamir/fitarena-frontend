"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Image from 'next/image';

interface PendingStadium {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  image: string | null;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export default function StadiumPendingApprovals() {
  const [stadiums, setStadiums] = useState<PendingStadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStadium, setEditingStadium] = useState<PendingStadium | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    image: null as File | null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('stadium_owner/stadiums/pending/');
        setStadiums(response.data);
      } catch (error) {
        console.error("Failed to fetch stadiums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (stadium: PendingStadium) => {
    setEditingStadium(stadium);
    setEditFormData({
      name: stadium.name,
      description: stadium.description,
      address: stadium.address,
      city: stadium.city || '',
      state: stadium.state || '',
      pincode: stadium.pincode || '',
      latitude: '',
      longitude: '',
      image: null
    });
  };

  const handleCancelEdit = () => {
    setEditingStadium(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStadium) return;

    try {
      const formData = new FormData();
      
      // Append all fields to formData
      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (key === 'image' && value) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await api.patch(
        `stadium_owner/stadiums/edit/${editingStadium.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        withCredentials: true,
        }
      );

      setStadiums(stadiums.map(stadium => 
        stadium.id === editingStadium.id ? { ...stadium, ...response.data } : stadium
      ));
      
      setEditingStadium(null);
    } catch (error) {
      console.error("Error updating stadium:", error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setEditFormData(prev => ({
        ...prev,
        image: files ? files[0] : null
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await api.delete(`stadium_owner/stadiums/delete/${id}/`);
      setStadiums((prev) => prev.filter(stadium => stadium.id !== id));
    } catch (error) {
      console.error("Error cancelling stadium:", error);
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

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Edit Modal */}
      {editingStadium && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Edit Stadium</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleFormChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      required
                    />
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFormChange}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
                    />
                    {editingStadium.image && !editFormData.image && (
                      <div className="mt-2">
                        <Image
                          src={editingStadium.image} 
                          alt="Current stadium" 
                          className="h-24 w-24 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Location Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address*</label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleFormChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={editFormData.pincode}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                      <input
                        type="text"
                        name="latitude"
                        value={editFormData.latitude}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                      <input
                        type="text"
                        name="longitude"
                        value={editFormData.longitude}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
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
        <h2 className="text-xl font-bold">Pending Stadium Approvals</h2>
        <p className="text-sm text-gray-400">
          {stadiums.length} stadium{stadiums.length !== 1 && "s"} waiting approval
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : stadiums.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No pending approvals</h3>
          <p className="mt-1 text-sm text-gray-500">All your stadium requests have been processed.</p>
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
                    {stadium.image ? (
                      <Image 
                        src={stadium.image} 
                        alt={stadium.name} 
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                      {stadium.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(stadium)} 
                      className="text-[#22b664] hover:text-[#1da058]"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleCancel(stadium.id)} 
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