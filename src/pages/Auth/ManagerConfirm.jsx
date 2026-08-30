import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { getCurrentRole, setSessionUser } from "../../utils/userStorage";

function ManagerConfirm() {
  const currentRole = getCurrentRole();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (currentRole === "manager") {
    return <Navigate to="/manager" replace />;
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

    if (password.trim() === "manager123") {
      setSessionUser({
        id: "manager",
        username: "manager",
        email: "manager@nova-phone.uz",
        password: "manager123",
        role: "manager",
      });
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

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="submit" style={{ flex: 1 }}>{t("confirm") || "Tasdiqlash"}</button>
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

export default ManagerConfirm;
