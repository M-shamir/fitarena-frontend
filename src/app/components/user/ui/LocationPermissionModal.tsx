'use client'
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative border border-gray-100 dark:border-gray-700"
          >
            <button 
              onClick={onDeny}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <FiX className="text-gray-500 dark:text-gray-400 text-lg" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                <FiMapPin className="text-green-500 dark:text-green-400 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Nearby Stadiums
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Enable location access to find the best stadiums in your area
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onAllow}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Allow Location Access
              </button>
              <button
                onClick={onDeny}
                className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all border border-gray-200 dark:border-gray-600"
              >
                Maybe Later
              </button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Your location helps us provide personalized recommendations. You can change permissions anytime in settings.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}