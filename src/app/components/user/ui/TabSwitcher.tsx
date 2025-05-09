'use client'
import { motion } from 'framer-motion'

interface TabSwitcherProps {
  tabs: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
  activeColor?: string
}

export default function TabSwitcher({ 
  tabs, 
  activeTab, 
  setActiveTab,
  activeColor = 'bg-blue-500'
}: TabSwitcherProps) {
  return (
    <div className="inline-flex rounded-full shadow-md bg-gray-100 dark:bg-gray-800 p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-6 py-3 text-sm font-medium rounded-full transition-all ${
            activeTab === tab 
              ? 'text-white' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {activeTab === tab && (
            <motion.span
              layoutId="activeTab"
              className={`absolute inset-0 ${activeColor} rounded-full shadow-lg`}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 capitalize">
            {tab}
          </span>
        </button>
      ))}
    </div>
  )
}