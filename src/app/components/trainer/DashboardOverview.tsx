import StatsCards from './StatsCards';
import UpcomingSessions from './UpcomingSessions';
import RecentClients from './RecentClients';
import useAuthStore from '@/store/authStore';


export default function DashboardOverview() {
  const { user} = useAuthStore();
  const displayName = user?.username 
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'Trainer';
  
  
  return (
    <>
      <div className="bg-gradient-to-r from-[#22b664]/20 to-[#22b664]/10 rounded-xl p-6 mb-6 border border-[#22b664]/30">
      <h2 className="text-2xl font-bold mb-2">Welcome back, {displayName}!</h2>
        <p className="text-gray-400">You have 5 sessions scheduled today. Let&apos;s make it a great day!</p>      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingSessions />
        <RecentClients />
      </div>

    </>
  );
}