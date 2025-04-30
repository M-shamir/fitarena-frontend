import React from "react";

const DashboardContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white mb-6">Dashboard Overview</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Users", count: 1284, color: "blue", icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" },
          { title: "New Users", count: 32, color: "green", icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" },
          { title: "Active Subscriptions", count: 879, color: "purple", icon: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" },
        ].map(({ title, count, color, icon }) => (
          <div key={title} className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className={`bg-${color}-500/20 p-3 rounded-full`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${color}-500`} viewBox="0 0 20 20" fill="currentColor">
                  <path d={icon} />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-gray-400 text-sm">{title}</h4>
                <p className="text-2xl font-semibold text-white">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mt-6">
        <h4 className="text-white text-lg font-semibold mb-4">Recent Activity</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                {["User", "Action", "Time"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[
                { user: "John Smith", action: "Created account", time: "5 minutes ago" },
                { user: "Sarah Connor", action: "Updated profile", time: "1 hour ago" },
                { user: "Mike Johnson", action: "Purchased premium plan", time: "3 hours ago" },
              ].map(({ user, action, time }) => (
                <tr key={user}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
