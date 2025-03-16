"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


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

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
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
    localStorage.removeItem('token');
    router.push('/trainer/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-[#22b664]">FitArena</h1>
            <div className="flex space-x-4">
              {['overview', 'clients', 'sessions', 'programs'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white mb-4">Trainer Dashboard</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#22b664]"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="bg-gray-800 shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">{key.replace(/([A-Z])/g, ' $1')}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-white">{value}</dd>
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Next Session</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{client.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{client.plan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{client.nextSession}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{client.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'clients' && (
              <div className="text-gray-400 text-center py-10">
                <p className="text-lg">No data available for "{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}" yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
