import BarChart from '../../components/admincomponents/BarChart';
import DonutChart from '../../components/admincomponents/DonutChart';
import ActivityFeed from '../../components/admincomponents/ActivityFeed';
import StatCard from '../../components/admincomponents/StatCard';
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { showInfo } from '../../utils/swal';
import { useNavigate } from 'react-router-dom';
import ActionButtons from '../../components/admincomponents/ActionButtons';

export default function Dashboard() {

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
  const navigate = useNavigate();

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
        setMovies(moviesRes.data.movies || []);

        // optional: if you want categories in state
        // console.log(categoryRes.data);

      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  //format money
  const formatMoney = (num) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(num || 0);
  };

  const USD_TO_KHR = 4000;

  const formatUSDToKHR = (usd) => {
    const riel = (usd || 0) * USD_TO_KHR;
    return `${riel.toLocaleString()} ៛`;
  };

  const formatCurrencyDual = (usd) => {
    const riel = usd * 4000;

    return `$${usd.toFixed(2)} (៛${riel.toLocaleString()} )`;
  };

  const handleViewMovie = (movie) => {
    const poster = movie.poster_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title)}`;
    showInfo(`${movie.title}`, `
      <div style="display:flex;justify-content:center;margin-bottom:16px">
        <img
          src="${poster}"
          alt="${movie.title}"
          style="width:140px;height:140px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.25)"
        />
      </div>
      <p><strong>Category:</strong> ${movie.category?.name || 'N/A'}</p>
      <p><strong>Rating:</strong> ${movie.rating || 'N/A'}</p>
      <p><strong>Quality:</strong> ${movie.quality || 'N/A'}</p>
      <p><strong>Language:</strong> ${movie.language || 'N/A'}</p>
      <p><strong>Release Year:</strong> ${movie.release_year || 'N/A'}</p>
    `);
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        <div onClick={() => navigate("/admin/users")} style={{ cursor: "pointer" }}>
          <StatCard value={stats?.totalUsers || 0} label="Total Users" />
        </div>

        <div onClick={() => navigate("/admin/movies")} style={{ cursor: "pointer" }}>
          <StatCard value={stats?.totalMovies || 0} label="Total Movies" />
        </div>

        <div onClick={() => navigate("/admin/payments")} style={{ cursor: "pointer" }}>
          <StatCard
            value={formatCurrencyDual(stats?.revenue)}
            label="Revenue"
          />
        </div>

        <div onClick={() => navigate("/admin/reviews")} style={{ cursor: "pointer" }}>
          <StatCard value={stats?.totalReviews || 0} label="Total Reviews" />
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <BarChart data={stats?.monthlyRevenue} />
        <DonutChart data={stats?.categoryStats}
          onCategoryClick={(category) =>
            navigate(`/admin/categories/${category}`)
          } />
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.2rem' }}>

        {/* Recent Movies */}
        <div className="table-card">

          <div className="table-header">
            <div className="table-title">
              Recently Added Movies
            </div>

            <div className="table-actions">
              <button
                className="btn-sm"
                onClick={() => navigate('/admin/movies')}
              >
                View All
              </button>

              <button
                className="btn-sm primary"
                onClick={() => navigate('/admin/add-movie')}
              >
                + Add
              </button>
            </div>
          </div>

          <div className="movie-scroll">

            <table>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody className='over'>
                {movies.length > 0 ? (
                  movies.map((m) => (
                    <tr
                      key={m._id}
                      style={{ cursor: "default" }}
                    >
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={m.poster_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.title)}`}
                          alt={m.title}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
                        />
                        <span>{m.title}</span>
                      </td>
                      <td>{m.category?.name || "N/A"}</td>
                      <td>★ {m.rating || "0"}</td>
                      <td>
                        <ActionButtons
                          onView={() => handleViewMovie(m)}
                        />
                      </td>
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
        </div>

        {/* Activity Feed */}
        <ActivityFeed data={stats?.activities || []} />
      </div>
    </div>
  );
}
