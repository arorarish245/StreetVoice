"use client";

import { useState } from "react";
import { getSession } from 'next-auth/react';

export default function ReportIssue() {
  const [formData, setFormData] = useState<{
    image: File | null;
    location: string;
    description: string;
    tags: string;
  }>({
    image: null,
    location: "",
    description: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file" && (e.target as HTMLInputElement).files) {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData((prev) => ({
          ...prev,
          image: files[0],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Function to get user's location using OpenCage API
  const getLocationFromCoords = async (lat: number, lng: number) => {
    const res = await fetch(`/api/get-location?lat=${lat}&lng=${lng}`);
    const data = await res.json();

    // Assuming location info is in 'formatted' field
    return data.results?.[0]?.formatted || "Location not found";
  };

  // Function to fetch current location using the browser's Geolocation API
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = await getLocationFromCoords(latitude, longitude);
          setFormData((prev) => ({
            ...prev,
            location,
          }));
        },
        (error) => {
          console.error("Error getting location", error);
          setStatus("Failed to get location.");
        }
      );
    } else {
      setStatus("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setStatus(null);

  let token = null;

  // For email/password login (from cookies)
  if (typeof document !== "undefined") {
    token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
  }

  // For Google login (from NextAuth session)
  if (!token) {
    const session = await getSession();  
    if (session?.idToken) {
      token = session.idToken;  
    }
  }

  // If no token is found, handle the case accordingly (e.g., show an error or redirect to login)
  if (!token) {
    setStatus("You are not authenticated. Please log in.");
    setIsSubmitting(false);
    return;
  }

  const formDataToSend = new FormData();

  if (formData.image) {
    formDataToSend.append("image", formData.image);
  }

  formDataToSend.append("location", formData.location);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("tags", formData.tags);

  try {
    const response = await fetch("http://localhost:8000/report-issue", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Sending the token here (whether from email/password or Google)
      },
      body: formDataToSend,
    });

    if (response.ok) {
      setStatus("Your issue has been reported!");
      setFormData({
        image: null,
        location: "",
        description: "",
        tags: "",
      });
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error occurred during report submission:", error);
    setStatus("Something went wrong. Please try again.");
  }

  setIsSubmitting(false);
};



  return (
    <div className="min-h-screen bg-[#BBE1FA] py-12 px-6">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-[#3282B8]">
        <h1 className="text-3xl font-extrabold text-[#1B262C] text-center mb-6">
          Report an Issue
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-lg text-[#0F4C75] font-semibold"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-[#3282B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C75] hover:bg-[#F1F1F1] transition duration-300"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-lg text-[#0F4C75] font-semibold"
            >
              Location
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-[#3282B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C75] hover:bg-[#F1F1F1] transition duration-300"
                placeholder="Enter location or use auto-detect"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="ml-2 bg-[#3282B8] text-white px-4 py-2 rounded-lg"
              >
                Auto-Detect Location
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-lg text-[#0F4C75] font-semibold"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-[#3282B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C75] hover:bg-[#F1F1F1] transition duration-300"
              rows={4}
              placeholder="Describe the issue"
            />
          </div>

          {/* Tags Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-lg text-[#0F4C75] font-semibold"
            >
              Tags
            </label>
            <select
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-[#3282B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C75] hover:bg-[#F1F1F1] transition duration-300"
              required
            >
              <option value="">Select a category</option>
              <option value="Garbage">Garbage</option>
              <option value="Road">Road</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Sanitation">Sanitation</option>
            </select>
          </div>

          {/* Submit Button */}
          {status && (
            <div
              className={`mb-4 text-center ${
                status.includes("reported") ? "text-green-500" : "text-red-500"
              } font-medium`}
            >
              {status}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-white text-lg rounded-full ${
                isSubmitting
                  ? "bg-[#1B262C] cursor-not-allowed"
                  : "bg-[#3282B8] hover:bg-[#0F4C75] transition duration-300"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
