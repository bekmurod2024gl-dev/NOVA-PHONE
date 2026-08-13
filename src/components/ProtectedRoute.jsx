import { Navigate } from "react-router-dom";

// type: 'admin' | 'manager' | 'user' (minimum role)
export default function ProtectedRoute({ children, role }) {
  const current = localStorage.getItem("nova_role");

  // If the route requires admin access, send to admin confirm page
  if (role === "admin") {
    if (current === "admin") return children;
    // not an admin: go to admin confirm page (will ask for admin password)
    return <Navigate to="/admin" replace />;
  }

  // If the route requires manager access, allow managers and admins only
  if (role === "manager") {
    if (current === "manager" || current === "admin") return children;
    // not authenticated as manager/admin: redirect to login
    return <Navigate to="/" replace />;
  }

  // For routes without a required role, allow access
  return children;
}
