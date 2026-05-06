import BarChart from '../../components/admincomponents/BarChart';
import DonutChart from '../../components/admincomponents/DonutChart';
import ActivityFeed from '../../components/admincomponents/ActivityFeed';
import StatCard from '../../components/admincomponents/StatCard';
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Dashboard({ onNavigate }) {

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

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard value={stats?.totalUsers || 0} label="Total Users" />
        <StatCard value={stats?.totalMovies || 0} label="Total Movies" />
        <StatCard value={`$${stats?.revenue || 0}`} label="Revenue" />
        <StatCard value={stats?.totalReviews || 0} label="Total Reviews" />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <BarChart data={stats?.monthlyRevenue} />
        <DonutChart data={stats?.categoryStats} />
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.2rem' }}>

        {/* Recent Movies */}
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">Recently Added Movies</div>
            <div className="table-actions">
              <button className="btn-sm" onClick={() => onNavigate('movies')}>View All</button>
              <button className="btn-sm primary" onClick={() => onNavigate('add-movie')}>+ Add</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Category</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {movies.length > 0 ? (
                movies.slice(0, 5).map((m) => (
                  <tr key={m._id}>
                    <td>{m.title}</td>
                    <td>{m.category?.name || "N/A"}</td>
                    <td>★ {m.rating || "0"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No movies found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <ActivityFeed data={stats?.activities || []} />
      </div>
    </div>
  );
}
