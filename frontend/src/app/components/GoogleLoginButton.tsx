import { useEffect } from "react";
import Script from "next/script";

const GoogleLoginButton = () => {
  useEffect(() => {
    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    // Render the button
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const token = response.credential;

    // Send token to your FastAPI backend
    const res = await fetch("http://localhost:8000/login/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ token }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);

      // Redirect based on user profile/role
      if (!data.profile_complete) {
        window.location.href = "/profile-page";
      } else if (data.role === "Admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/main";
      }
    } else {
      alert("Google login failed: " + data.detail);
    }
  };

  return <div id="google-signin-button" className="mt-6"></div>;
};

export default GoogleLoginButton;
