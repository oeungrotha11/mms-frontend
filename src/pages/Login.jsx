import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      if (!res.data.user) {
        setError("Invalid response from server.");
        return;
      }
      if (res.data.user.status === "banned") {
        setError("Your account has been banned.");
        return;
      }

      login(res.data);

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setError(typeof err.response.data === "string" ? err.response.data : "Login failed.");
      } else {
        setError("Server not responding. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 16,
        padding: "36px 32px",
      }}>

        {/* heading */}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, textAlign: "center" }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: "#666", textAlign: "center", marginBottom: 28 }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#F5C518", fontWeight: 600, cursor: "pointer" }}
          >
            Sign up free
          </span>
        </p>

        {/* email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="email"
            style={{
              width: "100%", padding: "11px 14px",
              background: "#111", border: "1px solid #2a2a2a",
              borderRadius: 10, fontSize: 14, color: "#e4e4e7",
              outline: "none", boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            onFocus={e => {
              e.target.style.borderColor = "rgba(245,197,24,0.6)";
              e.target.style.boxShadow = "0 0 0 3px rgba(245,197,24,0.1)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "#2a2a2a";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* password */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
              style={{
                width: "100%", padding: "11px 40px 11px 14px",
                background: "#111", border: "1px solid #2a2a2a",
                borderRadius: 10, fontSize: 14, color: "#e4e4e7",
                outline: "none", boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={e => {
                e.target.style.borderColor = "rgba(245,197,24,0.6)";
                e.target.style.boxShadow = "0 0 0 3px rgba(245,197,24,0.1)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#2a2a2a";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#555", cursor: "pointer", padding: 4,
              }}
            >
              {showPw ? "👁" : "🙈"}
            </button>
          </div>
        </div>

        {/* forgot */}
        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>
            Forgot password?
          </span>
        </div>

        {/* error */}
        {error && (
          <div style={{
            fontSize: 12, color: "#f87171",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "9px 12px",
            marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        {/* submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "12px",
            borderRadius: 10, fontSize: 14, fontWeight: 700,
            color: "#000", background: "#F5C518",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            boxShadow: "0 4px 18px rgba(245,197,24,0.25)",
            transition: "opacity 0.18s, transform 0.18s",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

      </div>
    </div>
  );
}