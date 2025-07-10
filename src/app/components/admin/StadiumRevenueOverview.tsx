import React, { useEffect, useState } from "react";
import api from '@/utils/api';

interface StadiumOwnerRevenue {
  user_id: number;
  username: string;
  email: string;
  role: string;
  profile_id: number;
  total_earnings: string;
  number_of_orders: number;
}

const StadiumOwnerRevenueOverview: React.FC = () => {
  const [revenueData, setRevenueData] = useState<StadiumOwnerRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof StadiumOwnerRevenue; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin-api/earnings-summary/?role=stadium_owner");
      setRevenueData(response.data);
    } catch (err) {
      setError("Failed to fetch stadium owner revenue data");
      console.error("Error fetching revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key: keyof StadiumOwnerRevenue) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return revenueData;

    return [...revenueData].sort((a, b) => {
      if (sortConfig.key === 'total_earnings') {
        const numA = parseFloat(a.total_earnings);
        const numB = parseFloat(b.total_earnings);
        return sortConfig.direction === 'ascending' ? numA - numB : numB - numA;
      } else if (sortConfig.key === 'number_of_orders') {
        return sortConfig.direction === 'ascending' 
          ? a.number_of_orders - b.number_of_orders 
          : b.number_of_orders - a.number_of_orders;
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }
    });
  }, [revenueData, sortConfig]);

  const getSortIndicator = (key: keyof StadiumOwnerRevenue) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(parseFloat(value));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Stadium Owners Revenue Overview</h3>
        <button 
          onClick={fetchRevenueData}
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

      {revenueData.length === 0 && !loading && !error && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-gray-300">No revenue data found for stadium owners.</p>
        </div>
      )}

      {revenueData.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => requestSort('user_id')}
                  >
                    <div className="flex items-center">
                      ID {getSortIndicator('user_id')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => requestSort('username')}
                  >
                    <div className="flex items-center">
                      Owner {getSortIndicator('username')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email {getSortIndicator('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => requestSort('total_earnings')}
                  >
                    <div className="flex items-center">
                      Total Earnings {getSortIndicator('total_earnings')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => requestSort('number_of_orders')}
                  >
                    <div className="flex items-center">
                      Bookings {getSortIndicator('number_of_orders')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Avg. Booking Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sortedData.map((owner) => {
                  const avgOrderValue = owner.number_of_orders > 0 
                    ? parseFloat(owner.total_earnings) / owner.number_of_orders 
                    : 0;
                  
                  return (
                    <tr key={owner.user_id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{owner.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{owner.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{owner.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">
                        {formatCurrency(owner.total_earnings)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          owner.number_of_orders > 0 ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {owner.number_of_orders} bookings
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {owner.number_of_orders > 0 ? formatCurrency(avgOrderValue.toString()) : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-700">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                    Totals
                  </td>
                  <td className="px-6 py-3 text-green-400 font-medium">
                    {formatCurrency(
                      revenueData.reduce((sum, owner) => sum + parseFloat(owner.total_earnings), 0).toString()
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-300">
                    {revenueData.reduce((sum, owner) => sum + owner.number_of_orders, 0)} bookings
                  </td>
                  <td className="px-6 py-3 text-gray-300">
                    {revenueData.some(o => o.number_of_orders > 0) ? 
                      formatCurrency(
                        (revenueData.reduce((sum, owner) => sum + parseFloat(owner.total_earnings), 0) / 
                        revenueData.reduce((sum, owner) => sum + (owner.number_of_orders || 0), 0)).toString()
                      ) : 'N/A'
                    }
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StadiumOwnerRevenueOverview;