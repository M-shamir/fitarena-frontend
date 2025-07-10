import api from '@/utils/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    schedule: false,
    bookings: false,
    payments: false,
    reviews: false,
    profile: false
  });
  const { user} = useAuthStore();
  const displayName = user?.username 
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'Trainer Name';

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };
  const handleLogout = async () => {
    ; // Get the router instance
  
    try {
      const response = await api.post('/trainer/logout/');
  
      if (response.status === 200) {
        localStorage.removeItem('auth-storage');
        router.push('/trainer/login');
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
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-gray-400">Professional Trainer</p>
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
              <button 
                onClick={() => setActiveView('courseEnrollments')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'courseEnrollments' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                🧑‍🎓 Course Enrollments
              </button>
              <button 
                onClick={() => setActiveView('liveSessions')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'liveSessions' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                🎥 Live Sessions
              </button>
              {/* <button 
                onClick={() => setActiveView('attendance')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'attendance' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📊 Attendance Reports
              </button> */}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div>
          <button
            onClick={() => toggleMenu('schedule')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.schedule ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Schedule</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.schedule ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.schedule && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('approvedSessions')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'approvedSessions' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ✅ Approved Sessions
              </button>
              <button 
                onClick={() => setActiveView('pendingApprovals')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'pendingApprovals' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                🕓 Pending Approvals
              </button>
              {/* <button 
                onClick={() => setActiveView('upcomingSessions')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'upcomingSessions' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                📅 Upcoming Sessions
              </button> */}
              <button 
                onClick={() => setActiveView('addSession')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'addSession' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                ➕ Add New Session
              </button>
            </div>
          )}
        </div>



        

        {/* Payments */}
        <div>
          <button
            onClick={() => toggleMenu('payments')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.payments ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span>Payments</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.payments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.payments && (
            <div className="pl-8 mt-1 space-y-1">
              {/* <button 
                onClick={() => setActiveView('earnings')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'earnings' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                Earnings Overview
              </button> */}
            
              <button 
                onClick={() => setActiveView('paymentHistory')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'paymentHistory' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                Payment History
              </button>
            </div>
          )}
        </div>

        {/* Reviews */}
        {/* <button
          onClick={() => setActiveView('reviews')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'reviews' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <span>Reviews & Ratings</span>
          </span>
        </button> */}

        {/* Notifications */}
        {/* <button
          onClick={() => setActiveView('notifications')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'notifications' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span>Notifications</span>
          </span>
        </button> */}

        {/* Profile */}
        <div>
          <button
            onClick={() => toggleMenu('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-lg ${openMenus.profile ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
          >
            <span className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Profile</span>
            </span>
            <svg className={`w-4 h-4 text-gray-400 transform transition duration-200 ${openMenus.profile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {openMenus.profile && (
            <div className="pl-8 mt-1 space-y-1">
              <button 
                onClick={() => setActiveView('viewProfile')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'viewProfile' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                View Profile
              </button>
              <button 
                onClick={() => setActiveView('editProfile')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'editProfile' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                Edit Profile
              </button>
              {/* <button 
                onClick={() => setActiveView('changePassword')}
                className={`block w-full text-left p-2 rounded-lg ${activeView === 'changePassword' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200 text-sm`}
              >
                Change Password
              </button> */}
            </div>
          )}
        </div>

        {/* Help & Support */}
        <button
          onClick={() => setActiveView('help')}
          className={`w-full flex items-center p-3 rounded-lg ${activeView === 'help' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-200`}
        >
          <span className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span>Help & Support</span>
          </span>
        </button>
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