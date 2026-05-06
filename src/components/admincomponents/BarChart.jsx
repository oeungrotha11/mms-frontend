import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const fallbackData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 900 },
  { month: "Apr", revenue: 2200 }
];

export default function RevenueChart({ data }) {
  const chartData = data?.length ? data : fallbackData;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">Monthly Revenue</div>
        <div className="chart-action">2026</div>
      </div>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData}>
            <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,.04)" }}
              contentStyle={{
                background: "#111318",
                border: "1px solid #1c1e2a",
                borderRadius: 8,
                color: "#e8eaf0"
              }}
            />
            <Bar dataKey="revenue" fill="#4ade80" radius={[6, 6, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
