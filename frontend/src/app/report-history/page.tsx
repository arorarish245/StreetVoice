"use client";

import { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';

type Report = {
  image_url: string;
  location: string;
  tags: string;
  reported_at: string;
  status: string;
};

export default function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  // Fetching the reports
  const fetchReports = async () => {
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


  try {
    const response = await fetch("http://localhost:8000/my-reports", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setReports(data.reports); 
      // setStatus("Reports fetched successfully");
    } else {
      setStatus("Failed to fetch reports");
    }
  } catch (error) {
    console.error("Error occurred while fetching reports:", error);
    setStatus("Something went wrong. Please try again.");
  }

  setLoading(false);
};

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#BBE1FA] py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-[#3282B8]">
        <h1 className="text-3xl font-extrabold text-[#1B262C] text-center mb-6">
          My Report History
        </h1>
        {status && (
          <div
            className={`mb-4 text-center ${
              status.includes("success") ? "text-green-500" : "text-red-500"
            } font-medium`}
          >
            {status}
          </div>
        )}

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 font-semibold text-[#0F4C75] mb-4">
          <div>Problem</div>
          <div>Tag</div>
          <div>Location</div>
          <div>Reporting Date</div>
          <div>Status</div>
        </div>

        {/* Display Reports */}
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 p-4 bg-[#F1F1F1] rounded-lg shadow-md mb-4"
            >
              {/* Report Image */}
              <div>
                <img
                  src={report.image_url}
                  alt="Report"
                  className="w-16 h-16 object-cover rounded"
                />
              </div>

              {/* Report Tag */}
              <div>{report.tags}</div>

              {/* Report Location */}
              <div>{report.location}</div>

              {/* Report Date */}
              <div>{new Date(report.reported_at).toLocaleDateString()}</div>

              {/* Report Status */}
              <div>{report.status}</div>
            </div>
          ))
        ) : (
          <div>No reports found.</div>
        )}
      </div>
    </div>
  );
}
