import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { useLocale } from "../../context/LocaleContext";
import { loginAccount, registerAccount, resetAccountPassword } from "../../utils/userStorage";
import LanguageSwitcher from "../../components/LanguageSwitcher";

function Login() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [forgotPassword, setForgotPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const cleanNewPassword = newPassword.trim();

    if (forgotPassword) {
      if (!cleanUsername) {
        setError("Username kiriting!");
        return;
      }
      if (!cleanNewPassword) {
        setError("Yangi parolni kiriting!");
        return;
      }
      try {
        resetAccountPassword({ username: cleanUsername, newPassword: cleanNewPassword });
        setForgotPassword(false);
        setPassword("");
        setNewPassword("");
        setSuccess("Parolingiz muvaffaqiyatli yangilandi! Yangi parol bilan kiring.");
      } catch (err) {
        setError(err.message || "Xatolik yuz berdi!");
      }
      return;
    }

    if (mode === "register") {
      if (!cleanUsername) {
        setError("Username kiriting!");
        return;
      }
      if (!cleanPassword) {
        setError("Parol kiriting!");
        return;
      }
      if (cleanPassword.length < 4) {
        setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
        return;
      }

      try {
        registerAccount({ username: cleanUsername, password: cleanPassword });
        navigate("/user");
      } catch (err) {
        setError(err.message || "Ro'yxatdan o'tishda xatolik!");
      }
      return;
    }

    // Login mode
    if (!cleanUsername) {
      setError("Username kiriting!");
      return;
    }
    if (!cleanPassword) {
      setError("Parolni kiriting!");
      return;
    }

    try {
      const user = loginAccount({ username: cleanUsername, password: cleanPassword });
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }
      if (user?.role === "manager") {
        navigate("/manager");
        return;
      }
      navigate("/user");
    } catch (err) {
      setError(err.message || "Kirishda xatolik yuz berdi!");
    }
  }

  return (
    <div className="login-page">
      <div className="login-top-bar">
        <LanguageSwitcher />
      </div>

      <div className="login-card">
        <div className="brand">
          <img src="/images/logo.png" alt="NOVA PHONE" />
        </div>

        <h1>{forgotPassword ? "Parolni tiklash" : t("mobile_store")}</h1>
        <p className="login-subtitle">
          {forgotPassword
            ? "Yangi parol o'rnatish uchun username kiriting"
            : mode === "login"
            ? t("login_welcome")
            : "Yangi akkaunt yaratish uchun username va parol kiriting"}
        </p>

        {!forgotPassword && (
          <div className="auth-segmented-control" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-segmented-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              🔑 {t("sign_in")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={`auth-segmented-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
            >
              📝 Ro'yxatdan o'tish
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="auth-username">{t("username")}</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">👤</span>
              <input
                id="auth-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder={mode === "register" ? "Yangi username tanlang" : "Username kiriting"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {!forgotPassword && (
            <div className="input-group">
              <label htmlFor="auth-password">{t("password")}</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  placeholder={mode === "register" ? "Parol yarating (kamida 4 belgi)" : "Parolni kiriting"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {forgotPassword && (
            <div className="input-group">
              <label htmlFor="auth-new-password">Yangi parol</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="auth-new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Yangi parolni kiriting (kamida 4 belgi)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {error && <div className="auth-alert error">⚠️ {error}</div>}
          {success && <div className="auth-alert success">✅ {success}</div>}

          <button type="submit" className="auth-submit-btn">
            {forgotPassword
              ? "Parolni yangilash"
              : mode === "login"
              ? t("sign_in")
              : "Ro'yxatdan o'tish"}
          </button>

          {mode === "login" && !forgotPassword && (
            <div className="auth-extra-links">
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setForgotPassword(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Parolni unutdingizmi?
              </button>
            </div>
          )}

          {forgotPassword && (
            <div className="auth-extra-links">
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setForgotPassword(false);
                  setError("");
                  setSuccess("");
                }}
              >
                ← Kirish sahifasiga qaytish
              </button>
            </div>
          )}

          {error && error.includes("ro'yxatdan o'tmagansiz") && !forgotPassword && mode === "login" && (
            <div className="auth-extra-links" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="auth-link-btn highlight"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Akkaunt yaratish uchun ro'yxatdan o'ting →
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;