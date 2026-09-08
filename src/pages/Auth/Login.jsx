import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { useLocale } from "../../context/LocaleContext";
import { loginAccount, registerAccount, resetAccountPassword } from "../../utils/userStorage";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useLocale();

  function handleLogin(event) {
    event.preventDefault();

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    setError("");

    if (forgotPassword) {
      try {
        resetAccountPassword({ username: cleanUsername, email: resetEmail, newPassword });
        setForgotPassword(false);
        setPassword("");
        setNewPassword("");
        setResetEmail("");
        setError("Parol yangilandi. Endi yangi parol bilan kiring.");
      } catch (resetError) {
        setError(resetError.message);
      }
      return;
    }

    if (!cleanPassword) {
      setError("Parolni kiriting!");
      return;
    }

    try {
      if (mode === "register") {
        if (!cleanUsername) {
          setError("Username kiriting!");
          return;
        }
        if (!cleanEmail) {
          setError("Email kiriting!");
          return;
        }
        registerAccount({ username: cleanUsername, email: cleanEmail, password: cleanPassword });
        navigate("/user");
        return;
      }

      if (!cleanUsername) {
        setError("Username kiriting!");
        return;
      }

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
    } catch (loginError) {
      setError(loginError.message || "Kirishda xatolik yuz berdi!");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand"><img src="/images/logo.png" alt="NOVA PHONE" /></div>

        <h1>{forgotPassword ? "Parolni tiklash" : t("mobile_store")}</h1>
        <p className="login-subtitle">{forgotPassword ? "Akkauntingizni tasdiqlash uchun ma'lumotlarni kiriting" : t("login_welcome")}</p>

        {!forgotPassword && <div className="auth-toggle" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button type="button" className={mode === "login" ? "admin-save-button" : "secondary-button"} onClick={() => setMode("login")}>Kirish</button>
          <button type="button" className={mode === "register" ? "admin-save-button" : "secondary-button"} onClick={() => setMode("register")}>Ro'yxatdan o'tish</button>
        </div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>{t("username")}</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete={mode === "register" ? "username" : "username"}
              placeholder={mode === "register" ? "Yangi username kiriting" : "Username kiriting"}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          {mode === "register" && (
            <div className="input-group">
              <label>Email</label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email kiriting"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          )}

          {!forgotPassword && <div className="input-group">
            <label>{t("password")}</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              placeholder={t("password") + " kiriting"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>}

          {error && <p className="error-message">{error}</p>}

          {forgotPassword && (
            <div className="input-group">
              <label>Ro'yxatdan o'tgan email</label>
              <input id="reset-email" name="resetEmail" type="email" autoComplete="email" placeholder="Email kiriting" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} required />
              <label>Yangi parol</label>
              <input id="new-password" name="newPassword" type="password" autoComplete="new-password" placeholder="Yangi parol kiriting" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            </div>
          )}

          <button type="submit">{forgotPassword ? "Parolni yangilash" : mode === "login" ? t("sign_in") : "Ro'yxatdan o'tish"}</button>

          {mode === "login" && !forgotPassword && (
            <button type="button" className="secondary-button auth-help-button" onClick={() => { setForgotPassword(true); setError(""); }}>Parolni unutdingizmi? Yordam berish</button>
          )}

          {forgotPassword && (
            <button type="button" className="secondary-button auth-help-button" onClick={() => { setForgotPassword(false); setError(""); }}>Kirishga qaytish</button>
          )}

          {error && error.includes("ro'yxatdan o'tmagansiz") && (
            <button type="button" className="secondary-button auth-help-button" onClick={() => { setMode("register"); setForgotPassword(false); setError(""); }}>Shaxsingizni tasdiqlash uchun ro'yxatdan o'ting</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;