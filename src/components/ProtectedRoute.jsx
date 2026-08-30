import { Navigate, useLocation } from "react-router-dom";
import ManagerConfirm from "../pages/Auth/ManagerConfirm";
import { getCurrentRole, getSessionUser } from "../utils/userStorage";

export default function ProtectedRoute({ children, role }) {
  const currentRole = getCurrentRole();
  const sessionUser = getSessionUser();
  const location = useLocation();

  const isAuthenticated = Boolean(sessionUser && sessionUser.role === currentRole);

  if (role === "admin") {
    if (isAuthenticated && currentRole === "admin") return children;
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  if (role === "manager") {
    if (isAuthenticated && currentRole === "manager") return children;

    if (location.pathname === "/manager") {
      return <ManagerConfirm />;
    }

    return <Navigate to="/manager" replace state={{ from: location.pathname }} />;
  }

  if (!sessionUser) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
