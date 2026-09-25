import { useMemo, useState, useEffect } from "react";
import { getAccounts, isFakePerson, safeParse } from "../../utils/userStorage";

function WorkerPanel() {
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const handleSync = () => setRefresh((r) => r + 1);
    window.addEventListener("nova_employees_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("nova_employees_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const workers = useMemo(() => {
    const accounts = getAccounts();
    const saved = safeParse(localStorage.getItem("nova_employees_v1"), []);

    const result = [];
    const seen = new Set();

    accounts
      .filter((acc) => acc.isEmployee && !isFakePerson(acc.firstName || acc.username))
      .forEach((account, index) => {
        const id = account.id || `acc-${index}`;
        seen.add(id);
        result.push({
          id,
          name: `${account.firstName || account.username || "Xodim"} ${account.surname || ""}`.trim(),
          position: account.position || "Sotuvchi",
          phone: account.phone || "+998 90 000 00 00",
          salary: Number(account.salary || 5000000),
          bonus: Number(account.bonus || 750000),
          hired: account.hired || account.createdAt || new Date().toISOString().slice(0, 10),
          status: account.status || "Ishlamoqda",
          attendance: account.attendance || "96%",
          tasks: Number(account.tasks || 15),
          performance: account.performance || "Yuqori",
          shift: account.shift || "09:00 - 18:00",
        });
      });

    saved
      .filter((emp) => emp && !isFakePerson(emp.name) && !seen.has(emp.id) && !seen.has(emp.accountId))
      .forEach((emp) => {
        result.push({
          id: emp.id,
          name: emp.name,
          position: emp.position || "Sotuvchi",
          phone: emp.phone || "+998 90 000 00 00",
          salary: Number(emp.salary || 5000000),
          bonus: Math.round(Number(emp.salary || 5000000) * 0.15),
          hired: emp.hired || new Date().toISOString().slice(0, 10),
          status: emp.status || "Ishlamoqda",
          attendance: "94%",
          tasks: 12,
          performance: "Yuqori",
          shift: "09:00 - 18:00",
        });
      });

    return result;
  }, [refresh]);

  const totalSalary = workers.reduce((sum, worker) => sum + Number(worker.salary || 0), 0);
  const activeWorkers = workers.filter((worker) => worker.status === "Ishlamoqda").length;
  const totalBonus = workers.reduce((sum, worker) => sum + Number(worker.bonus || 0), 0);

  const formatSalary = (value) => new Intl.NumberFormat("uz-UZ").format(value);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "Ishlamoqda":
        return "satisfaction-happy";
      case "Ta'tilda":
        return "satisfaction-neutral";
      default:
        return "satisfaction-sad";
    }
  };

  return (
    <div className="worker-panel-page">
      <div className="products-header">
        <div>
          <h1>Ishchilar Ko'rsatkichlari (Xodimlar) 👷‍♂️</h1>
          <p>Haqiqiy xodimlar maoshi, davomati va oylik ko'rsatkichlari nazorati.</p>
        </div>
      </div>

      <div className="stats-grid sales-stats">
        <div className="stat-card green">
          <div className="stat-icon">👷‍♂️</div>
          <div>
            <p>Faol ishchilar</p>
            <h2>{activeWorkers} ta</h2>
            <span>Jami: {workers.length}</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div>
            <p>Jami oylik fondi</p>
            <h2>{formatSalary(totalSalary)}</h2>
            <span>so'm</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">🎁</div>
          <div>
            <p>Oylik bonus fondi</p>
            <h2>{formatSalary(totalBonus)}</h2>
            <span>so'm</span>
          </div>
        </div>
      </div>

      <div className="orders-list">
        <div className="order-row employee-row order-row-head">
          <span>Xodim</span>
          <span>Lavozim</span>
          <span>Oylik + Bonus</span>
          <span>Smena / Davomat</span>
          <span>Holati</span>
          <span>Samaradorlik</span>
        </div>

        {workers.map((worker) => (
          <div className="order-row employee-row" key={worker.id}>
            <div className="order-customer">
              <div className="order-avatar">🧑‍💼</div>
              <div>
                <h4>{worker.name}</h4>
                <p>{worker.phone}</p>
              </div>
            </div>

            <div className="order-product-cell">{worker.position}</div>

            <div className="order-price-cell">
              <strong>{formatSalary(worker.salary)} so'm</strong>
              <div style={{ fontSize: "11px", color: "#10b981" }}>+{formatSalary(worker.bonus)} bonus</div>
            </div>

            <div className="order-date-cell">
              <div>{worker.shift}</div>
              <small style={{ color: "#38bdf8" }}>Davomat: {worker.attendance}</small>
            </div>

            <div className="order-status-cell">
              <span className={`status-badge ${statusClass(worker.status)}`}>
                {worker.status}
              </span>
            </div>

            <div className="order-status-cell">
              <span style={{ fontWeight: 600, color: "#a5b4fc" }}>{worker.performance}</span>
            </div>
          </div>
        ))}

        {workers.length === 0 && (
          <div className="no-products" style={{ padding: "40px", textAlign: "center" }}>
            <h2>👷‍♂️ Hozircha xodimlar mavjud emas</h2>
            <p>Admin panel orqali ariza topshirgan yangi ishchilar qabul qilinganda shu yerda ko'rinadi.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerPanel;
