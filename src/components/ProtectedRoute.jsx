import { Navigate } from "react-router-dom";

// type: 'admin' | 'manager' | 'user' (minimum role)
export default function ProtectedRoute({ children, role }) {
  const current = localStorage.getItem("nova_role");

  if (role === "admin" && current !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "manager") {
    if (!current || ["manager", "admin"].includes(current)) {
      if (!current) {
        localStorage.setItem("nova_role", "manager");
        localStorage.setItem("nova_display_name", "Menejer");
      }
      return children;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}
