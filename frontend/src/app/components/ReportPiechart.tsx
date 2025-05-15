// src/app/components/ReportPieChart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Garbage", value: 400 },
  { name: "Potholes", value: 300 },
  { name: "Street Lights", value: 200 },
  { name: "Water Leakage", value: 150 },
  { name: "Others", value: 100 },
];

const COLORS = ["#3282B8", "#0F4C75", "#10B981", "#FBBF24", "#EF4444"];

export default function ReportPieChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#1B262C] mb-4">Report Frequency by Category</h2>
      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
