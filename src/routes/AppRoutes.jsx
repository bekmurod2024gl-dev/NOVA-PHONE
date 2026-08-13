import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";

import UserLayout from "../pages/User/UserLayout";
import UserDashboard from "../pages/User/UserDashboard";
import Products from "../pages/User/Products";
import Liked from "../pages/User/Liked";
import Buy from "../pages/User/Buy";

import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import Approvals from "../pages/Manager/Approvals";
import Attendance from "../pages/Manager/Attendance";
import Reviews from "../pages/Manager/Reviews";
import DamagedItems from "../pages/Manager/Damageditems";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProducts from "../pages/Admin/Products";
import Orders from "../pages/Admin/Orders";
import Sales from "../pages/Admin/Sales";
import Warehouse from "../pages/Admin/Warehouse";
import Users from "../pages/Admin/Users";
import Employees from "../pages/Admin/Employees";
import Analytics from "../pages/Admin/Analytics";
import Promotions from "../pages/Admin/Promotions";
import Settings from "../pages/Admin/Settings";
import AdminConfirm from "../pages/Auth/AdminConfirm";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* USER — o'z alohida layout'i bilan */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="liked" element={<Liked />} />
        <Route path="buy" element={<Buy />} />
      </Route>

      {/* MANAGER va ADMIN — umumiy DashboardLayout bilan */}
      <Route path="/admin" element={<AdminConfirm />} />

      <Route element={<DashboardLayout />}>
        <Route path="/manager" element={<ProtectedRoute role="manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/orders" element={<ProtectedRoute role="manager"><Orders /></ProtectedRoute>} />
        <Route path="/manager/sales" element={<ProtectedRoute role="manager"><Sales /></ProtectedRoute>} />
        <Route path="/manager/warehouse" element={<ProtectedRoute role="manager"><Warehouse /></ProtectedRoute>} />
        <Route path="/manager/approvals" element={<ProtectedRoute role="manager"><Approvals /></ProtectedRoute>} />
        <Route path="/manager/attendance" element={<ProtectedRoute role="manager"><Attendance /></ProtectedRoute>} />
        <Route path="/manager/reviews" element={<ProtectedRoute role="manager"><Reviews /></ProtectedRoute>} />
        <Route path="/manager/damaged" element={<ProtectedRoute role="manager"><DamagedItems /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="admin"><Orders /></ProtectedRoute>} />
        <Route path="/admin/sales" element={<ProtectedRoute role="admin"><Sales /></ProtectedRoute>} />
        <Route path="/admin/warehouse" element={<ProtectedRoute role="admin"><Warehouse /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute role="admin"><Employees /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute role="admin"><Promotions /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;