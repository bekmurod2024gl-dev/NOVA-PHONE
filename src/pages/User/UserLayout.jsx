import { NavLink, Outlet, useNavigate } from "react-router-dom";

function UserLayout() {
  const navigate = useNavigate();
  const displayName = localStorage.getItem("nova_display_name") || "Foydalanuvu";

  function handleLogout() {
    localStorage.removeItem("nova_role");
    localStorage.removeItem("nova_display_name");
    navigate("/");
  }

  return (
    <div className="user-layout">
      {/* CHAP TARAF - SIDEBAR */}
      <aside className="user-sidebar">
        
        {/* LOGO */}
        <div className="user-sidebar-logo">
          <div className="logo-icon">📱</div>
          <div>
            <h2>NOVA PHONE</h2>
            <span>Online Do'kon</span>
          </div>
        </div>

        {/* MENYULAR (To'g'ridan-to'g'ri yozildi, xato bermaydi) */}
        <nav className="user-sidebar-menu">
          <NavLink to="/user" className="user-menu-link" end>
            <span>📊</span> Bosh sahifa
          </NavLink>

          <p className="user-menu-title">BO'LIMLAR</p>
          
          <NavLink to="/user/products" className="user-menu-link">
            <span>📱</span> Mahsulotlar
          </NavLink>
          <NavLink to="/user/liked" className="user-menu-link">
            <span>❤️</span> Sevimlilar
          </NavLink>
          <NavLink to="/user/buy" className="user-menu-link">
            <span>🛒</span> Savatcha
          </NavLink>
        </nav>

        {/* PROFIL */}
        <div className="user-sidebar-profile">
          <div className="profile-avatar">🙂</div>
          <div className="profile-info">
            <strong>{displayName}</strong>
            <span>Mijoz</span>
          </div>
        </div>

        {/* CHIQISH */}
        <button className="user-logout-btn" onClick={handleLogout}>
          🚪 Chiqish
        </button>
      </aside>

      {/* O'NG TARAF - KONTENT */}
      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;