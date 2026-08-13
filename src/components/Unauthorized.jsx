import { useNavigate } from "react-router-dom";

export default function Unauthorized({ role }) {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">🔒</div>
        <h1>Ruxsat yo'q</h1>
        <p style={{ color: "#cbd5e1", marginBottom: 20 }}>
          Siz bu sahifaga kirish uchun yetarli huquqlarga ega emassiz.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/user")}>Foydalanuvchi sahifasiga o'tish</button>
          <button onClick={() => navigate(-1)}>Orqaga</button>
        </div>
      </div>
    </div>
  );
}
