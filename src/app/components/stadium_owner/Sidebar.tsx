import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    stadiums: false,
    slots: false,
    bookings: false,
    account: false,
    support: false
  });

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#22b664]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">Stadium Owner</p>
            <p className="text-xs text-gray-400">Premium Partner</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Dashboard */}
        <div>
          <button
            onClick={() => toggleMenu('dashboard')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.dashboard ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>Dashboard</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.dashboard ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.dashboard && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('dashboardOverview')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'dashboardOverview' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                Overview
              </button>
            </div>
          )}
        </div>

        {/* 🏟️ My Stadiums */}
        <div>
          <button
            onClick={() => toggleMenu('stadiums')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.stadiums ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <span className="w-5 h-5 text-gray-400">🏟️</span>
              <span>My Stadiums</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.stadiums ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.stadiums && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('addStadium')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'addStadium' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ➕ Add New Stadium
              </button>
              <button 
                onClick={() => setActiveView('viewStadiums')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'viewStadiums' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📋 View All Stadiums
              </button>
              <button 
                onClick={() => setActiveView('editStadium')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'editStadium' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ✏️ Edit/Delete Stadium
              </button>
              <button 
                onClick={() => setActiveView('stadiumStatus')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'stadiumStatus' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                🚦 Status (Pending, Approved, Rejected)
              </button>
              <button 
                onClick={() => setActiveView('stadiumVerification')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'stadiumVerification' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📍 Stadium Verification Info
              </button>
            </div>
          )}
        </div>

        {/* 📅 Manage Slots */}
        <div>
          <button
            onClick={() => toggleMenu('slots')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.slots ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <span className="w-5 h-5 text-gray-400">📅</span>
              <span>Manage Slots</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.slots ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.slots && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('addSlot')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'addSlot' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ➕ Add New Slot
              </button>
              <button 
                onClick={() => setActiveView('manageSlots')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'manageSlots' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ⏰ View/Edit Slots
              </button>
              <button 
                onClick={() => setActiveView('blockSlots')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'blockSlots' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                🚫 Block/Unblock Slots
              </button>
              <button 
                onClick={() => setActiveView('slotBookingSummary')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'slotBookingSummary' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📊 Slot Booking Summary
              </button>
            </div>
          )}
        </div>

        {/* 📥 Booking Requests */}
        <div>
          <button
            onClick={() => toggleMenu('bookings')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.bookings ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <span className="w-5 h-5 text-gray-400">📥</span>
              <span>Booking Requests</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.bookings ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.bookings && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('bookingRequests')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'bookingRequests' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ✅ Approve / ❌ Reject Booking
              </button>
              <button 
                onClick={() => setActiveView('bookingHistory')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'bookingHistory' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📈 Booking History
              </button>
              <button 
                onClick={() => setActiveView('paymentStatus')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'paymentStatus' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                💳 Payment Status
              </button>
              <button 
                onClick={() => setActiveView('upcomingBookings')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'upcomingBookings' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ⏱️ Upcoming Bookings
              </button>
            </div>
          )}
        </div>

        {/* 🔐 Account */}
        <div>
          <button
            onClick={() => toggleMenu('account')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.account ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <span className="w-5 h-5 text-gray-400">🔐</span>
              <span>Account</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.account ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.account && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('profileSettings')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'profileSettings' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                Profile Settings
              </button>
            </div>
          )}
        </div>

        {/* 📮 Support */}
        <div>
          <button
            onClick={() => toggleMenu('support')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.support ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <span className="w-5 h-5 text-gray-400">📮</span>
              <span>Support</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.support ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.support && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('supportChat')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'supportChat' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                💬 Chat with Admin / Support
              </button>
              <button 
                onClick={() => setActiveView('rejectionReasons')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'rejectionReasons' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📄 View Rejection Reasons
              </button>
              <button 
                onClick={() => setActiveView('raiseComplaint')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'raiseComplaint' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📩 Raise a Complaint or Query
              </button>
            </div>
          )}
        </div>

        {/* ⚙️ Settings */}
        <button
          onClick={() => setActiveView('notificationSettings')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'notificationSettings' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <span className="w-5 h-5 text-gray-400">⚙️</span>
            <span>Notification Settings</span>
          </span>
        </button>

        {/* Revenue Reports */}
        <button
          onClick={() => setActiveView('revenueReports')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'revenueReports' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Revenue Reports</span>
          </span>
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={() => setActiveView('logout')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}