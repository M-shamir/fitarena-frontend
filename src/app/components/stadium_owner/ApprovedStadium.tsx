"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';
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
}

interface Slot {
  date: string;
  start_time: string;
  end_time: string;
  price: string;
  status: string;
}

interface SlotResponse {
  message: string;
  slots: Slot[];
}

export default function ApprovedStadiums() {
  const [stadiums, setStadiums] = useState<ApprovedStadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<ApprovedStadium | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchApprovedStadiums();
  }, []);

  const fetchApprovedStadiums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApprovedStadium[]>('stadium_owner/approved-stadiums/');
      setStadiums(response.data); 
    } catch (err) {
      setError("Failed to fetch approved stadiums. Please try again.");
      console.error("Error fetching stadiums:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (stadiumId: number) => {
    try {
      setSlotsLoading(true);
      const response = await api.get<SlotResponse>(`stadium_owner/slots/${stadiumId}/`);
      setSlots(response.data.slots);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const openSlotsModal = async (stadium: ApprovedStadium) => {
    setSelectedStadium(stadium);
    await fetchSlots(stadium.id);
  };

  const closeModal = () => {
    setSelectedStadium(null);
    setSlots([]);
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

  const formatTime = (timeString: string) => {
    const time = timeString.split(':');
    return `${time[0]}:${time[1]}`;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map((stadium) => (
            <div key={stadium.id} className="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600 hover:border-gray-500 transition duration-200">
              <div className="h-48 bg-gray-700 relative">
                {stadium.image ? (
                  <Image
                  width={200}
                  height={200}
                    src={stadium.image} 
                    alt={stadium.name} 
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{stadium.name}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{stadium.description}</p>
                <div className="flex items-center text-sm text-gray-300 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{formatLocation(stadium)}</span>
                </div>
                <button
                  onClick={() => openSlotsModal(stadium)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                >
                  View Slots
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slots Modal */}
      {selectedStadium && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedStadium.name}</h3>
                  <p className="text-sm text-gray-400">{formatLocation(selectedStadium)}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {slotsLoading ? (
                <div className="text-center py-8 text-gray-400">Loading slots...</div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-300">No slots generated</h3>
                  <p className="mt-1 text-sm text-gray-500">This stadium doesn&apos;t have any slots yet.</p>                </div>
              ) : (
                <div className="overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slots.map((slot, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white">{slot.date}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            slot.status === 'available' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {slot.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>Time:</span>
                          <span>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Price:</span>
                          <span>₹{slot.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}