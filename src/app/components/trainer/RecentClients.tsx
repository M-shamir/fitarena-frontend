export default function RecentClients() {
    const recentClients = [
      { id: 1, name: 'John Doe', lastSession: '2 days ago', progress: '+5%' },
      { id: 2, name: 'Sarah Smith', lastSession: '1 day ago', progress: '+3%' },
      { id: 3, name: 'Mike Johnson', lastSession: '3 days ago', progress: '+7%' },
    ];
  
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Clients</h3>
          <button className="text-sm text-[#22b664] hover:text-[#1da058] transition duration-200">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentClients.map(client => (
            <div key={client.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg border border-gray-700">
              <div className="w-10 h-10 rounded-full bg-[#22b664]/10 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{client.name}</h4>
                <p className="text-xs text-gray-400">Last session: {client.lastSession}</p>
              </div>
              <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                {client.progress}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }