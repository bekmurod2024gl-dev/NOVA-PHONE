import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";

function AdminConfirm() {
  const currentRole = localStorage.getItem("nova_role");
  if (currentRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  const navigate = useNavigate();
  const { t } = useLocale();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (password.trim() === "jumaboyevAdmin1234") {
      localStorage.setItem("nova_role", "admin");
      localStorage.setItem("nova_display_name", "Bobomurod");
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

          <button type="submit">{t("confirm")}</button>
        </form>
      </div>
    </div>
  );
}

export default AdminConfirm;
