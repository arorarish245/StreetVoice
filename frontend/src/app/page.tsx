"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import WhyUseStreetVoice from "./components/WhyUseStreetVoice";

export default function Home() {
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
    console.log("Signing out..."); // for email/pass
    await signOut({ redirect: false });
    console.log("Redirecting to /auth...");
    setIsLoggedIn(false);
    window.location.href = "/auth";
  };

  return (
    <div>
      <HeroSection/>
      <HowItWorks/>
      <WhyUseStreetVoice/>
      <div className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-black">StreetVoice</h1>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
