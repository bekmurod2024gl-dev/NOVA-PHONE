import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { getCurrentRole, setSessionUser } from "../../utils/userStorage";

function AdminConfirm() {
  const currentRole = getCurrentRole();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleBack = () => {
    const from = location.state?.from;
    if (from === "/user") {
      navigate("/user", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (password.trim() === "jumaboyevAdmin1234") {
      setSessionUser({
        id: "admin",
        username: "bobomurod",
        email: "admin@nova-phone.uz",
        password: "jumaboyevAdmin1234",
        role: "admin",
      });
      navigate("/admin/dashboard");
      return;
    }

    setError(t("incorrect_password"));
  };

  return (
    <div className="login-page admin-confirm-page">
      <div className="login-card">
        <div className="brand">🔐</div>
        <h1>{t("admin_confirm_title")}</h1>
        <p className="login-subtitle">{t("admin_confirm_sub")}</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("password")}</label>
            <input
              type="password"
              placeholder={t("admin_confirm_password_placeholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="submit" style={{ flex: 1 }}>{t("confirm")}</button>
            <button
              type="button"
              style={{ flex: 1, background: "rgba(255,255,255,0.08)", color: "#fff" }}
              onClick={handleBack}
            >
              Orqaga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminConfirm;
