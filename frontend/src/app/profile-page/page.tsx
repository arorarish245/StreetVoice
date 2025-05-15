"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

const departments = [
  "Sanitation",
  "Roadworks",
  "Water Supply",
  "Electricity",
  "Other",
];

export default function ProfileSetup() {
  const router = useRouter();
  const [role, setRole] = useState("User");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    role: "User",
    department: "",
    zone: "",
    adminCode: "",
    profilePic: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // Create FormData object
    const formDataToSend = new FormData();

    // Append regular fields to FormData
    formDataToSend.append("full_name", formData.fullName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("department", formData.department || "");
    formDataToSend.append("location", formData.zone || "");
    formDataToSend.append("admin_code", formData.adminCode || "");

    // Append profile picture if it exists
    if (formData.profilePic) {
      formDataToSend.append("profile_pic", formData.profilePic);
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }
    // Send the request
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FASTAPI_URL}/complete-profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Sending the token here (whether from email/password or Google)
        },
        body: formDataToSend,
      }
    );

    const data = await res.json();
    if (res.ok) {
      // Handle success - redirect accordingly
      if (formData.role === "Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/main");
      }
    } else {
      // Handle error
      console.error(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#BBE1FA] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-[#1B262C] mb-6">
          Complete Your Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-28 h-28 rounded-full bg-[#0F4C75] flex items-center justify-center text-[#BBE1FA] text-3xl cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => document.getElementById("profilePicInput")?.click()}
          >
            {formData.profilePic ? (
              <img
                src={URL.createObjectURL(formData.profilePic)}
                className="w-full h-full object-cover rounded-full"
                alt="Profile Preview"
              />
            ) : (
              "📷"
            )}
          </div>
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition"
        />

        {/* Role */}
        <select
          name="role"
          value={formData.role}
          onChange={(e) => {
            setRole(e.target.value);
            handleChange(e);
          }}
          className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Admin Specific Fields */}
        {role === "Admin" && (
          <>
            {/* Department */}
            <select
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Zone */}
            <input
              type="text"
              name="zone"
              placeholder="Your Zone/Location"
              required
              value={formData.zone}
              onChange={handleChange}
              className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition"
            />

            {/* Admin Code (optional) */}
            <input
              type="text"
              name="adminCode"
              placeholder="Admin Code (optional)"
              value={formData.adminCode}
              onChange={handleChange}
              className="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition"
            />
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#3282B8] text-white py-3 rounded-xl hover:bg-[#0F4C75] transition"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}