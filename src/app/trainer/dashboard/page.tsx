"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '@/app/components/auth/ProtectedRoute';
import Sidebar from '@/app/components/trainer/Sidebar';
import DashboardOverview from '@/app/components/trainer/DashboardOverview';
import AddSessionForm from '@/app/components/trainer/AddSessionForm';
import PendingApprovals from '@/app/components/trainer/PendingApprovals';
import ApprovedSessions from '@/app/components/trainer/ApprovedSessions';
import TrainerProfileView from '@/app/components/trainer/TrainerProfileView';
import CourseEnrollments from '@/app/components/trainer/CourseEnrollments';
import LiveSessions from '@/app/components/trainer/LiveSessions';
import PaymentHistory from '@/app/components/trainer/PaymentHistory';
import useAuthStore from "@/store/authStore";
import { motion, AnimatePresence } from 'framer-motion';
import { setupNotificationSocket } from '@/utils/websocket';
import api from '@/utils/api';
import TrainerProfileEdit from '@/app/components/trainer/TrainerProfileEdit';

interface Notification {
  id: number;
  message: string;
  created_at: string;
  time: string;
  read: boolean;
  related_url: string | null;
}
interface WebSocketNotification {
  id: number;
  message: string;
  created_at: string;
  time: string;
  read: boolean;
  related_url: string | null;
}


export default function TrainerDashboard() {
  const [activeView, setActiveView] = useState('dashboardOverview');
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const displayName = user?.username 
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : 'Trainer';

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
    const handleNewNotification = (notificationData: WebSocketNotification) => {
      const newNotification: Notification = {
        id: notificationData.id,
        message: notificationData.message,
        created_at: notificationData.created_at,
        time: notificationData.time,
        read: notificationData.read,
        related_url: notificationData.related_url
      };
      setNotifications(prev => [newNotification, ...prev]);
    };

    setupNotificationSocket(handleNewNotification);

    return () => {
      // Cleanup if needed
    };
  }, [user]);

  const markAsRead = async (id: number) => {
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

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.related_url) {
      // Handle navigation to related URL if needed
      // window.location.href = notification.related_url;
    }
  };

  return (
    <ProtectedRoute requiredRole="trainer" redirectTo="/trainer/login">
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
        <Head>
          <title>Trainer Dashboard | FitArena</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Trainer Dashboard</h1>
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
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <p className="text-sm">{notification.message}</p>
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
            {activeView === 'dashboardOverview' && <DashboardOverview />}
            {activeView === 'addSession' && <AddSessionForm setActiveView={setActiveView} />}
            {activeView === 'pendingApprovals' && <PendingApprovals />}
            {activeView === 'approvedSessions' && <ApprovedSessions />}
            {activeView === 'viewProfile' && <TrainerProfileView/>}
            {activeView === 'courseEnrollments' && <CourseEnrollments/>}
            {activeView === 'liveSessions' && <LiveSessions/>}
            {activeView === 'paymentHistory' && <PaymentHistory/>}
            {activeView === 'editProfile' && <TrainerProfileEdit/>}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}