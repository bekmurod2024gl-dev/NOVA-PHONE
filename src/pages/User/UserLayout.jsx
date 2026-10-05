import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSessionUser, getSessionUser, getUserDisplayName } from "../../utils/userStorage";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLocale } from "../../context/LocaleContext";

function UserLayout() {
  const navigate = useNavigate();
  const currentUser = getSessionUser();
  const displayName = getUserDisplayName(currentUser);
  const { t } = useLocale();

  function handleLogout() {
    clearSessionUser();
    navigate("/");
  }

  return (
    <div className="user-layout">
      {/* CHAP TARAF - SIDEBAR */}
      <aside className="user-sidebar">
        {/* LOGO */}
        <div className="user-sidebar-logo">
          <div className="logo-icon">
            <img src="/images/logo.png" alt="NOVA PHONE" />
          </div>
          <div>
            <h2>NOVA PHONE</h2>
            <span>{t("online_store")}</span>
          </div>
        </div>

        {/* TIL ALMASHTIRISH (SIDEBAR) */}
        <div className="user-sidebar-lang" style={{ marginBottom: 16 }}>
          <LanguageSwitcher compact />
        </div>

        {/* MENYULAR */}
        <nav className="user-sidebar-menu">
          <NavLink to="/user" className="user-menu-link" end>
            <span>📊</span> {t("nav_home")}
          </NavLink>

          <p className="user-menu-title">{t("sections")}</p>

          <NavLink to="/user/products" className="user-menu-link">
            <span>📱</span> {t("nav_products_user")}
          </NavLink>
          <NavLink to="/user/liked" className="user-menu-link">
            <span>❤️</span> {t("nav_favorites")}
          </NavLink>
          <NavLink to="/user/buy" className="user-menu-link">
            <span>🛒</span> {t("nav_cart")}
          </NavLink>
        </nav>

        {/* PROFIL */}
        <div className="user-sidebar-profile">
          <div className="profile-avatar">🙂</div>
          <div className="profile-info">
            <strong>{displayName}</strong>
            <span>{t("customer_role")}</span>
          </div>
        </div>

        {/* CHIQISH */}
        <button className="user-logout-btn" onClick={handleLogout}>
          🚪 {t("logout") || "Chiqish"}
        </button>
      </aside>

      {/* O'NG TARAF - KONTENT */}
      <main className="user-content">
        <header className="user-content-header" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <LanguageSwitcher />
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;