"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface PaymentHistoryItem {
  id: number;
  stadium_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  customer_email: string;
  amount: number;
  currency: string;
  payment_date: string;
  stadium_id: number;
  slot_id: number;
}

interface EarningsSummary {
  this_week: number;
  this_month: number;
  all_time: number;
}

interface PaymentHistoryResponse {
  payment_history: PaymentHistoryItem[];
  earnings_summary: EarningsSummary;
}

export default function StadiumOwnerDashboard() {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<PaymentHistoryResponse>('stadium_owner/payment-history/');
      setPaymentHistory(response.data.payment_history);
      setEarningsSummary(response.data.earnings_summary);
    } catch (err) {
      setError("Failed to fetch payment history. Please try again.");
      console.error("Error fetching payment history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const time = timeString.split(':');
    return `${time[0]}:${time[1]}`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Payment Dashboard</h2>
        <button 
          onClick={fetchPaymentHistory}
          disabled={loading}
          className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {loading && !earningsSummary ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => {
              setError(null);
              fetchPaymentHistory();
            }} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          {/* Earnings Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">This Week</p>
                  <p className="text-xl font-semibold text-white">
                    {earningsSummary ? formatCurrency(earningsSummary.this_week, 'inr') : '₹0'}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">This Month</p>
                  <p className="text-xl font-semibold text-white">
                    {earningsSummary ? formatCurrency(earningsSummary.this_month, 'inr') : '₹0'}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-green-500/20">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">All Time</p>
                  <p className="text-xl font-semibold text-white">
                    {earningsSummary ? formatCurrency(earningsSummary.all_time, 'inr') : '₹0'}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-gray-700/30 rounded-lg border border-gray-600 overflow-hidden">
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            </div>
            
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">No transactions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Your payment history will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stadium</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Slot</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-600">
                    {paymentHistory.map((payment) => (
                      <tr key={`${payment.id}-${payment.slot_id}`} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{payment.stadium_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {formatDate(payment.slot_date)} • {formatTime(payment.start_time)} - {formatTime(payment.end_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{payment.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{formatDate(payment.payment_date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-green-400">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}