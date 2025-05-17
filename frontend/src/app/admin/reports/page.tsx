"use client";
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { getSession } from "next-auth/react";

interface Report {
  _id: string;
  image_url: string;
  location: string;
  tags: string;
  reported_at: string;
  status: string;
  user_id: string;
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
  const [updatedStatuses, setUpdatedStatuses] = useState<{ [key: string]: string }>({});

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
  try {
    const res = await fetch(`http://localhost:8000/update-report-status/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ new_status: newStatus }),  // <-- changed here
    });
    if (!res.ok) throw new Error("Failed to update status");

    setReports((prev) =>
      prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
    );

    setUpdatedStatuses((prev) => {
      const copy = { ...prev };
      delete copy[reportId];
      return copy;
    });
    alert("Status updated successfully");
  } catch (error) {
    alert("Failed to update status");
  }
};

  // NEW: Suggest button handler placeholder
  const handleSuggest = (reportId: string) => {
    alert(`Suggest action clicked for report ${reportId}`);
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

  if (loading && page === 1) return <div>Loading reports...</div>;
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
              // Determine the displayed status (updated or original)
              const currentStatus = updatedStatuses[report._id] ?? report.status;
              return (
                <tr key={report._id} className="border-b last:border-b-0">
                  <td className="py-3 px-4">
                    {report.image_url ? (
                      <img
                        src={report.image_url}
                        alt="thumbnail"
                        className="w-24 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="py-3 px-4">{report.tags}</td>
                  <td className="py-3 px-4 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#3282B8]" />
                    {report.location}
                  </td>
                  {/* Status column with color background */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${getStatusColorClass(
                        currentStatus
                      )}`}
                    >
                      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(report.reported_at).toLocaleDateString("en-GB")}
                  </td>

                  {/* Actions column with dropdown + Save + Suggest buttons */}
                  <td className="py-3 px-4 flex items-center gap-2">
                    {/* Status dropdown */}
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

                    {/* Save button (show only if status changed) */}
                    {updatedStatuses[report._id] && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        onClick={() => handleSaveStatus(report._id)}
                      >
                        Save
                      </button>
                    )}

                    {/* Suggest button */}
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      onClick={() => handleSuggest(report._id)}
                    >
                      Suggest
                    </button>
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
    </div>
  );
}
