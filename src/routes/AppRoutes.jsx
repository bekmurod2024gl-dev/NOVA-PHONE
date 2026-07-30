import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";

import UserDashboard from "../pages/user/UserDashboard";
import Products from "../pages/user/Products";
import Liked from "../pages/user/Liked";
import Buy from "../pages/user/Buy";
import UserLayout from "../pages/user/UserLayout";

import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import Approvals from "../pages/Manager/Approvals";
import Attendance from "../pages/Manager/Attendance";
import Reviews from "../pages/Manager/Reviews";
import DamagedItems from "../pages/Manager/DamagedItems";

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

import DashboardLayout from "../layouts/DashboardLayout";
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
      <Route element={<DashboardLayout />}>
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/orders" element={<Orders />} />
        <Route path="/manager/sales" element={<Sales />} />
        <Route path="/manager/warehouse" element={<Warehouse />} />
        <Route path="/manager/approvals" element={<Approvals />} />
        <Route path="/manager/attendance" element={<Attendance />} />
        <Route path="/manager/reviews" element={<Reviews />} />
        <Route path="/manager/damaged" element={<DamagedItems />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/sales" element={<Sales />} />
        <Route path="/admin/warehouse" element={<Warehouse />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/promotions" element={<Promotions />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;