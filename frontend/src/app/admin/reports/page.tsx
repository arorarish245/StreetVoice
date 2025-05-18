"use client";
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { getSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import Modal from "@/app/components/Modal";

interface Report {
  _id: string;
  image_url: string;
  location: string;
  tags: string;
  reported_at: string;
  status: string;
  user_id: string;
  description: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // NEW: filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // NEW: a state to trigger fetch after clicking search button
  const [triggerFetch, setTriggerFetch] = useState(0);

  // NEW: track status changes locally per report
  // We'll store updated statuses here keyed by report._id
  const [updatedStatuses, setUpdatedStatuses] = useState<{
    [key: string]: string;
  }>({});

  const [showModal, setShowModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [modalImage, setModalImage] = useState<string | null>(null);

  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
  });

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
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search.trim() !== "") {
          queryParams.append("search", search);
        }
        if (statusFilter !== "all") {
          queryParams.append("status", statusFilter);
        }
        if (categoryFilter !== "all") {
          queryParams.append("tag", categoryFilter);
        }
        if (dateFilter !== "") {
          queryParams.append("date", dateFilter);
        }

        const res = await fetch(
          `http://localhost:8000/all-reports?${queryParams.toString()}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();

        if (page === 1) {
          setReports(data.reports);
        } else {
          setReports((prev) => [...prev, ...data.reports]);
        }

        setHasMore(data.reports.length >= limit);
        // Clear updated statuses on fresh fetch (page 1)
        if (page === 1) {
          setUpdatedStatuses({});
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    // Fetch reports only when page or triggerFetch changes
    fetchReports();
  }, [page, triggerFetch]);

  // Search input handlers (no automatic fetch here)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // NEW: handle filter changes just update states, no fetch yet
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  // NEW: Search button click triggers actual fetching
  const handleFilterSearchClick = () => {
    setPage(1);
    setSearch(searchInput);
    setTriggerFetch((prev) => prev + 1); // trigger useEffect to refetch with new filters
  };

  // Load more reports (for pagination)
  const loadMoreReports = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // NEW: Handle status dropdown change per report
  const handleStatusSelectChange = (reportId: string, newStatus: string) => {
    setUpdatedStatuses((prev) => ({
      ...prev,
      [reportId]: newStatus,
    }));
  };

  // NEW: Save button handler to update status on server
  const handleSaveStatus = async (reportId: string) => {
  const newStatus = updatedStatuses[reportId];
  if (!newStatus) return;

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
  if (!token) {
    setModalInfo({
      show: true,
      title: "Authentication Required",
      message: "You must be logged in to update status.",
      type: "error",
    });
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8000/update-report-status/${reportId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_status: newStatus }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      // If backend sends 403 for unauthorized dept
      if (res.status === 403) {
        setModalInfo({
          show: true,
          title: "Access Denied",
          message:
            data.detail ||
            "You are not authorized to update reports of this category.",
          type: "error",
        });
      } else {
        setModalInfo({
          show: true,
          title: "Update Failed",
          message: data.detail || "Failed to update status.",
          type: "error",
        });
      }
      return;
    }

    // Update local state with new status
    setReports((prev) =>
      prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
    );

    // Clear the updated status for that report
    setUpdatedStatuses((prev) => {
      const copy = { ...prev };
      delete copy[reportId];
      return copy;
    });

    setModalInfo({
      show: true,
      title: "Success",
      message: data.message || "Status updated successfully.",
      type: "success",
    });
  } catch (error) {
    setModalInfo({
      show: true,
      title: "Network Error",
      message: "Failed to update status. Please try again later.",
      type: "error",
    });
  }
};


  // NEW: Suggest button handler placeholder
  const handleSuggest = async (report: Report) => {
  setShowModal(true); // Show modal immediately
  setIsLoading(true); // Show loading initially

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

  if (!token) {
    setModalInfo({
      show: true,
      title: "Authentication Required",
      message: "You must be logged in to get suggestions.",
      type: "error",
    });
    setShowModal(false); // Hide modal on failure
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/suggestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tag: report.tags,
        location: report.location,
        description: report.description,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Failed to get suggestion");
    }

    const data = await response.json();
    setSuggestionText(data.suggestion);
  } catch (error: any) {
    setModalInfo({
      show: true,
      title: "Error",
      message: error.message || "Failed to load suggestion.",
      type: "error",
    });
    setSuggestionText("Failed to load suggestion.");
  } finally {
    setIsLoading(false);
  }
};

  // Utility: get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-300 text-yellow-900";
      case "in-progress":
        return "bg-blue-300 text-blue-900";
      case "resolved":
        return "bg-green-300 text-green-900";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  if (loading && page === 1)
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl px-6 py-4 shadow-lg flex items-center space-x-3">
          <svg
            className="animate-spin h-5 w-5 text-teal-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-gray-700 text-base">Loading reports...</span>
        </div>
      </div>
    );

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-[#BBE1FA] min-h-screen text-[#1B262C]">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <div className="w-full lg:w-1/3 relative">
          <input
            type="text"
            placeholder="Search by location or tags..."
            className="w-full px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
            value={searchInput}
            onChange={handleSearchChange}
          />
          <button
            onClick={handleFilterSearchClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#3282B8] hover:text-[#0F4C75]"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <select
          className="w-full lg:w-1/5 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="w-full lg:w-1/5 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
          value={categoryFilter}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          <option value="garbage">Garbage</option>
          <option value="road">Road</option>
          <option value="lights">Lights</option>
          <option value="water">Water</option>
          <option value="others">Others</option>
        </select>

        <input
          type="date"
          className="w-full lg:w-1/5 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
          value={dateFilter}
          onChange={handleDateChange}
        />

        {/* Search Button */}
        <button
          onClick={handleFilterSearchClick}
          className="w-full lg:w-auto px-6 py-2 bg-[#0F4C75] text-white rounded hover:bg-[#3282B8] transition"
        >
          Search
        </button>
      </div>

      {/* Report Table */}
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
            {reports.map((report) => {
              const currentStatus =
                updatedStatuses[report._id] ?? report.status;
              return (
                <tr
                  key={report._id}
                  className="border-b last:border-b-0 text-center align-middle"
                >
                  <td className="py-3 px-4">
                    {report.image_url ? (
                      <img
                        src={report.image_url}
                        alt="thumbnail"
                        className="w-24 h-16 object-cover rounded mx-auto cursor-pointer"
                        onClick={() => setModalImage(report.image_url)}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="py-3 px-4 align-middle">{report.tags}</td>
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-1 justify-center">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {report.location}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${getStatusColorClass(
                        currentStatus
                      )}`}
                    >
                      {currentStatus.charAt(0).toUpperCase() +
                        currentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(report.reported_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <select
                        className="border border-gray-300 rounded px-2 py-1"
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusSelectChange(report._id, e.target.value)
                        }
                      >
                        <option value="submitted">Submitted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      {updatedStatuses[report._id] && (
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          onClick={() => handleSaveStatus(report._id)}
                        >
                          Save
                        </button>
                      )}

                      <button
                        onClick={() => handleSuggest(report)}
                        className="mt-2 px-4 py-2 bg-[#0F4C75] text-white rounded-lg shadow hover:bg-teal-700 transition duration-200"
                      >
                        Suggest
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreReports}
            disabled={loading}
            className="px-6 py-2 bg-[#0F4C75] text-white rounded hover:bg-[#3282B8] transition"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Modal for suggestion result */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md max-h-[80vh] rounded-xl shadow-lg p-6 overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-3xl hover:text-gray-800"
              onClick={() => {
                setShowModal(false);
                setSuggestionText("");
              }}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-teal-700 mb-4">
              Suggestion
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center text-gray-500 py-10">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-teal-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading suggestion...
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-lg font-semibold my-2" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-700 mb-2" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                }}
              >
                {suggestionText}
              </ReactMarkdown>
            )}
          </div>
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={() => setModalImage(null)}
            >
              ×
            </button>
            <img
              src={modalImage}
              alt="enlarged"
              className="max-w-[100vw] max-h-[90vh] rounded shadow-lg"
            />
          </div>
        </div>
      )}

      <Modal
        show={modalInfo.show}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
        title={modalInfo.title}
        message={modalInfo.message}
        type={modalInfo.type as "error" | "success" | "info"}
      />
    </div>
  );
}
