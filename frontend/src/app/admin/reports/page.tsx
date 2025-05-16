"use client";

const dummyReports = [
  {
    id: 1,
    issue: "Overflowing Garbage",
    category: "Sanitation",
    location: "Sector 21, Ward 5",
    status: "In Progress",
    date: "2025-05-15",
  },
  {
    id: 2,
    issue: "Broken Streetlight",
    category: "Lighting",
    location: "Main Road, Ward 3",
    status: "Submitted",
    date: "2025-05-14",
  },
  {
    id: 3,
    issue: "Potholes on Road",
    category: "Roads",
    location: "Sector 7, Ward 2",
    status: "Resolved",
    date: "2025-05-13",
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 bg-[#BBE1FA] min-h-screen text-[#1B262C]">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by location or category..."
          className="w-full lg:w-1/3 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
        />

        {/* Status Filter */}
        <select className="w-full lg:w-1/5 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]">
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Category Filter */}
        <select className="w-full lg:w-1/5 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]">
          <option value="all">All Categories</option>
          <option value="garbage">Garbage</option>
          <option value="road">Road</option>
          <option value="lights">Lights</option>
          <option value="water">Water</option>
          <option value="others">Others</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          className="w-full lg:w-1/5 px-4 py-2 border border-[#3282B8] rounded focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
        />
      </div>

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
            {dummyReports.map((report) => (
              <tr key={report.id} className="border-b last:border-b-0">
                <td className="py-3 px-4">{report.issue}</td>
                <td className="py-3 px-4">{report.category}</td>
                <td className="py-3 px-4">{report.location}</td>
                <td className="py-3 px-4 text-[#3282B8]">{report.status}</td>
                <td className="py-3 px-4">{report.date}</td>
                <td className="py-3 px-4">
                  <button className="text-sm bg-[#3282B8] text-white py-1 px-3 rounded hover:bg-[#0F4C75]">
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
