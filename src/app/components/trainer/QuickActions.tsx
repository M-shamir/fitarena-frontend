export default function QuickActions() {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-700 flex flex-col items-center transition duration-200">
            <div className="w-10 h-10 rounded-full bg-[#22b664]/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <span className="text-sm">Add Session</span>
          </button>
          <button className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-700 flex flex-col items-center transition duration-200">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <span className="text-sm">Add Client</span>
          </button>
          <button className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-700 flex flex-col items-center transition duration-200">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <span className="text-sm">Create Plan</span>
          </button>
          <button className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-700 flex flex-col items-center transition duration-200">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <span className="text-sm">Nutrition Plan</span>
          </button>
        </div>
      </div>
    );
  }