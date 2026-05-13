import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username,    setUsername]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [phone,       setPhone]       = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        username,
        email,
        password,
        phone,
        date_of_birth: dateOfBirth,
        profile_picture: `https://ui-avatars.com/api/?name=${username}&background=random`,
      });

      setSuccess(res.data.message || "Account created! Redirecting…");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      if (err.response?.data) {
        setError(typeof err.response.data === "string" ? err.response.data : "Registration failed.");
      } else {
        setError("Server not responding. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "#111", border: "1px solid #2a2a2a",
    borderRadius: 10, fontSize: 14, color: "#e4e4e7",
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.18s, box-shadow 0.18s",
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "rgba(245,197,24,0.6)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(245,197,24,0.1)";
  };

  const blurStyle = (e) => {
    e.target.style.borderColor = "#2a2a2a";
    e.target.style.boxShadow   = "none";
  };

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "#666", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.05em",
  };

  const fieldStyle = { marginBottom: 14 };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{
        width: "100%", maxWidth: 420,
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 16,
        padding: "36px 32px",
      }}>

        {/* heading */}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, textAlign: "center" }}>
          Create account
        </h2>
        <p style={{ fontSize: 13, color: "#666", textAlign: "center", marginBottom: 28 }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#F5C518", fontWeight: 600, cursor: "pointer" }}
          >
            Sign in
          </span>
        </p>

        {/* username */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Username *</label>
          <input
            style={inputStyle}
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
            autoComplete="username"
          />
        </div>

        {/* email */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Email *</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
            autoComplete="email"
          />
        </div>

        {/* password */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Password *</label>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...inputStyle, paddingRight: 40 }}
              type={showPw ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#555", cursor: "pointer", padding: 4, fontSize: 14,
              }}
            >
              {showPw ? "👁" : "🙈"}
            </button>
          </div>
          {/* strength bar */}
          {password && (
            <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 999,
                  background: i <= (password.length >= 10 ? 3 : password.length >= 6 ? 2 : 1)
                    ? (password.length >= 10 ? "#22c55e" : password.length >= 6 ? "#F5C518" : "#ef4444")
                    : "#2a2a2a",
                  transition: "background 0.25s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* phone */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            type="tel"
            placeholder="+855 00 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* date of birth */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Date of Birth</label>
          <input
            style={{ ...inputStyle, colorScheme: "dark" }}
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* error */}
        {error && (
          <div style={{
            fontSize: 12, color: "#f87171",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "9px 12px", marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        {/* success */}
        {success && (
          <div style={{
            fontSize: 12, color: "#4ade80",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 8, padding: "9px 12px", marginBottom: 14,
          }}>
            ✓ {success}
          </div>
        )}

        {/* submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%", padding: "12px",
            borderRadius: 10, fontSize: 14, fontWeight: 700,
            color: "#000", background: "#F5C518",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            boxShadow: "0 4px 18px rgba(245,197,24,0.25)",
            transition: "opacity 0.18s",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

      </div>
    </div>
  );
}