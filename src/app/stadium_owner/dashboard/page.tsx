"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '@/app/components/stadium_owner/Sidebar';
import StadiumPendingApprovals from '@/app/components/stadium_owner/StadiumPendingApprovals';
import AddStadiumForm from '@/app/components/stadium_owner/AddStadiumForm';
import StadiumApprovedSlots from '@/app/components/stadium_owner/AddSlot';
import ApprovedStadiums from '@/app/components/stadium_owner/ApprovedStadium';
import BookingHistory from '@/app/components/stadium_owner/BookingHistory';
import StadiumPaymentHistory from '@/app/components/stadium_owner/StadiumPaymentHistory';
import StadiumOwnerDashboard from '@/app/components/stadium_owner/StadiumOwnerDashboard';
import StadiumOwnerProfile from '@/app/components/stadium_owner/StadiumOwnerProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { setupNotificationSocket } from '@/utils/websocket';
import api from '@/utils/api';
import useAuthStore from "@/store/authStore";

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

export default function OwnerDashboard() {
  const [activeView, setActiveView] = useState('dashboardOverview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuthStore();
  
  const displayName = user?.username 
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'Owner';

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();

    // Setup WebSocket connection
    const handleNewNotification = (message: string) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        text: message,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    };

    setupNotificationSocket(handleNewNotification);

    return () => {
      // Cleanup if needed
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read/`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all/');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

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
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-700 transition duration-200 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-700"
                  >
                    <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold">Notifications</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <p className="text-sm">{notification.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#22b664]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="text-sm">{displayName}</span>
            </div>
          </div>
        </header>


        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {activeView === 'dashboardOverview' && <StadiumOwnerDashboard />}
          

          {activeView === 'addStadium' && <AddStadiumForm setActiveView={setActiveView} />}
          {activeView === 'pendingstadiums' && <StadiumPendingApprovals />}
          
          
         {activeView === 'viewStadiums' && <ApprovedStadiums />}
          {/* {activeView === 'viewStadiums' && <ViewStadiums />}
          {activeView === 'editStadium' && <EditStadium />}
          {activeView === 'stadiumVerification' && <StadiumVerification />} */}
          
           {activeView === 'addSlot' && <StadiumApprovedSlots />}
           {activeView === 'bookingHistory' && <BookingHistory />}
           {activeView === 'paymentStatus' && <StadiumPaymentHistory />}
           {activeView === 'profileSettings' && <StadiumOwnerProfile />}
          
          {/* {activeView === 'addSlot' && <AddSlotForm />}
          {activeView === 'manageSlots' && <ManageSlots />}
          {activeView === 'slotBookingSummary' && <SlotBookingSummary />}
          

          
          
          
          {activeView === 'upcomingBookings' && <UpcomingBookings />}
          
      
          
          
          {activeView === 'supportChat' && <SupportChat />}
          {activeView === 'rejectionReasons' && <RejectionReasons />}
          {activeView === 'raiseComplaint' && <RaiseComplaint />}
          
          
          {activeView === 'notificationSettings' && <NotificationSettings />} */}
        </main>
      </div>
    </div>
   
  );
}