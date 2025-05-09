'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './components/user/layout/Header';
import Footer from './components/user/layout/Footer';
import Hero from './components/user/sections/Hero';
import QuickBooking from './components/user/sections/QuickBooking';
import PopularStadiums from './components/user/sections/PopularStadiums';
import Trainers from './components/user/sections/Trainers';
import HostGame from './components/user/sections/HostGame';
import Testimonials from './components/user/sections/Testimonials';
import Newsletter from './components/user/sections/Newsletter';

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
          <QuickBooking />
          <PopularStadiums />
          <Trainers />
          <HostGame />
          <Testimonials />
          <Newsletter />
          
          
        </main>
        <Footer />

      </div>
    </div>
  );
}