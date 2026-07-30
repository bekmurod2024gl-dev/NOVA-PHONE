import { NavLink, Outlet, useNavigate } from "react-router-dom";

const MENUS = {
  admin: {
    profileLabel: "Administrator",
    profileIcon: "👑",
    sections: [
      {
        title: null,
        links: [{ to: "/admin", label: "Dashboard", icon: "📊", end: true }],
      },
      {
        title: "SHOP",
        links: [
          { to: "/admin/products", label: "Products", icon: "📱" },
          { to: "/admin/orders", label: "Orders", icon: "🛒" },
          { to: "/admin/sales", label: "Sales", icon: "💰" },
          { to: "/admin/warehouse", label: "Warehouse", icon: "📦" },
        ],
      },
      {
        title: "PEOPLE",
        links: [
          { to: "/admin/users", label: "Users", icon: "👥" },
          { to: "/admin/employees", label: "Employees", icon: "👨‍💼" },
        ],
      },
      {
        title: "ANALYTICS",
        links: [
          { to: "/admin/analytics", label: "Analytics", icon: "📈" },
          { to: "/admin/promotions", label: "Promotions", icon: "🎟️" },
        ],
      },
      {
        title: "SYSTEM",
        links: [{ to: "/admin/settings", label: "Settings", icon: "⚙️" }],
      },
    ],
  },

  manager: {
    profileLabel: "Menejer",
    profileIcon: "👨‍💼",
    sections: [
      {
        title: null,
        links: [{ to: "/manager", label: "Dashboard", icon: "📊", end: true }],
      },
      {
        title: "SHOP",
        links: [
          { to: "/manager/orders", label: "Orders", icon: "🛒" },
          { to: "/manager/sales", label: "Sales", icon: "💰" },
          { to: "/manager/warehouse", label: "Warehouse", icon: "📦" },
        ],
      },
      {
        title: "OPERATIONS",
        links: [
          { to: "/manager/approvals", label: "Tasdiqlash", icon: "🔔" },
          { to: "/manager/attendance", label: "Davomat", icon: "🧑‍💼" },
          { to: "/manager/reviews", label: "Izohlar", icon: "💬" },
          { to: "/manager/damaged", label: "Zararlar", icon: "🔧" },
        ],
      },
    ],
  },

  user: {
    profileLabel: "Foydalanuvchi",
    profileIcon: "🙂",
    sections: [
      {
        title: null,
        links: [{ to: "/user", label: "Dashboard", icon: "📊", end: true }],
      },
    ],
  },
};

function DashboardLayout() {
  const navigate = useNavigate();

  const role = localStorage.getItem("nova_role") || "user";
  const displayName = localStorage.getItem("nova_display_name") || "Foydalanuvchi";
  const menu = MENUS[role] || MENUS.user;

  function handleLogout() {
    localStorage.removeItem("nova_role");
    localStorage.removeItem("nova_display_name");
    navigate("/");
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* LOGO */}
        <div className="sidebar-logo">
          <div className="logo-icon">📱</div>
          <div>
            <h2>Mobile Store</h2>
            <span>Management System</span>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="sidebar-menu">
          {menu.sections.map((section, index) => (
            <div className={section.title ? "menu-section" : undefined} key={index}>
              {section.title && <p>{section.title}</p>}

              {section.links.map((link) => (
                <NavLink to={link.to} className="menu-link" end={link.end} key={link.to}>
                  <span>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* USER PROFILE */}
        <div className="sidebar-profile">
          <div className="profile-avatar">{menu.profileIcon}</div>
          <div className="profile-info">
            <strong>{displayName}</strong>
            <span>{menu.profileLabel}</span>
          </div>
        </div>

        {/* LOGOUT */}
        <button className="logout-button" onClick={handleLogout}>
          🚪
          <span>Logout</span>
        </button>
      </aside>

      {/* CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;