'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './components/user/layout/Header';
import Footer from './components/user/layout/Footer'
import Hero from './components/user/sections/Hero';



export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Head>
          <title>Fitarena | Premium Sports Booking Platform</title>
          <meta name="description" content="Book stadiums, hire trainers, and host games with Fitarena" />
        </Head>

        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main>
          <Hero />
          
          
        </main>

      </div>
    </div>
  );
}