export default function StatCard({ icon, value, label, change, changeDir = 'up', color = 'green' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className={`stat-change ${changeDir}`}>{change}</div>
    </div>
  );
}
