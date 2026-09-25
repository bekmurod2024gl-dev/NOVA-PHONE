import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSessionUser, getAccounts, safeParse } from "../../utils/userStorage";

export default function EmployeeDashboard() {
  const [currentUser, setCurrentUser] = useState(() => getSessionUser());
  const [shiftActive, setShiftActive] = useState(() => {
    return localStorage.getItem("nova_employee_shift") === "true";
  });
  const [tasks, setTasks] = useState(() => {
    const saved = safeParse(localStorage.getItem("nova_employee_tasks"), null);
    return (
      saved || [
        { id: 1, text: "Yangi kelgan iPhone 15 partiyasini omborga kiritish", done: true },
        { id: 2, text: "Buyurtmachilarga yetkazib berish holati bo'yicha xabar berish", done: false },
        { id: 3, text: "Vitrinadagi telefonlarni tozalash va narxlarni yangilash", done: true },
        { id: 4, text: "Kechki savdo hisobotini tayyorlash", done: false },
      ]
    );
  });
  const [vacationModal, setVacationModal] = useState(false);
  const [vacationNote, setVacationNote] = useState("");
  const [vacationSent, setVacationSent] = useState(false);

  useEffect(() => {
    localStorage.setItem("nova_employee_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Find employee data from accounts
  const accounts = getAccounts();
  const matchedAccount = accounts.find((a) => a.id === currentUser?.id || a.email === currentUser?.email);

  const employeeName = currentUser?.displayName || currentUser?.username || "Xodim";
  const position = matchedAccount?.position || currentUser?.position || "Sotuvchi-maslahatchi";
  const salary = Number(matchedAccount?.salary || 5000000);
  const bonus = Math.round(salary * 0.15);
  const totalPay = salary + bonus;
  const hiredDate = matchedAccount?.hired || matchedAccount?.createdAt || "2026-08-01";
  const phone = matchedAccount?.phone || currentUser?.phone || "+998 90 000 00 00";

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleToggleShift = () => {
    const next = !shiftActive;
    setShiftActive(next);
    localStorage.setItem("nova_employee_shift", String(next));
  };

  const handleSendVacation = (e) => {
    e.preventDefault();
    setVacationSent(true);
    setTimeout(() => {
      setVacationModal(false);
      setVacationSent(false);
      setVacationNote("");
    }, 2000);
  };

  const formatPrice = (p) => new Intl.NumberFormat("uz-UZ").format(p);

  return (
    <div className="employee-dashboard" style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* HEADER */}
      <div className="products-header">
        <div>
          <h1>Ishchi Kabineti 🧑‍💼</h1>
          <p>Xush kelibsiz, <strong>{employeeName}</strong>! Sizning shaxsiy ish kabinetingiz va ko'rsatkichlaringiz.</p>
        </div>
        <div>
          <button
            type="button"
            className="action-button"
            style={{
              padding: "10px 18px",
              background: shiftActive ? "#10b981" : "#f59e0b",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={handleToggleShift}
          >
            {shiftActive ? "🟢 Smena faol (Ish vaqti)" : "🟡 Smenani boshlash"}
          </button>
        </div>
      </div>

      {/* STATS / MAOSH KARTALARI */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div className="stat-card green">
          <div className="stat-icon">💵</div>
          <div>
            <p>Asosiy oylik maosh</p>
            <h2>{formatPrice(salary)}</h2>
            <span>so'm / oy</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">🎁</div>
          <div>
            <p>Oylik bonus / KPI</p>
            <h2>+{formatPrice(bonus)}</h2>
            <span>so'm</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">💳</div>
          <div>
            <p>Jami hisoblangan to'lov</p>
            <h2>{formatPrice(totalPay)}</h2>
            <span>so'm</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏱️</div>
          <div>
            <p>Ishlangan kunlar</p>
            <h2>22 kun</h2>
            <span>Bu oyda</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* RAQAMLI GUVIHNOMA / PROFIL */}
        <div className="settings-card" style={{ margin: 0 }}>
          <h3 className="settings-card-title">🪪 Raqamli Xodim Guvohnomasi</h3>
          
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px"
              }}>
                🧑‍💼
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{employeeName}</h3>
                <span style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  background: "rgba(99,102,241,0.3)",
                  color: "#c7d2fe",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginTop: "4px"
                }}>
                  {position}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
              <div><strong>ID raqami:</strong> #{currentUser?.id ? `EMP-${String(currentUser.id).slice(-4)}` : "EMP-1042"}</div>
              <div><strong>Telefon:</strong> {phone}</div>
              <div><strong>Ish joyi:</strong> NOVA-PHONE Asaka / Bosh do'kon</div>
              <div><strong>Ishga kirgan sana:</strong> {hiredDate}</div>
              <div><strong>Rahbar:</strong> Bobomurod jumaboyev (Bosh administrator)</div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                className="action-button"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}
                onClick={() => setVacationModal(true)}
              >
                🌴 Ta'til so'rash
              </button>
              <Link
                to="/user/products"
                className="action-button"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px", borderRadius: "8px", background: "#6366f1", color: "#fff", textAlign: "center", textDecoration: "none", fontWeight: "600" }}
              >
                📱 Mahsulotlar
              </Link>
            </div>
          </div>
        </div>

        {/* KUNLIK TOPSHIRIQLAR VA VAZIFALAR */}
        <div className="settings-card" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="settings-card-title" style={{ margin: 0 }}>📋 Kunlik Vazifalar</h3>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              {tasks.filter((t) => t.done).length} / {tasks.length} bajarildi
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  background: task.done ? "rgba(16, 185, 129, 0.08)" : "rgba(255,255,255,0.04)",
                  border: task.done ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: "18px" }}>{task.done ? "✅" : "⬜"}</span>
                <span style={{
                  fontSize: "13.5px",
                  textDecoration: task.done ? "line-through" : "none",
                  opacity: task.done ? 0.7 : 1
                }}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "18px", padding: "12px", background: "rgba(99,102,241,0.08)", borderRadius: "10px", fontSize: "12.5px" }}>
            💡 <strong>Eslatma:</strong> Barcha topshiriqlarni vaqtida bajarish oylik bonus va mukofot miqdoriga to'g'ridan-to'g'ri ijobiy ta'sir qiladi.
          </div>
        </div>
      </div>

      {/* TA'TIL SO'RASH MODALI */}
      {vacationModal && (
        <div className="modal-overlay" onClick={() => setVacationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🌴 Ta'til yoki Dam olish so'rovi</h2>
              <button className="modal-close" onClick={() => setVacationModal(false)}>✕</button>
            </div>
            {vacationSent ? (
              <div style={{ padding: "30px", textAlign: "center" }}>
                <span style={{ fontSize: "40px" }}>✅</span>
                <h3>Arizangiz qabul qilindi!</h3>
                <p>Admin {employeeName} nomidan ta'til arizasini ko'rib chiqadi.</p>
              </div>
            ) : (
              <form onSubmit={handleSendVacation} className="modal-form">
                <div className="form-group">
                  <label>Ta'til boshlanish sanasi</label>
                  <input type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
                </div>
                <div className="form-group">
                  <label>Ta'til davomiyligi (kun)</label>
                  <input type="number" min="1" max="30" defaultValue="7" required />
                </div>
                <div className="form-group">
                  <label>Sababi yoki izoh</label>
                  <textarea
                    rows="3"
                    placeholder="Masalan: Yillik mehnat ta'tili yoki oilaviy sabab..."
                    value={vacationNote}
                    onChange={(e) => setVacationNote(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-button" onClick={() => setVacationModal(false)}>Bekor qilish</button>
                  <button type="submit" className="save-button">Arizani yuborish</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
