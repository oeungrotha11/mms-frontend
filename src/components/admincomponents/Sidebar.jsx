import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import API from "../../api/axios";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  // ✅ MUST be inside component
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    revenue: 0,
    totalReviews: 0,
    monthlyRevenue: [],
    categoryStats: [],
    recentMovies: [],
    activities: []
  });
  const [movies, setMovies] = useState([]);

  // ✅ MUST be inside component
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, moviesRes, categoryRes] = await Promise.all([
          API.get("admin/stats"),
          API.get("movies"),
          API.get("movies/categories/with-count")
        ]);

        setStats(statsRes.data);
        setMovies(moviesRes.data);

        // optional: if you want categories in state
        console.log(categoryRes.data);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { icon: '▦', label: 'Dashboard', path: '/admin/dashboard' },
      ],
    },
    {
      label: 'Content',
      items: [
        { icon: '🎬', label: 'Movies', path: '/admin/movies', badge: stats?.totalMovies ?? 0 },
        { icon: '＋', label: 'Add Movie', path: '/admin/add-movie' },
        { icon: '🏷', label: 'Categories', path: '/admin/categories' },
      ],
    },
    {
      label: 'Users',
      items: [
        { icon: '👥', label: 'All Users', path: '/admin/users' },
        { icon: '⭐', label: 'Reviews', path: '/admin/reviews', badge: '3', badgeRed: true },
      ],
    },
    {
      label: 'Monetization',
      items: [
        { icon: '💳', label: 'Subscriptions', path: '/admin/subscriptions' },
        { icon: '💰', label: 'Payments', path: '/admin/payments' },
        { icon: '📋', label: 'Plans', path: '/admin/plans' },
      ],
    },
    {
      label: 'Analytics',
      items: [
        { icon: '📊', label: 'Watch History', path: '/admin/watch-history' },
      ],
    },
  ];


  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">CV</div>
        <div>
          <div className="logo-text">CineVault</div>
          <div className="logo-badge">Admin Panel</div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="nav-group-label">{group.label}</div>

            {group.items.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""
                  }`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}

                {item.badge !== undefined && item.badge !== null && (
                  <span className={`nav-badge ${item.badgeRed ? "red" : ""}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* FOOTER PROFILE */}
      <div className="sidebar-footer">
        <div className="admin-avatar">
          {user?.profile_picture ? (

            <img
              src={user?.profile_picture}
              alt="avatar"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=User";
              }}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : 
          (
            <span>{user?.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <div className="admin-name">
            {user?.username || "Admin User"}
          </div>

          <div className="admin-role">
            {user?.role === "admin" ? "Admin" : "User"}
          </div>
        </div>
      </div>
    </aside>
  );
}