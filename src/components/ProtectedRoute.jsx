import { Navigate } from "react-router-dom";
import Unauthorized from "./Unauthorized";

// type: 'admin' | 'manager' | 'user' (minimum role)
export default function ProtectedRoute({ children, role }) {
  const current = localStorage.getItem("nova_role");

  // If the route requires admin access, show unauthorized component instead of redirecting to login
  if (role === "admin") {
    if (current === "admin") return children;
    return <Unauthorized role="admin" />;
  }

  // If the route requires manager access, allow managers and admins only
  if (role === "manager") {
    if (current === "manager" || current === "admin") return children;
    return <Unauthorized role="manager" />;
  }

  // For routes without a required role, allow access
  return children;
}
