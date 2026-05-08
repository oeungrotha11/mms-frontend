import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";

export default function WatchMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 fetch movies (protected)
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/movies");
      setMovies(res.data);

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
  }, []);

  // 🔥 TEST SUBSCRIBE BUTTON
  const handleTestSubscribe = async () => {
    try {
      // get first plan (simple testing)
      const plans = await API.get("/subscriptions/plans");

      if (plans.data.length === 0) {
        alert("No plans available");
        return;
      }

      await API.post("/payments", {
        userId: JSON.parse(localStorage.getItem("user")).id,
        planId: plans.data[0]._id,
        method: "test"
      });

      alert("✅ Subscribed successfully!");
      fetchMovies();

    } catch (err) {
      console.error(err);
      alert("Subscription failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎬 Movies</h2>

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
            onClick={handleTestSubscribe}
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔥 Subscribe (Test)
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
    </div>
  );
}