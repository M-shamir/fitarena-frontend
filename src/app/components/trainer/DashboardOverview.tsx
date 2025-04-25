import StatsCards from './StatsCards';
import UpcomingSessions from './UpcomingSessions';
import RecentClients from './RecentClients';
import QuickActions from './QuickActions';

export default function DashboardOverview() {
  return (
    <>
      <div className="bg-gradient-to-r from-[#22b664]/20 to-[#22b664]/10 rounded-xl p-6 mb-6 border border-[#22b664]/30">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Trainer!</h2>
        <p className="text-gray-400">You have 5 sessions scheduled today. Let's make it a great day!</p>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingSessions />
        <RecentClients />
      </div>

      <QuickActions />
    </>
  );
}