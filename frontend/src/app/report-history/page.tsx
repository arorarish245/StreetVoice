"use client";

import { useEffect, useState } from "react";

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
    const token =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1]
        : null;

    try {
      const response = await fetch("http://localhost:8000/my-reports", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports); // Assuming 'reports' is the key in the response
        setStatus("Reports fetched successfully");
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
          <div className={`mb-4 text-center ${status.includes("success") ? "text-green-500" : "text-red-500"} font-medium`}>
            {status}
          </div>
        )}
        <div className="space-y-6">
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <div key={index} className="bg-[#F1F1F1] p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">{report.location}</h2>
                <p className="text-sm text-gray-500">Tags: {report.tags}</p>
                <p className="text-sm text-gray-500">Reported At: {new Date(report.reported_at).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Status: {report.status}</p>
                <img src={report.image_url} alt="Report" className="mt-4 rounded-lg" />
              </div>
            ))
          ) : (
            <div>No reports found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
