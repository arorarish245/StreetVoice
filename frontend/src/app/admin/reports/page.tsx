"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { getSession } from "next-auth/react";

interface Report {
  _id: string;
  image_url: string;
  location: string;
  tags: string; // single tag string now
  reported_at: string;
  status: string;
  user_id: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: string;
  }>({});
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
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
        setLoading(true);
        const res = await fetch(`http://localhost:8000/all-reports?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();

        if (page === 1) {
          // Initial load - replace reports
          setReports(data.reports);
        } else {
          // Append next page reports
          setReports((prev) => [...prev, ...data.reports]);
        }

        // If fewer reports than limit are returned, no more pages
        if (data.reports.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [page]);

  // NEW: function to load more reports on button click
  const loadMoreReports = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report._id === id ? { ...report, status: newStatus } : report
      )
    );
    setSelectedStatus((prev) => ({ ...prev, [id]: "" }));
  };

  const currentReport = reports.find((r) => r._id === currentReportId);

  if (loading && page === 1) return <div>Loading reports...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-[#BBE1FA] min-h-screen text-[#1B262C]">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {/* Your existing filters & search UI */}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-[#0F4C75] text-white">
            <tr>
              <th className="py-3 px-4">Issue</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} className="border-b last:border-b-0">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {report.image_url ? (
                      <img
                        src={report.image_url}
                        alt="thumbnail"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-500 text-sm">
                        No Img
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 align-middle">{report.tags}</td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span>{report.location}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        report.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MapPin className="w-4 h-4" />
                    </a>
                  </div>
                </td>

                <td className="py-3 px-4 font-medium align-middle">
                  {report.status}
                </td>

                <td className="py-3 px-4 align-middle">
                  {new Date(report.reported_at).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 align-middle">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedStatus[report._id] || ""}
                      onChange={(e) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [report._id]: e.target.value,
                        }))
                      }
                      className="px-2 py-1 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-sm"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          report._id,
                          selectedStatus[report._id]
                        )
                      }
                      disabled={!selectedStatus[report._id]}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        selectedStatus[report._id]
                          ? "bg-[#3282B8] hover:bg-[#2566A3]"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setCurrentReportId(report._id);
                        setSuggestionModalOpen(true);
                      }}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      Suggest
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreReports}
            className="px-6 py-2 bg-[#3282B8] text-white rounded hover:bg-[#2566A3]"
          >
            Load More
          </button>
        </div>
      )}
      {loading && page > 1 && <div className="text-center mt-4">Loading more...</div>}

      {suggestionModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
            <button
              onClick={() => setSuggestionModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">Suggestion Details</h2>
            {currentReport ? (
              <>
                <p className="mb-2">
                  <strong>Issue:</strong> {currentReport.tags}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {currentReport.location}
                </p>
                <p className="mb-4 text-gray-700">
                  Here you can provide a form or text area for suggestions.
                </p>
                {/* Placeholder for suggestion form */}
              </>
            ) : (
              <p>Report not found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
