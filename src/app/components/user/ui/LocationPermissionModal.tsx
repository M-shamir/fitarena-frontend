'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiX } from 'react-icons/fi';

export default function LocationPermissionModal({
  isOpen,
  onAllow,
  onDeny
}: {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative"
          >
            <div className="flex items-center justify-center mb-4">
              <FiMapPin className="text-blue-500 text-3xl mr-2" />
              <h2 className="text-xl font-bold">Enable Location Services</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Allow Fitarena to access your location to find stadiums near you and provide personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onAllow}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Allow Location Access
              </button>
              <button
                onClick={onDeny}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors"
              >
                Not Now
              </button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              You can change this later in your browser settings.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}