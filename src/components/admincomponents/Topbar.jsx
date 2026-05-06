export default function Topbar({ title }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <input
          className="topbar-search"
          type="text"
          placeholder="Search anything…"
        />
        <button className="topbar-btn notif-dot" title="Notifications">🔔</button>
        <button className="topbar-btn" title="Settings">⚙</button>
      </div>
    </div>
  );
}
