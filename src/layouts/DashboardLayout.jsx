import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { useEffect, useMemo, useState } from "react";

const MENUS = {
  admin: {
    profileLabel: "Administrator",
    profileIcon: "👑",
    sections: [
      {
        title: null,
        links: [{ to: "/admin/dashboard", label: "Dashboard", icon: "📊", end: true }],
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
  const { lang, setLang, t } = useLocale();

  const role = localStorage.getItem("nova_role") || "user";
  const displayName = localStorage.getItem("nova_display_name") || "Foydalanuvchi";
  const menu = MENUS[role] || MENUS.user;

  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("nova_sidebar_open") !== "false");
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("nova_theme") || "dark");
  const [menuFilter, setMenuFilter] = useState("");

  const filteredSections = useMemo(() => {
    const query = menuFilter.trim().toLowerCase();
    if (!query) return menu.sections;

    return menu.sections
      .map((section) => {
        const links = section.links.filter((link) => link.label.toLowerCase().includes(query));
        return links.length ? { ...section, links } : null;
      })
      .filter(Boolean);
  }, [menu.sections, menuFilter]);

  useEffect(() => {
    localStorage.setItem("nova_sidebar_open", String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("nova_theme", themeMode);
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  function handleLogout() {
    localStorage.removeItem("nova_role");
    localStorage.removeItem("nova_display_name");
    navigate("/");
  }

  function handleQuickAction() {
    const actionRoute = role === "admin" ? "/admin/products" : role === "manager" ? "/manager/approvals" : "/user/products";
    navigate(actionRoute);
  }

  const hours = new Date().getHours();
  const greeting =
    hours < 12
      ? t("good_morning")
      : hours < 18
        ? t("good_afternoon")
        : t("good_evening");

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "" : "collapsed"}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-icon">📱</div>
            <div>
              <h2>{t("mobile_store")}</h2>
              <span>{t("management_system")}</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? t("collapse_sidebar") : t("expand_sidebar")}
          >
            {sidebarOpen ? "⬅️" : "➡️"}
          </button>
        </div>

        <div className="sidebar-search">
          <input
            type="search"
            value={menuFilter}
            onChange={(e) => setMenuFilter(e.target.value)}
            placeholder={t("search_menu")}
            aria-label={t("search_menu")}
          />
        </div>

        <nav className="sidebar-menu">
          {filteredSections.length ? (
            filteredSections.map((section, index) => (
              <div className={section.title && sidebarOpen ? "menu-section" : undefined} key={index}>
                {section.title && sidebarOpen && <p>{section.title}</p>}

                {section.links.map((link) => (
                  <NavLink
                    to={link.to}
                    end={link.end}
                    key={link.to}
                    className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
                  >
                    <span>{link.icon}</span>
                    {sidebarOpen && <span>{link.label}</span>}
                  </NavLink>
                ))}
              </div>
            ))
          ) : (
            <p className="menu-empty">{t("no_menu_match")}</p>
          )}
        </nav>

        <div className="sidebar-profile">
          <div className="profile-avatar">{menu.profileIcon}</div>
          <div className="profile-info">
            <strong>{displayName}</strong>
            <span>{menu.profileLabel}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-lang">
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            🚪
            {sidebarOpen && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <div>
              <p className="topbar-greeting">
                {greeting}, <strong>{displayName}</strong>
              </p>
              <span className="topbar-subtitle">
                {t("today_is")} {new Date().toLocaleDateString(lang)}
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="action-button" type="button" onClick={handleQuickAction}>
              ⚡ {role === "admin" ? t("quick_add") : role === "manager" ? t("quick_review") : t("quick_shop")}
            </button>
            <button
              className="action-button"
              type="button"
              onClick={() => setThemeMode((mode) => (mode === "dark" ? "light" : "dark"))}
            >
              {themeMode === "dark" ? "🌙" : "☀️"} {themeMode === "dark" ? t("dark_mode") : t("light_mode")}
            </button>
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>{t("notifications")}</h3>
            <p>{t("notifications_sub")}</p>
          </div>

          <div className="summary-card accent">
            <h3>{t("sidebar_label")}</h3>
            <p>{sidebarOpen ? t("sidebar_expanded") : t("sidebar_collapsed")}</p>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;