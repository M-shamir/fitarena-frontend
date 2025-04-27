"use client";
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/trainer/Sidebar';
import DashboardOverview from '@/app/components/trainer/DashboardOverview';
import AddSessionForm from '@/app/components/trainer/AddSessionForm';
import PendingApprovals from '@/app/components/trainer/PendingApprovals';
import ApprovedSessions from '@/app/components/trainer/ApprovedSessions';
import TrainerProfileView from '@/app/components/trainer/TrainerProfileView';

export default function TrainerDashboard() {
  const [activeView, setActiveView] = useState('dashboardOverview');
  const router = useRouter();

  return (
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
              <span className="text-sm">Trainer Name</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {activeView === 'dashboardOverview' && <DashboardOverview />}
          {activeView === 'addSession' && <AddSessionForm setActiveView={setActiveView} />}
          {activeView === 'pendingApprovals' && <PendingApprovals />}
          {activeView === 'approvedSessions' && <ApprovedSessions />}
          {activeView === 'viewProfile' && <TrainerProfileView/>}
          
        </main>
      </div>
    </div>
  );
}