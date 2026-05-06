import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthRoute() {
  const { user } = useContext(AuthContext);

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return <Outlet />;
}