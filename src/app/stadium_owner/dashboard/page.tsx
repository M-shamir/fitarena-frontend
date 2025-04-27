"use client";
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/stadium_owner/Sidebar';
// import DashboardOverview from '@/app/components/owner/DashboardOverview';
// import AddStadiumForm from '@/app/components/owner/AddStadiumForm';
// import ViewStadiums from '@/app/components/owner/ViewStadiums';
// import EditStadium from '@/app/components/owner/EditStadium';
// import StadiumVerification from '@/app/components/owner/StadiumVerification';
// import AddSlotForm from '@/app/components/owner/AddSlotForm';
// import ManageSlots from '@/app/components/owner/ManageSlots';
// import BookingRequests from '@/app/components/owner/BookingRequests';
// import BookingHistory from '@/app/components/owner/BookingHistory';
// import PaymentStatus from '@/app/components/owner/PaymentStatus';
// import UpcomingBookings from '@/app/components/owner/UpcomingBookings';
// import ProfileSettings from '@/app/components/owner/ProfileSettings';
// import SupportChat from '@/app/components/owner/SupportChat';
// import RejectionReasons from '@/app/components/owner/RejectionReasons';
// import RaiseComplaint from '@/app/components/owner/RaiseComplaint';
// import NotificationSettings from '@/app/components/owner/NotificationSettings';

export default function OwnerDashboard() {
  const [activeView, setActiveView] = useState('dashboardOverview');
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Head>
        <title>Stadium Owner Dashboard | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Stadium Owner Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700 transition duration-200">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#22b664]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="text-sm">Owner Name</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {/* {activeView === 'dashboardOverview' && <DashboardOverview />} */}
          

          {/* {activeView === 'addStadium' && <AddStadiumForm setActiveView={setActiveView} />}
          {activeView === 'viewStadiums' && <ViewStadiums />}
          {activeView === 'editStadium' && <EditStadium />}
          {activeView === 'stadiumVerification' && <StadiumVerification />} */}
          
          
          {/* {activeView === 'addSlot' && <AddSlotForm />}
          {activeView === 'manageSlots' && <ManageSlots />}
          {activeView === 'slotBookingSummary' && <SlotBookingSummary />}
          

          {activeView === 'bookingRequests' && <BookingRequests />}
          {activeView === 'bookingHistory' && <BookingHistory />}
          {activeView === 'paymentStatus' && <PaymentStatus />}
          {activeView === 'upcomingBookings' && <UpcomingBookings />}
          
      
          {activeView === 'profileSettings' && <ProfileSettings />}
          
          {activeView === 'supportChat' && <SupportChat />}
          {activeView === 'rejectionReasons' && <RejectionReasons />}
          {activeView === 'raiseComplaint' && <RaiseComplaint />}
          
          
          {activeView === 'notificationSettings' && <NotificationSettings />} */}
        </main>
      </div>
    </div>
  );
}