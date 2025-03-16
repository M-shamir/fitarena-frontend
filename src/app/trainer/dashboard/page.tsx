"use client";
import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

// Mock data - replace with actual API calls
const mockClients = [
  { id: 1, name: "Alex Johnson", plan: "Weight Loss", nextSession: "2025-03-14", progress: 73 },
  { id: 2, name: "Jamie Smith", plan: "Muscle Building", nextSession: "2025-03-13", progress: 45 },
  { id: 3, name: "Taylor Wilson", plan: "Endurance", nextSession: "2025-03-15", progress: 89 },
  { id: 4, name: "Casey Brown", plan: "Flexibility", nextSession: "2025-03-16", progress: 62 }
];

const mockStats = {
  totalClients: 12,
  activeClients: 8,
  completedSessions: 24,
  upcomingSessions: 5,
  revenue: 1850
};

export default function StadiumOwnerDashboard() {
  const [clients, setClients] = useState(mockClients);
  const [stats, setStats] = useState(mockStats);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  
  // Simulating data fetch
  useEffect(() => {
    const fetchData = async () => {
      // Replace with actual API calls
      try {
        // const clientsResponse = await fetch('http://localhost/trainer/clients');
        // const statsResponse = await fetch('http://localhost/trainer/stats');
        // setClients(await clientsResponse.json());
        // setStats(await statsResponse.json());
        
        // Using mock data for now
        setTimeout(() => {
          setClients(mockClients);
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleLogout = () => {
    // Clear localStorage or session
    localStorage.removeItem('token');
    // Redirect to login
    router.push('/stadium_onwner/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[#22b664]">FitArena</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button onClick={() => setActiveTab('overview')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    Overview
                  </button>
                  <button onClick={() => setActiveTab('clients')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'clients' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    Clients
                  </button>
                  <button onClick={() => setActiveTab('sessions')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'sessions' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    Sessions
                  </button>
                  <button onClick={() => setActiveTab('programs')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'programs' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    Programs
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  className="bg-gray-700 p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="max-w-xs bg-gray-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <span className="h-8 w-8 rounded-full flex items-center justify-center bg-[#22b664] text-white">
                        T
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-white">Stadium Owner Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22b664]"></div>
            </div>
          ) : (
            <div className="py-4">
              {/* Stats Section */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Total Clients</dt>
                      <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalClients}</dd>
                    </dl>
                  </div>
                </div>
                
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Active Clients</dt>
                      <dd className="mt-1 text-3xl font-semibold text-white">{stats.activeClients}</dd>
                    </dl>
                  </div>
                </div>
                
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Completed Sessions</dt>
                      <dd className="mt-1 text-3xl font-semibold text-white">{stats.completedSessions}</dd>
                    </dl>
                  </div>
                </div>
                
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Upcoming Sessions</dt>
                      <dd className="mt-1 text-3xl font-semibold text-white">{stats.upcomingSessions}</dd>
                    </dl>
                  </div>
                </div>
                
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">Revenue (USD)</dt>
                      <dd className="mt-1 text-3xl font-semibold text-white">${stats.revenue}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              {/* Active Clients Section */}
              <div className="mt-8">
                <h2 className="text-lg leading-6 font-medium text-white">Active Clients</h2>
                <div className="mt-4 flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border border-gray-700 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-800">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Client
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Plan
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Next Session
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Progress
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {clients.map((client) => (
                              <tr key={client.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-[#22b664]/20 rounded-full flex items-center justify-center">
                                      <span className="text-[#22b664] font-medium">{client.name.charAt(0)}</span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-white">{client.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-300">{client.plan}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-300">{client.nextSession}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-[#22b664] h-2.5 rounded-full" style={{ width: `${client.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs text-gray-400 mt-1">{client.progress}%</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-[#22b664] hover:text-[#1da058]">
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions Section */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Add New Client</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-400">
                      <p>Create a new client profile and fitness program.</p>
                    </div>
                    <div className="mt-5">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664]"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Client
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Schedule Session</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-400">
                      <p>Create and manage training sessions with clients.</p>
                    </div>
                    <div className="mt-5">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664]"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Create Workout</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-400">
                      <p>Design custom workouts and fitness programs.</p>
                    </div>
                    <div className="mt-5">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664]"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}