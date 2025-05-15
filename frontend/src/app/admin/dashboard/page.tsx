import ReportPieChart from "@/app/components/ReportPiechart";
import ZoneBarChart from "@/app/components/ZoneBarchart";

export default function DashboardPage() {
  const metrics = [
    {
      label: "Total Reports Registered",
      value: 1240,
      color: "#3282B8", // accent
    },
    {
      label: "New Reports Today",
      value: 37,
      color: "#0F4C75", // secondary
    },
    {
      label: "Reports In Progress",
      value: 112,
      color: "#FBBF24", // yellow (custom for status)
    },
    {
      label: "Resolved Reports",
      value: 956,
      color: "#10B981", // green (custom for status)
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#1B262C]">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md p-5 text-white"
            style={{ backgroundColor: metric.color }}
          >
            <div className="text-sm">{metric.label}</div>
            <div className="text-3xl font-bold mt-2">{metric.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <ZoneBarChart />
        <ReportPieChart />
      </div>
    </div>
  );
}
