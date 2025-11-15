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

export default function ChartSectorBar({ sectors }: { sectors: any }) {
  if (!sectors || Object.keys(sectors).length === 0) return null;

  const barData = Object.entries(sectors).map(([sector, data]: any) => ({
    sector,
    present: Number(data.totalPresent.toFixed(2)),
  }));

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full h-80">
      <h2 className="text-lg font-semibold mb-4">Sector-wise Present Value</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sector" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="present" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
