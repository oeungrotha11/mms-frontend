import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("Please fill required fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
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
        profile_picture: `https://ui-avatars.com/api/?name=${username}&background=random`
      });

      alert(res.data.message);

      // 👉 Redirect to login after success
      navigate("/login");

    } catch (err) {
      if (err.response) {
        alert(err.response.data);
      } else {
        alert("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow rounded w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 w-full mb-2"
          onChange={(e) => setDateOfBirth(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}