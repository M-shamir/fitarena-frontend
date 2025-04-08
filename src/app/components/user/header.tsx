import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 ${montserrat.className}`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo with animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
            >
              FITARENA
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Play', 'Book', 'Train'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-lg px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-200"
              >
                Login / Signup
              </Link>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-3 pb-4"
          >
            {['Play', 'Book', 'Train'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.02 }}
                className="w-full"
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium text-lg px-4 py-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <Link
              href="/login"
              className="block mt-4 px-5 py-3 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login / Signup
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
}