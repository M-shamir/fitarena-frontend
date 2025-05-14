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
import LocationPermissionModal from './components/user/ui/LocationPermissionModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'unrequested'>('unrequested');

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Check if we've already asked for location permission
    const permissionAsked = localStorage.getItem('locationPermissionAsked');
    if (!permissionAsked) {
      setShowLocationModal(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLocationPermission = async (allow: boolean) => {
    if (allow) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
  
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
  
        console.log('User location:', userCoords); // Verify this logs correctly
  
        setUserLocation(userCoords);
        setLocationPermission('granted');
        localStorage.setItem('locationPermissionAsked', 'true');
        
        // Store location in localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(userCoords));
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
      }
    } else {
      setLocationPermission('denied');
      localStorage.setItem('locationPermissionAsked', 'true');
    }
    setShowLocationModal(false);
  };
  
  
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
        setLocationPermission('granted');
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
  }, []);
  

  return (
    <ProtectedRoute 
      preventRoles={['admin', 'trainer', 'stadium_owner']}>

      
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Head>
          <title>Fitarena | Premium Sports Booking Platform</title>
          <meta name="description" content="Book stadiums, hire trainers, and host games with Fitarena" />
        </Head>

        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main>
          <Hero />
          <QuickBooking userLocation={userLocation} />
          <PopularStadiums userLocation={userLocation} />
          <Trainers />
          <HostGame />
          <Testimonials />
          <Newsletter />
        </main>
        <Footer />

        <LocationPermissionModal 
          isOpen={showLocationModal}
          onAllow={() => handleLocationPermission(true)}
          onDeny={() => handleLocationPermission(false)}
        />
      </div>
    </div>
    </ProtectedRoute>
  );
}