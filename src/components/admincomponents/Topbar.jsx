import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../utils/swal";
import API from "../../api/axios";

export default function Topbar({ title }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/reviews").catch(() => ({ data: [] }));
        const flaggedCount = res.data.filter(r => r.status === "flagged").length;
        setNotifications(flaggedCount);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.style.colorScheme = newMode ? 'dark' : 'light';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Can be enhanced to search across pages/data
  };

  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">
        <input
          className="topbar-search"
          type="text"
          placeholder="Search anything…"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* NOTIFICATIONS */}
        <div style={{ position: 'relative' }}>
          <button 
            className="topbar-btn" 
            title="Notifications"
            onClick={() => navigate('/admin/reviews')}
          >
            🔔
            {notifications > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* DARK MODE */}
        <button
          className="topbar-btn"
          onClick={handleDarkMode}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
          style={{
            background: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            borderRadius: '8px'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* PROFILE DROPDOWN */}
        <div style={{ position: 'relative' }}>
          <button
            className="topbar-btn"
            onClick={() => setShowProfile(!showProfile)}
            style={{
              background: showProfile ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              borderRadius: '8px'
            }}
          >
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="profile"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <span>{user?.username?.charAt(0).toUpperCase() || 'A'}</span>
            )}
          </button>

          {showProfile && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              background: '#1a1f3a',
              border: '1px solid #2d3748',
              borderRadius: '8px',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 1000
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #2d3748',
                fontSize: '0.875rem'
              }}>
                <div style={{ fontWeight: 600 }}>{user?.username}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{user?.email}</div>
              </div>

              <button
                onClick={() => {
                  navigate('/admin/dashboard');
                  setShowProfile(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #2d3748'
                }}
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => {
                  navigate(`/admin/users`);
                  setShowProfile(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #2d3748'
                }}
              >
                ⚙️ Settings
              </button>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
