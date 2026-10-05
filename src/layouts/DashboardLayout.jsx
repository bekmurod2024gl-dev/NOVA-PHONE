import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { useEffect, useMemo, useState } from "react";
import { clearSessionUser, getCurrentRole, getSessionUser, safeParse } from "../utils/userStorage";
import LanguageSwitcher from "../components/LanguageSwitcher";

const MENUS = {
  admin: {
    profileLabel: "admin_role",
    profileIcon: "👑",
    sections: [
      {
        title: null,
        links: [{ to: "/admin/dashboard", label: "nav_dashboard", icon: "📊", end: true }],
      },
      {
        title: "section_shop",
        links: [
          { to: "/admin/products", label: "nav_products", icon: "📱" },
          { to: "/admin/orders", label: "nav_orders", icon: "🛒" },
          { to: "/admin/sales", label: "nav_sales", icon: "💰" },
          { to: "/admin/warehouse", label: "nav_warehouse", icon: "📦" },
        ],
      },
      {
        title: "section_people",
        links: [
          { to: "/admin/users", label: "nav_users", icon: "👥" },
          { to: "/admin/employees", label: "nav_employees", icon: "👨‍💼" },
          { to: "/employee", label: "nav_employee_panel", icon: "👷‍♂️" },
        ],
      },
      {
        title: "section_analytics",
        links: [
          { to: "/admin/analytics", label: "nav_analytics", icon: "📈" },
          { to: "/admin/promotions", label: "nav_promotions", icon: "🎟️" },
        ],
      },
      {
        title: "section_system",
        links: [{ to: "/admin/settings", label: "nav_settings", icon: "⚙️" }],
      },
    ],
  },

  manager: {
    profileLabel: "manager_role",
    profileIcon: "👨‍💼",
    sections: [
      {
        title: null,
        links: [{ to: "/manager", label: "nav_dashboard", icon: "📊", end: true }],
      },
      {
        title: "section_shop",
        links: [
          { to: "/manager/orders", label: "nav_orders", icon: "🛒" },
          { to: "/manager/sales", label: "nav_sales", icon: "💰" },
          { to: "/manager/warehouse", label: "nav_warehouse", icon: "📦" },
        ],
      },
      {
        title: "section_operations",
        links: [
          { to: "/manager/approvals", label: "nav_approvals", icon: "🔔" },
          { to: "/manager/attendance", label: "nav_attendance", icon: "🧑‍💼" },
          { to: "/manager/workers", label: "nav_workers", icon: "💼" },
          { to: "/manager/reviews", label: "nav_reviews", icon: "💬" },
          { to: "/manager/damaged", label: "nav_damaged", icon: "🔧" },
        ],
      },
    ],
  },

  user: {
    profileLabel: "customer_role",
    profileIcon: "🙂",
    sections: [
      {
        title: null,
        links: [{ to: "/user", label: "nav_dashboard", icon: "📊", end: true }],
      },
    ],
  },
};

function DashboardLayout() {
  const navigate = useNavigate();
  const { lang, t } = useLocale();

  const role = getCurrentRole() || "user";
  const [profileData, setProfileData] = useState(() => {
    const sessionUser = getSessionUser();
    const savedSettings = safeParse(localStorage.getItem("nova_settings_v1"), null);
    const savedName = localStorage.getItem("nova_display_name");
    const isOldName = savedSettings?.profile?.name === "Bobomurod Egamberdiyev" || savedName === "Bobomurod Egamberdiyev" || savedName === "Bobomurod Egamberdiyev bobomurod";

    const name = role === "user"
      ? sessionUser?.username || sessionUser?.displayName || "Foydalanuvchi"
      : (!isOldName && savedSettings?.profile?.name) ||
        (!isOldName && savedName) ||
        sessionUser?.displayName ||
        (role === "admin" ? "Bobomurod jumaboyev" : "Foydalanuvchi");

    const position =
      savedSettings?.profile?.position ||
      localStorage.getItem("nova_position") ||
      (role === "admin" ? "Bosh administrator" : role === "manager" ? "Menejer" : "Foydalanuvchi");

    return { name, position };
  });

  useEffect(() => {
    const syncProfile = () => {
      const sessionUser = getSessionUser();
      const savedSettings = safeParse(localStorage.getItem("nova_settings_v1"), null);
      const savedName = localStorage.getItem("nova_display_name");
      const isOldName = savedSettings?.profile?.name === "Bobomurod Egamberdiyev" || savedName === "Bobomurod Egamberdiyev" || savedName === "Bobomurod Egamberdiyev bobomurod";

      const name = role === "user"
        ? sessionUser?.username || sessionUser?.displayName || "Foydalanuvchi"
        : (!isOldName && savedSettings?.profile?.name) ||
          (!isOldName && savedName) ||
          sessionUser?.displayName ||
          (role === "admin" ? "Bobomurod jumaboyev" : "Foydalanuvchi");

      const position =
        savedSettings?.profile?.position ||
        localStorage.getItem("nova_position") ||
        (role === "admin" ? "Bosh administrator" : role === "manager" ? "Menejer" : "Foydalanuvchi");

      setProfileData({ name, position });
    };

    window.addEventListener("nova_profile_updated", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("nova_profile_updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, [role]);

  const menu = MENUS[role] || MENUS.user;

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("nova_sidebar_open");
    if (window.matchMedia("(max-width: 768px)").matches) return false;
    return saved !== "false";
  });
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
    clearSessionUser();
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
    <div className={`dashboard-layout ${sidebarOpen ? "sidebar-open" : "collapsed"}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <div className="logo-icon"><img src="/images/logo.png" alt="NOVA PHONE" /></div>
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
                {section.title && sidebarOpen && <p>{t(section.title)}</p>}

                {section.links.map((link) => (
                  <NavLink
                    to={link.to}
                    end={link.end}
                    key={link.to}
                    className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
                  >
                    <span>{link.icon}</span>
                    {sidebarOpen && <span>{t(link.label)}</span>}
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
            <strong>{profileData.name}</strong>
            <span>{role === "admin" ? (profileData.position || "Bosh administrator") : t(menu.profileLabel)}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-lang">
            <LanguageSwitcher compact />
          </div>

          <button className="logout-button" onClick={handleLogout}>
            🚪
            {sidebarOpen && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label={t("collapse_sidebar")}
        />
      )}

      <main className="dashboard-content">
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("expand_sidebar")}
            >
              ☰
            </button>
            <div>
              <p className="topbar-greeting">
                {greeting}, <strong>{profileData.name}</strong>
              </p>
              <span className="topbar-subtitle">
                {t("today_is")} {new Date().toLocaleDateString(lang)}
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <LanguageSwitcher compact />
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