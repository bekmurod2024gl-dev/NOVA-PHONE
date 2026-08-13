import { Navigate, useLocation } from "react-router-dom";
import ManagerConfirm from "../pages/Auth/ManagerConfirm";

// type: 'admin' | 'manager' | 'user' (minimum role)
export default function ProtectedRoute({ children, role }) {
  const current = localStorage.getItem("nova_role");

  const location = useLocation();

  // If the route requires admin access, redirect to admin confirm page
  if (role === "admin") {
    if (current === "admin") return children;
    return <Navigate to="/admin" replace />;
  }

  // If the route requires manager access, redirect to manager confirm page
  if (role === "manager") {
    if (current === "manager" || current === "admin") return children;
    // If the user is trying to access the manager root path, show confirmation inline
    if (location.pathname === "/manager") {
      return <ManagerConfirm />;
    }

    return <Navigate to="/manager" replace />;
  }

  // For routes without a required role, allow access
  return children;
}
