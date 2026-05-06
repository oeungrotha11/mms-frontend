export default function ActivityFeed({ data }) {

  function getIcon(type) {
  switch (type) {
    case "user":
      return "👤";
    case "movie":
      return "🎬";
    case "payment":
      return "💰";
    case "review":
      return "⭐";
    case "category":
      return "🏷";
    default:
      return "📌";
  }
}
  return (
    <div className="chart-card">
      
      {/* HEADER */}
      <div className="chart-header">
        <div className="chart-title">Recent Activity</div>
        <div className="chart-action">
          {(data || []).length} items
        </div>
      </div>

      {/* BODY */}
      <div className="activity-list">
        {(data || []).length === 0 ? (
          <div className="chart-empty">
            No activity available
          </div>
        ) : (
          data.map((a, i) => (
            <div key={i} className="activity-item">
              
              {/* ICON */}
              <div className={`activity-icon ${a.type}`}>
                {getIcon(a.type)}
              </div>

              {/* TEXT */}
              <div className="activity-content">
                <div className="activity-message">{a.message}</div>
                <div className="activity-time">
                  {new Date(a.time).toLocaleString()}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}