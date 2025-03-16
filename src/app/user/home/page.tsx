"use client"
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    // Remove the access token from localStorage on logout
    localStorage.removeItem('accessToken');
    
    // Redirect to login page after logout
    router.push('/user/login');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Head>
        <title>FitArena</title>
        <meta name="description" content="FitArena - Your fitness companion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-4 px-6 flex justify-between items-center border-b border-gray-200 bg-white">
        {/* Left - Logo */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold" style={{ color: '#22b664' }}>FitArena</h1>
        </div>

        {/* Center - Navigation */}
        <nav className="flex-1 flex justify-center">
          <div className="flex space-x-8">
            <Link href="/play" className="text-gray-800 font-semibold hover:text-[#22b664] transition-colors">
              Play
            </Link>
            <Link href="/book" className="text-gray-800 font-semibold hover:text-[#22b664] transition-colors">
              Book
            </Link>
            <Link href="/trainer" className="text-gray-800 font-semibold hover:text-[#22b664] transition-colors">
              Trainer
            </Link>
          </div>
        </nav>

        {/* Right - Logout or Login */}
        <div className="flex-1 flex justify-end">
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="text-gray-800 font-semibold hover:text-[#22b664] transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/user/login"
              className="text-gray-800 font-semibold hover:text-[#22b664] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center bg-white">
        {/* Main content goes here */}
      </main>
    </div>
  );
}
