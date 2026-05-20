import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function WatchMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 fetch movies (protected)
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/movies", {
        params: {
          page,
          search: debouncedSearch,
          limit: 20
        }
      });
      setMovies(res.data.movies || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      const msg = err.response?.data;

      if (msg === "No subscription") {
        setError("🚫 You need a subscription to watch movies");
      } else if (msg === "Subscription expired") {
        setError("⏰ Your subscription expired");
      } else {
        setError("❌ Failed to load movies");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [debouncedSearch, page]);


  return (
    <div style={{ padding: "20px" }}>
      <h2>🎬 Movies</h2>

      {/* SEARCH BOX */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#1f2937",
            color: "#fff"
          }}
        />
      </div>

      {/* ERROR STATE */}
      {error && (
        <div style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          <p>{error}</p>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔥 Go to checkout
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading movies...</p>}

      {/* MOVIES GRID */}
      {!error && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "15px"
        }}>
          {movies.map((m) => (
            <div key={m._id} style={{
              background: "#111",
              padding: "10px",
              borderRadius: "10px"
            }}>
              <img
                src={m.poster_url}
                alt={m.title}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />

              <h4 style={{ marginTop: "10px" }}>{m.title}</h4>

              <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                {m.category?.name || "No category"}
              </p>

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "5px", 
                marginTop: "5px",
                fontSize: "13px"
              }}>
                <span style={{ color: "#fbbf24" }}>★</span>
                <span>{m.avgRating ? m.avgRating.toFixed(1) : "0.0"}</span>
                <span style={{ color: "#6b7280", fontSize: "11px" }}>
                  ({m.totalReviews || 0} reviews)
                </span>
              </div>

              <Link to={`/movies/${m._id}`}>
                <button
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    background: "#22c55e",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  ▶ Watch
                </button>
              </Link>

            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!error && movies.length > 0 && (
        <div style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: "8px 15px",
              borderRadius: "6px",
              border: "1px solid #4f46e5",
              background: page === 1 ? "#6b7280" : "#4f46e5",
              color: "#fff",
              cursor: page === 1 ? "not-allowed" : "pointer"
            }}
          >
            ← Prev
          </button>

          <span style={{ fontSize: "14px", color: "#9ca3af" }}>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: "8px 15px",
              borderRadius: "6px",
              border: "1px solid #4f46e5",
              background: page === totalPages ? "#6b7280" : "#4f46e5",
              color: "#fff",
              cursor: page === totalPages ? "not-allowed" : "pointer"
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}