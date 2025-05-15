// src/app/components/ZoneBarChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { zone: "North", reports: 120 },
  { zone: "South", reports: 98 },
  { zone: "East", reports: 150 },
  { zone: "West", reports: 80 },
  { zone: "Central", reports: 130 },
];

export default function ZoneBarChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#1B262C] mb-4">
        Zone-Wise Report Volume
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reports" fill="#0F4C75" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
