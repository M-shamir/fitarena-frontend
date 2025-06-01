import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface StatsData {
  total_clients: number;
  upcoming_sessions: number;
  active_plans: number;
  revenue: number;
  clients_change: number;
  sessions_today: number;
  plans_change: number;
  revenue_change: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/trainer/dashboard/stats/');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stats');
        setLoading(false);
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
            <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-1/2 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <p className="text-red-500">{error || 'Failed to load stats'}</p>
      </div>
    );
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = (value: number, isPercent = false): string => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value}${isPercent ? '%' : ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Clients Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Clients</p>
            <p className="text-2xl font-bold">{stats.total_clients}</p>
          </div>
          <div className="p-3 rounded-full bg-[#22b664]/10">
            <svg className="w-6 h-6 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
        </div>
        <p className={`text-xs ${stats.clients_change >= 0 ? 'text-green-400' : 'text-red-400'} mt-2`}>
          {formatChange(stats.clients_change)} from last month
        </p>
      </div>

      {/* Upcoming Sessions Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Upcoming Sessions</p>
            <p className="text-2xl font-bold">{stats.upcoming_sessions}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-500/10">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <p className="text-xs text-green-400 mt-2">{stats.sessions_today} today</p>
      </div>

      {/* Active Plans Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Plans</p>
            <p className="text-2xl font-bold">{stats.active_plans}</p>
          </div>
          <div className="p-3 rounded-full bg-purple-500/10">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
        <p className={`text-xs ${stats.plans_change >= 0 ? 'text-green-400' : 'text-red-400'} mt-2`}>
          {formatChange(stats.plans_change)} from last month
        </p>
      </div>

      {/* Revenue Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
          </div>
          <div className="p-3 rounded-full bg-yellow-500/10">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <p className={`text-xs ${stats.revenue_change >= 0 ? 'text-green-400' : 'text-red-400'} mt-2`}>
          {formatChange(stats.revenue_change, true)} from last month
        </p>
      </div>
    </div>
  );
}