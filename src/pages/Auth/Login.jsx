import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      setError("Username yoki password noto'g'ri!");
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

        <h1>Mobile Store</h1>

        <p className="login-subtitle">Xush kelibsiz! Davom etish uchun tizimga kiring.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username kiriting"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password kiriting"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;