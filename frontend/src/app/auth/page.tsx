// pages/auth.tsx
"use client"
import { useState } from "react";
import { signIn } from "next-auth/react"; // Optional for Google OAuth integration

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true); // Default to Signup form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For Signup


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isSignup) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.detail || "Signup failed");
    } else {
      alert("Signup successful. You can now log in.");
      setIsSignup(false);
    }
  } else {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Login failed: " + (data.detail || "Invalid credentials"));
    } else {
      // Save the JWT token in local storage or state
      localStorage.setItem("access_token", data.access_token);
      document.cookie = `access_token=${data.access_token}; path=/; secure`;
      window.location.href = "/";  // Redirect to the main page
    }
  }
};

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#BBE1FA]">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        {/* Tabs: Login and Signup */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsSignup(true)}
            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${
              isSignup ? "bg-[#1B262C] text-white" : "text-[#1B262C]"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsSignup(false)}
            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${
              !isSignup ? "bg-[#1B262C] text-white" : "text-[#1B262C]"
            }`}
          >
            Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[#1B262C]">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-3 border rounded-lg border-[#0F4C75] focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[#1B262C]">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-3 border rounded-lg border-[#0F4C75] focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password field (only for Signup) */}
          {isSignup && (
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#1B262C]">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full mt-1 p-3 border rounded-lg border-[#0F4C75] focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1B262C] text-white py-3 rounded-lg hover:bg-[#0F4C75] transition-all duration-300"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Forgot Password link (only for Login) */}
        {!isSignup && (
          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-[#3282B8] hover:text-[#1B262C] transition-all duration-300"
            >
              Forgot Password?
            </a>
          </div>
        )}

        {/* Google Sign-In (Optional for OAuth) */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("google")}
            className="w-full bg-[#DB4437] text-white py-3 rounded-lg hover:bg-[#1B262C] transition-all duration-300"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;