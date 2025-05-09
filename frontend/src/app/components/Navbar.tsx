'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token || !!session);
    };

    checkLogin();

    // Optional: Listen for localStorage changes (multi-tab support)
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, [session]);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    window.location.href = "/auth"; // Redirect after logout
  };

  return (
    <nav className="bg-[#1B262C] text-white py-4 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-[#BBE1FA] hover:text-[#3282B8]">
          StreetVoice
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-lg hover:text-[#BBE1FA]">Home</Link>
          <Link href="#how-it-works" className="text-lg hover:text-[#BBE1FA]">How It Works</Link>
          <Link href="#features" className="text-lg hover:text-[#BBE1FA]">Features</Link>
          <Link href="#faq" className="text-lg hover:text-[#BBE1FA]">FAQ</Link>
          <Link href="/contact" className="text-lg hover:text-[#BBE1FA]">Contact</Link>
        </div>

        {/* Login/Signup Button and Logout Button */}
        <div className="flex space-x-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/auth"
                className="text-lg px-6 py-2 rounded-full bg-[#BBE1FA] text-[#1B262C] hover:bg-[#3282B8] hover:text-white transition duration-300"
              >
                Login
              </Link>
              <Link
                href="/auth"
                className="text-lg px-6 py-2 rounded-full bg-transparent border-2 border-[#BBE1FA] text-[#BBE1FA] hover:bg-[#BBE1FA] hover:text-[#1B262C] transition duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-lg px-6 py-2 rounded-full bg-[#F4A261] text-[#1B262C] hover:bg-[#3282B8] hover:text-white transition duration-300"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
