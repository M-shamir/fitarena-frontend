"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import DashboardContent from '@/app/stadium_owner/dashboard/page';
import UserManagementContent from '@/app/components/UserManagementContent';
import PendingTrainers from '@/app/components/PendingTrainers';
import ApprovedTrainers from '@/app/components/ApprovedTrainers';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [trainerDropdownOpen, setTrainerDropdownOpen] = useState(false);
  const router = useRouter();
  
  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('adminToken');
    // Redirect to login page
    router.push('/admin/login');
  };

  const toggleTrainerDropdown = () => {
    setTrainerDropdownOpen(!trainerDropdownOpen);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-[#22b664]">FitArena</h1>
        </div>
        <div className="px-4 py-6">
          <p className="text-gray-400 text-sm mb-4">Admin Panel</p>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`flex items-center px-4 py-3 text-sm rounded-lg w-full ${
                activePage === 'dashboard' 
                  ? 'bg-[#22b664] text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </button>
            
            <button
              onClick={() => setActivePage('users')}
              className={`flex items-center px-4 py-3 text-sm rounded-lg w-full ${
                activePage === 'users' 
                  ? 'bg-[#22b664] text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              User Management
            </button>
            
            {/* Trainer Management Dropdown */}
            <div className="relative">
              <button
                onClick={toggleTrainerDropdown}
                className={`flex items-center justify-between px-4 py-3 text-sm rounded-lg w-full ${
                  activePage === 'pendingTrainers' || activePage === 'approvedTrainers'
                    ? 'bg-[#22b664] text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Trainer Management
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-200 ${trainerDropdownOpen ? 'transform rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Items */}
              {trainerDropdownOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => setActivePage('pendingTrainers')}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg w-full ${
                      activePage === 'pendingTrainers' 
                        ? 'bg-[#1a8d4d] text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Pending Trainers
                  </button>
                  
                  <button
                    onClick={() => setActivePage('approvedTrainers')}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg w-full ${
                      activePage === 'approvedTrainers' 
                        ? 'bg-[#1a8d4d] text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Approved Trainers
                  </button>
                </div>
              )}
            </div>
          </nav>
          
          <div className="pt-8 mt-8 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm rounded-lg w-full text-gray-300 hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-8 5a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <div className="bg-gray-800 shadow-md border-b border-gray-700">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              {activePage === 'dashboard' ? 'Dashboard' : 
               activePage === 'users' ? 'User Management' : 
               activePage === 'pendingTrainers' ? 'Pending Trainers' : 'Approved Trainers'}
            </h2>
            <div className="flex items-center">
              <span className="bg-[#22b664] p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.021A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="ml-2 text-white">Admin</span>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-6 bg-gray-900 min-h-screen">
          {activePage === 'dashboard' ? (
            <DashboardContent />
          ) : activePage === 'users' ? (
            <UserManagementContent />
          ) : activePage === 'pendingTrainers' ? (
            <PendingTrainers />
          ) : (
            <ApprovedTrainers />
          )}
        </div>
      </div>
    </div>
  );
}