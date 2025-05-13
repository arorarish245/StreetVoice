"use client";

import { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';

type Report = {
  image_url: string;
  location: string;
  tags: string;
  reported_at: string;
  status: string;
  _id: string;
};

export default function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null); // For tracking the report being deleted

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
      } else {
        setStatus("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error occurred while fetching reports:", error);
      setStatus("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleDelete = async (reportId: string) => {
    let token = null;

    if (typeof document !== "undefined") {
      token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
    }

    if (!token) {
      const session = await getSession();
      if (session?.idToken) {
        token = session.idToken;
      }
    }

    // Confirm delete only if the report status is 'submitted'
    const reportToDelete = reports.find((report) => report._id === reportId);
    if (reportToDelete?.status !== "submitted") {
      setStatus("You can only delete reports with 'submitted' status.");
      return;
    }

    // Set the report ID for deletion
    setDeletingReportId(reportId);
  };

  const confirmDelete = async () => {
    if (!deletingReportId) return;

    let token = null;

    if (typeof document !== "undefined") {
      token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
    }

    if (!token) {
      const session = await getSession();
      if (session?.idToken) {
        token = session.idToken;
      }
    }

    try {
      const response = await fetch(`http://localhost:8000/delete-report/${deletingReportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Filter out the deleted report from the state
        setReports((prevReports) => prevReports.filter((r) => r._id !== deletingReportId));
        setStatus("Report deleted successfully");
        setDeletingReportId(null); // Reset deleting report
      } else {
        setStatus("Failed to delete report");
        setDeletingReportId(null); // Reset deleting report
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      setStatus("Something went wrong while deleting the report");
      setDeletingReportId(null); // Reset deleting report
    }
  };

  const cancelDelete = () => {
    setDeletingReportId(null); // Reset deletion process
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
        <div className="grid grid-cols-6 gap-4 font-semibold text-[#0F4C75] mb-4">
          <div>Problem</div>
          <div>Tag</div>
          <div>Location</div>
          <div>Reporting Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Display Reports */}
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 p-4 bg-[#F1F1F1] rounded-lg shadow-md mb-4"
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

              {/* Delete Button */}
              <div>
                {report.status === "submitted" && (
                  <button
                    onClick={() => handleDelete(report._id)} // Passing the report _id to the delete function
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No reports found.</div>
        )}

        {/* Modal Confirmation for Deletion */}
        {deletingReportId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold text-[#1B262C] mb-4">Are you sure you want to delete this report?</h2>
              <div className="flex justify-between">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
