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
  status?: 'approved'; 
}

interface SlotFormData {
  stadium_id: number;
  start_date: string;
  start_time: string;
  end_time: string;
  price: string;
}

export default function StadiumApprovedSlots() {
  const [stadiums, setStadiums] = useState<ApprovedStadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState<number | null>(null);
  const [slotData, setSlotData] = useState<SlotFormData>({
    stadium_id: 0,
    start_date: '',
    start_time: '',
    end_time: '',
    price: ''
  });

  useEffect(() => {
    fetchApprovedStadiums();
  }, []);

  const fetchApprovedStadiums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApprovedStadium[]>('stadium_owner/stadiums/unassigned/');
      setStadiums(response.data); 
    } catch (err) {
      setError("Failed to fetch approved stadiums. Please try again.");
      console.error("Error fetching stadiums:", err);
    } finally {
      setLoading(false);
    }
  };

  const openSlotDialog = (stadiumId: number) => {
    setSelectedStadium(stadiumId);
    setSlotData({
      stadium_id: stadiumId,
      start_date: '',
      start_time: '',
      end_time: '',
      price: ''
    });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setActionLoading(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSlotData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSlot = async (forWeek: boolean = false) => {
    if (!slotData.start_date || !slotData.start_time || !slotData.end_time || !slotData.price) {
      toast.error("Please fill all fields");
      return;
    }

    setActionLoading(selectedStadium);
    try {
      const payload = {
        stadium_id: selectedStadium,
        start_date: slotData.start_date,
        start_time: slotData.start_time,
        end_time: slotData.end_time,
        price: parseFloat(slotData.price),
        generate_week: forWeek
      };

      await api.post('stadium_owner/slots/create/', payload);
      toast.success(`Slot${forWeek ? 's for week' : ''} generated successfully!`);
      closeDialog();
    } catch (err) {
      toast.error("Failed to generate slot");
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
        <h2 className="text-xl font-bold">Add Slots</h2>
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
          <h3 className="mt-2 text-sm font-medium text-gray-300">No stadium to add slot</h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stadium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
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
                          width={200}
                          height={200}
                          alt={stadium.name} 
                          className="h-full w-full rounded-md object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openSlotDialog(stadium.id)}
                      disabled={actionLoading === stadium.id}
                      className={`px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold ${
                        actionLoading === stadium.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {actionLoading === stadium.id ? 'Processing...' : 'Generate Slot'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog for Slot Generation */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Generate Time Slot</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={slotData.start_date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={slotData.start_time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={slotData.end_time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={slotData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    placeholder="500.00"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => generateSlot(true)}
                  disabled={actionLoading === selectedStadium}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading === selectedStadium ? 'Generating...' : 'Generate for Week'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

