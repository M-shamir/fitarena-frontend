"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { format } from 'date-fns';
import { FaRupeeSign, FaCalendarAlt, FaMoneyBillWave, FaHistory, FaFilePdf } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import 'jspdf-autotable';

interface Payment {
  id: number;
  stadium_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  payment_date: string;
  stadium_id: number;
  slot_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  refund_amount?: number;
  refunded_at?: string;
}

interface EarningsSummary {
  this_week: number;
  this_month: number;
  all_time: number;
}

const StadiumPaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>({ 
    this_week: 0, 
    this_month: 0, 
    all_time: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'completed' | 'refunded'>('completed');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/stadium_owner/payment-history/?filter=${activeTab}`);
        setPayments(response.data.payment_history);
        setEarnings(response.data.earnings_summary);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payment history');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPaymentHistory();
  }, [activeTab]);

  const generatePDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      const autoTable = await import('jspdf-autotable');
      
      // Initialize jsPDF
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text(`Stadium Booking History Report (${activeTab === 'completed' ? 'Completed' : 'Refunded'})`, 14, 20);
      
      // Summary Section
      doc.setFontSize(12);
      doc.text('Earnings Summary', 14, 35);
      
      // Summary Table
      autoTable.default(doc, {
        startY: 40,
        head: [['Period', 'Amount (₹)']],
        body: [
          ['This Week', earnings.this_week.toLocaleString('en-IN')],
          ['This Month', earnings.this_month.toLocaleString('en-IN')],
          ['All Time', earnings.all_time.toLocaleString('en-IN')],
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [34, 182, 100],
          textColor: 255
        }
      });
      
      // Transactions Section
      doc.text('Booking History', 14, (doc as unknown).lastAutoTable.finalY + 15);
      
      // Transactions Table
      autoTable.default(doc, {
        startY: (doc as unknown).lastAutoTable.finalY + 20,
        head: activeTab === 'completed' 
          ? [['Date', 'Stadium', 'Slot Details', 'Customer', 'Amount (₹)', 'Status']]
          : [['Date', 'Stadium', 'Slot Details', 'Customer', 'Amount (₹)', 'Refunded At', 'Refund Amount']],
        body: activeTab === 'completed' 
          ? payments.map(payment => [
              format(new Date(payment.payment_date), 'dd MMM yyyy'), 
              payment.stadium_name,
              `${format(new Date(payment.slot_date), 'dd MMM yyyy')}\n${payment.start_time} - ${payment.end_time}`,
              payment.customer_email,
              payment.amount.toLocaleString('en-IN'),
              'Completed'
            ])
          : payments.map(payment => [
              format(new Date(payment.payment_date), 'dd MMM yyyy'), 
              payment.stadium_name,
              `${format(new Date(payment.slot_date), 'dd MMM yyyy')}\n${payment.start_time} - ${payment.end_time}`,
              payment.customer_email,
              payment.amount.toLocaleString('en-IN'),
              payment.refunded_at ? format(new Date(payment.refunded_at), 'dd MMM yyyy hh:mm a') : 'N/A',
              payment.refund_amount ? payment.refund_amount.toLocaleString('en-IN') : 'N/A'
            ]),
        theme: 'grid',
        headStyles: {
          fillColor: [34, 182, 100],
          textColor: 255
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: activeTab === 'completed' 
          ? {
              0: { cellWidth: 25 },
              1: { cellWidth: 40 },
              2: { cellWidth: 40 },
              3: { cellWidth: 45 },
              4: { cellWidth: 25 },
              5: { cellWidth: 20 }
            }
          : {
              0: { cellWidth: 25 },
              1: { cellWidth: 30 },
              2: { cellWidth: 35 },
              3: { cellWidth: 40 },
              4: { cellWidth: 25 },
              5: { cellWidth: 30 },
              6: { cellWidth: 25 }
            }
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }
      
      doc.save(`stadium_booking_history_${activeTab}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22b664]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl min-h-screen border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Stadium Booking History</h1>
        <button 
          onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 bg-[#22b664] hover:bg-[#1da058] text-white rounded-md transition-colors"
        >
          <FaFilePdf /> Download PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-600 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'completed' ? 'text-[#22b664] border-b-2 border-[#22b664]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'refunded' ? 'text-[#22b664] border-b-2 border-[#22b664]' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('refunded')}
        >
          Refunded
        </button>
      </div>
      
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Weekly Earnings */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">This Week</p>
              <p className="text-2xl font-bold text-white mt-1">
                <FaRupeeSign className="inline mr-1" />
                {earnings.this_week.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-full">
              <BsGraphUp className="text-blue-400 text-xl" />
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            <FaCalendarAlt className="inline mr-1" />
            {format(new Date(), 'MMM d, yyyy')} - {format(new Date(new Date().setDate(new Date().getDate() - 7)), 'MMM d, yyyy')}
          </p>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-white mt-1">
                <FaRupeeSign className="inline mr-1" />
                {earnings.this_month.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-400 text-xl" />
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            <FaCalendarAlt className="inline mr-1" />
            {format(new Date(), 'MMMM yyyy')}
          </p>
        </div>

        {/* All Time Earnings */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">All Time</p>
              <p className="text-2xl font-bold text-white mt-1">
                <FaRupeeSign className="inline mr-1" />
                {earnings.all_time.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-full">
              <FaHistory className="text-purple-400 text-xl" />
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            <FaCalendarAlt className="inline mr-1" />
            Since account creation
          </p>
        </div>
      </div>

      {/* Booking History Table */}
      <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-600">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <FaHistory className="mr-2 text-[#22b664]" />
            {activeTab === 'completed' ? 'Completed Bookings' : 'Refunded Bookings'}
          </h2>
          <p className="text-sm text-gray-300">
            {payments.length} booking{payments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stadium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Slot Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                {activeTab === 'refunded' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Refunded At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Refund Amount</th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-700/30 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {format(new Date(payment.payment_date), 'dd MMM yyyy')}
                      </div>
                      <div className="text-sm text-gray-400">
                        {format(new Date(payment.payment_date), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{payment.stadium_name}</div>
                      <div className="text-sm text-gray-400">ID: {payment.stadium_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {format(new Date(payment.slot_date), 'dd MMM yyyy')}
                      </div>
                      <div className="text-sm text-gray-400">
                        {payment.start_time} - {payment.end_time}
                      </div>
                      <div className="text-xs text-gray-500">
                        Slot ID: {payment.slot_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{payment.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        <FaRupeeSign className="inline mr-1" />
                        {payment.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    {activeTab === 'refunded' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {payment.refunded_at ? format(new Date(payment.refunded_at), 'dd MMM yyyy') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {payment.refunded_at ? format(new Date(payment.refunded_at), 'hh:mm a') : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            <FaRupeeSign className="inline mr-1" />
                            {payment.refund_amount ? payment.refund_amount.toLocaleString('en-IN') : 'N/A'}
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activeTab === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {activeTab === 'completed' ? 'Completed' : 'Refunded'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'completed' ? 6 : 8} className="px-6 py-4 text-center text-sm text-gray-400">
                    No {activeTab} bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StadiumPaymentHistory;