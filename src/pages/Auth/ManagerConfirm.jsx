import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";

function ManagerConfirm() {
  const currentRole = localStorage.getItem("nova_role");
  if (currentRole === "manager" || currentRole === "admin") {
    return <Navigate to="/manager" replace />;
  }

  const navigate = useNavigate();
  const { t } = useLocale();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (password.trim() === "manager1234") {
      localStorage.setItem("nova_role", "manager");
      localStorage.setItem("nova_display_name", "Menejer");
      navigate("/manager");
      return;
    }

    setError(t("incorrect_password") || "Password noto'g'ri");
  };

  return (
    <div className="login-page admin-confirm-page">
      <div className="login-card">
        <div className="brand">🔐</div>
        <h1>{t("manager_confirm_title") || "Manager tasdiqlash"}</h1>
        <p className="login-subtitle">{t("manager_confirm_sub") || "Manager parolini kiriting"}</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("password")}</label>
            <input
              type="password"
              placeholder={t("password") + " kiriting"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">{t("confirm") || "Tasdiqlash"}</button>
        </form>
      </div>
    </div>
  );
}

export default ManagerConfirm;
