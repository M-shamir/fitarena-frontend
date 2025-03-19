"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import DashboardContent from '@/app/stadium_owner/dashboard/page';
import UserManagementContent from '@/app/components/UserManagementContent';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const router = useRouter();
  
  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('adminToken');
    // Redirect to login page
    router.push('/admin/login');
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
              {activePage === 'dashboard' ? 'Dashboard' : 'User Management'}
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
          ) : (
            <UserManagementContent />
          )}
        </div>
      </div>
    </div>
  );
}



