import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

const colors = ["#4ade80", "#818cf8", "#fb923c", "#f87171"];

export default function CategoryChart({ data }) {
  const formatted = (data || []).map((c, index) => ({
    name: c._id?.name || c._id || `Category ${index + 1}`,
    value: c.count
  }));

  const chartData = formatted.filter((item) => item.value > 0);
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">Movie Categories</div>
        <div className="chart-action">{total} total</div>
      </div>

      <div style={{ width: "100%", height: 220 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111318",
                  border: "1px solid #1c1e2a",
                  borderRadius: 8,
                  color: "#e8eaf0"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
            No category data available
          </div>
        )}
      </div>

      <div className="donut-legend">
        {chartData.map((item, index) => (
          <div className="legend-item" key={item.name}>
            <span
              className="legend-dot"
              style={{ background: colors[index % colors.length] }}
            />
            <span className="legend-name">{item.name}</span>
            <span className="legend-pct">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
