'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiBell } from 'react-icons/fi';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { setupNotificationSocket} from '@/utils/websocket';
import api from '@/utils/api';

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Stadiums', href: '/user/stadiums' },
  { name: 'Trainers', href: '/user/trainers' },
  { name: 'Host', href: '/host' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAuthenticated } = useAuthStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!isAuthenticated) return;

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
      // Don't close the socket here - let it persist across navigation
      // closeNotificationSocket();
    };
  }, [isAuthenticated]);

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
    <nav className="fixed w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Fitarena
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex space-x-8"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition relative"
                aria-label="Notifications"
              >
                <FiBell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${
                      !notification.read ? 'bg-green-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-200">{notification.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications yet
                </div>
              )}
            </div>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
              <button 
                onClick={markAllAsRead}
                className="text-sm text-green-500 hover:text-green-600 dark:hover:text-green-400"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            </div>


            {isAuthenticated ? (
              <Link href="/user/profile">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-1 rounded-full border-2 border-white dark:border-gray-800">
                      <FiUser className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <Link href="/user/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition relative"
                  aria-label="Notifications"
                >
                  <FiBell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>


                {isAuthenticated ? (
                  <Link 
                    href="/user/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">Profile</span>
                  </Link>
                ) : (
                  <Link 
                    href="/user/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile notifications dropdown */}
              {showNotifications && (
  <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
    </div>
    <div className="max-h-60 overflow-y-auto">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer ${
              !notification.read ? 'bg-green-50 dark:bg-gray-700' : ''
            }`}
          >
            <p className="text-sm text-gray-700 dark:text-gray-200">{notification.text}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No notifications yet
        </div>
      )}
    </div>
    <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
      <button 
        onClick={markAllAsRead}
        className="text-sm text-green-500 hover:text-green-600 dark:hover:text-green-400"
      >
        Mark all as read
      </button>
    </div>
  </div>
)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}