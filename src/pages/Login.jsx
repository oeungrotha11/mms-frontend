// src/pages/Login.jsx
import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill all fields");
            return;

        }
        try {
            setLoading(true);

            const res = await API.post("/auth/login", { email, password });

            console.log("Response:", res.data);

            if (!res.data.user) {
                alert("Invalid response from server");
                return;
            }

            login(res.data);

            if (res.data.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
            if (res.data.user.status === "banned") {
                alert("Your account is banned");
                return;
            }

        } catch (err) {
            console.error(err);

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
                <h2 className="text-xl mb-4">Login</h2>

                <input
                    type="email"
                    className="border p-2 w-full mb-2"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input type="password" className="border p-2 w-full mb-2"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />

                <button onClick={handleLogin} disabled={loading}
                    className="bg-green-500 text-white w-full py-2">
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="mt-3 text-sm text-center">
                    Don't have an account?{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}