"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function ChartPortfolioPie({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const COLORS = [
    "#4f46e5",
    "#0ea5e9",
    "#f97316",
    "#22c55e",
    "#a855f7",
    "#06b6d4",
    "#f43f5e",
  ];

  const pieData = data.map((p: any) => ({
    name: p.name,
    value: Number(p.portfolioPct.toFixed(2)),
  }));

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full h-80">
      <h2 className="text-lg font-semibold mb-4">Portfolio Allocation (%)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
