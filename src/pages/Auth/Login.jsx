import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { useLocale } from "../../context/LocaleContext";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useLocale();

  function handleLogin(event) {
    event.preventDefault();

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    setError("");

    // ADMIN
    if (cleanUsername === "bobomurod" && cleanPassword === "jumaboyevAdmin1234") {
      localStorage.setItem("nova_role", "admin");
      localStorage.setItem("nova_display_name", "Bobomurod");
      navigate("/admin");
      return;
    }

    // MANAGER
    if (cleanUsername === "manager" && cleanPassword === "manager1234") {
      localStorage.setItem("nova_role", "manager");
      localStorage.setItem("nova_display_name", "Menejer");
      navigate("/manager");
      return;
    }

    // Maxsus username'lar noto'g'ri password bilan
    if (cleanUsername === "bobomurod" || cleanUsername === "manager") {
      setError(t("username") + " yoki password noto'g'ri!");
      return;
    }

    // Oddiy USER
    if (cleanUsername && cleanPassword) {
      localStorage.setItem("nova_role", "user");
      localStorage.setItem("nova_display_name", cleanUsername);
      navigate("/user");
      return;
    }

    // Bo'sh inputlar
    setError("Iltimos, barcha maydonlarni to'ldiring!");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">📱</div>

          <h1>{t("mobile_store")}</h1>

          <p className="login-subtitle">{t("login_welcome")}</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
          <label>{t("username")}</label>
            <input
              type="text"
              placeholder={t("username") + " kiriting"}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

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

          <button type="submit">{t("sign_in")}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;