import { Link } from "react-router-dom";

import { useLocale } from "../context/LocaleContext";

function NotFound() {
  const { t } = useLocale();
  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 520, textAlign: "center" }}>
        <div className="brand" style={{ fontSize: "3rem" }}>404</div>
        <h1>{t("not_found_title")}</h1>
        <p className="login-subtitle">
          Siz izlayotgan sahifa mavjud emas yoki ko'chirilgan. Asosiy sahifaga qaytib kiring.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <Link to="/" className="admin-save-button" style={{ textDecoration: "none", display: "inline-block" }}>
            Bosh sahifaga qaytish
          </Link>
          <Link to="/user" className="secondary-button" style={{ textDecoration: "none", display: "inline-block" }}>
            Foydalanuvchi paneli
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
