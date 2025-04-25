export default function UpcomingSessions() {
    const upcomingSessions = [
      { id: 1, client: 'John Doe', time: '10:00 AM - 11:00 AM', type: 'Personal Training' },
      { id: 2, client: 'Sarah Smith', time: '4:00 PM - 5:00 PM', type: 'Yoga Session' },
    ];
  
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
          <button className="text-sm text-[#22b664] hover:text-[#1da058] transition duration-200">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {upcomingSessions.map(session => (
            <div key={session.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{session.client}</h4>
                  <p className="text-sm text-gray-400">{session.type}</p>
                </div>
                <span className="px-3 py-1 bg-[#22b664]/10 text-[#22b664] text-xs rounded-full">
                  {session.time}
                </span>
              </div>
              <div className="flex space-x-2 mt-3">
                <button className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full transition duration-200">
                  Details
                </button>
                <button className="text-xs px-3 py-1 bg-[#22b664] hover:bg-[#1da058] rounded-full transition duration-200">
                  Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }