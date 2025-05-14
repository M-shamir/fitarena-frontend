'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import DarkModeToggle from '../ui/DarkModeToggle';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Stadiums', href: '/user/stadiums' },
  { name: 'Trainers', href: '/user/trainers' },
  { name: 'Host', href: '/host' },
];

export default function Header({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, role, logout } = useAuthStore();

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

          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Hi, {user?.username || 'User'}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Logout
              </motion.button>
            </div>
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
              <div className="flex items-center space-x-4 pt-2">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                {isAuthenticated ? (
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Logout
                  </button>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}