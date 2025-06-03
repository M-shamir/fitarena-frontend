// components/BookingHistory.tsx
"use client";
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { format } from 'date-fns';

interface Booking {
  id: number;
  slot: {
    date: string;
    stadium: number;
    start_time: string;
    end_time: string;
    price: string;
    status: string;
  };
  order: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    amount: string;
    status: string;
    created_at: string;
  };
  booking_date: string;
  booked_at: string;
  is_cancelled: boolean;
  cancelled_at: string | null;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/stadium_owner/orders/?time_filter=${timeFilter}`);
        if (response.data.success) {
          setBookings(response.data.bookings);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('Error fetching bookings');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [timeFilter]);

  const handleFilterChange = (filter: string) => {
    setTimeFilter(filter);
  };

  const getStatusBadge = (status: string, isCancelled: boolean) => {
    if (isCancelled) {
      return <span className="px-2 py-1 text-xs font-semibold leading-none bg-red-500/20 text-red-400 rounded-full">Cancelled</span>;
    }
    
    switch(status.toLowerCase()) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold leading-none bg-green-500/20 text-green-400 rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold leading-none bg-yellow-500/20 text-yellow-400 rounded-full">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-semibold leading-none bg-red-500/20 text-red-400 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold leading-none bg-gray-500/20 text-gray-400 rounded-full">{status}</span>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'MMM dd, yyyy hh:mm a');
  };

  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'hh:mm a');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Booking History</h2>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => handleFilterChange('week')}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeFilter === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => handleFilterChange('month')}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeFilter === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => handleFilterChange('year')}
            className={`px-4 py-2 text-sm rounded-lg ${
              timeFilter === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
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
      ) : bookings.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">No bookings found for the selected period.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stadium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booked At</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{booking.order.user.username}</div>
                    <div className="text-sm text-gray-400">{booking.order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">Stadium #{booking.slot.stadium}</div>
                    <div className="text-sm text-gray-400">
                      {formatTime(booking.slot.start_time)} - {formatTime(booking.slot.end_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {format(new Date(booking.slot.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ₹{parseFloat(booking.order.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.order.status, booking.is_cancelled)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDateTime(booking.booked_at)}
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