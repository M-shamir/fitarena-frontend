'use client'
import { motion } from 'framer-motion'

interface TabSwitcherProps {
  tabs: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
  activeColor?: string
  className?: string
}

export default function TabSwitcher({
  tabs,
  activeTab,
  setActiveTab,
  activeColor = 'bg-gradient-to-r from-green-500 to-emerald-600',
  className = ''
}: TabSwitcherProps) {
  return (
    <div className={`flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-6 py-2 text-sm font-medium rounded-full transition-colors z-10 ${
            activeTab === tab
              ? 'text-white dark:text-white'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {activeTab === tab && (
            <motion.span
              layoutId="activeTab"
              initial={false}
              className={`absolute inset-0 rounded-full -z-10 ${activeColor}`}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}