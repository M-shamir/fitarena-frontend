import api from '@/utils/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const router = useRouter()
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
  const handleLogout = async () => {
    ; // Get the router instance
  
    try {
      const response = await api.post('/stadium_owner/logout/');
  
      if (response.status === 200) {
        localStorage.removeItem('auth-storage');
        router.push('/stadium_owner/login');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      
    }
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

        {/* My Stadiums */}
        <div>
          <button
            onClick={() => toggleMenu('stadiums')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.stadiums ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
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
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>Add New Stadium</span>
                </span>
              </button>
              <button 
                onClick={() => setActiveView('viewStadiums')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'viewStadiums' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>View All Stadiums</span>
                </span>
              </button>
              
              <button 
                onClick={() => setActiveView('pendingstadiums')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'pendingstadiums' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Pending Stadiums</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Manage Slots */}
        <div>
          <button
            onClick={() => toggleMenu('slots')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.slots ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
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
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>Add New Slot</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Booking Requests */}
        <div>
          <button
            onClick={() => toggleMenu('bookings')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.bookings ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <span>Booking Details</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.bookings ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.bookings && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('bookingHistory')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'bookingHistory' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>Booking History</span>
                </span>
              </button>
              <button 
                onClick={() => setActiveView('paymentStatus')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'paymentStatus' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  <span>Payment History</span>
                </span>
              </button>
             
            </div>
          )}
        </div>

        {/* Account */}
        <div>
          <button
            onClick={() => toggleMenu('account')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.account ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
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
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Profile Settings</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Help & Support */}
        {/* <div>
          <button
            onClick={() => toggleMenu('support')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.support ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span>Help & Support</span>
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
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>Contact Support</span>
                </span>
              </button>
              <button 
                onClick={() => setActiveView('rejectionReasons')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'rejectionReasons' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Rejection Reasons</span>
                </span>
              </button>
              <button 
                onClick={() => setActiveView('raiseComplaint')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'raiseComplaint' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>Submit a Complaint</span>
                </span>
              </button>
            </div>
          )}
        </div> */}

        {/* Notification Settings */}
        {/* <button
          onClick={() => setActiveView('notificationSettings')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'notificationSettings' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span>Notification Settings</span>
          </span>
        </button> */}

        {/* Revenue Reports */}
        {/* <button
          onClick={() => setActiveView('revenueReports')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'revenueReports' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Revenue Reports</span>
          </span>
        </button> */}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
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