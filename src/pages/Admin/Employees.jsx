import { useEffect, useState } from "react";
import {
  getAccounts,
  getSessionUser,
  getJobApplications,
  approveJobApplication,
  rejectJobApplication,
  hireUserAsEmployee,
  isFakePerson,
  safeParse,
} from "../../utils/userStorage";

const POSITIONS = ["Sotuvchi", "Kassir", "Ombor xodimi", "Menejer", "Yetkazib beruvchi"];
const STATUS_LIST = ["Ishlamoqda", "Ta'tilda", "Bo'shatilgan"];

function buildEmployeeFromAccount(account, index) {
  const fullName = `${account.firstName || account.username || "Foydalanuvchi"} ${account.surname || ""}`.trim();
  const currentUser = getSessionUser();
  const isOnline = account.id === currentUser?.id || account.isOnline === true;

  return {
    id: account.id || `account-${index}`,
    name: fullName || account.username || "Foydalanuvchi",
    position: account.position || "Sotuvchi",
    phone: account.phone || "+998 90 000 00 00",
    salary: Number(account.salary || 4500000 + index * 250000),
    hired: account.hired || account.createdAt || new Date().toISOString().slice(0, 10),
    status: account.status || "Ishlamoqda",
    accountId: account.id,
    isOnline,
  };
}

function getDerivedEmployees() {
  const accounts = getAccounts();
  const fromAccounts = accounts
    .filter((acc) => acc.isEmployee && !isFakePerson(acc.firstName || acc.username))
    .map((account, index) => buildEmployeeFromAccount(account, index));

  const saved = safeParse(localStorage.getItem("nova_employees_v1"), []);
  const validSaved = saved.filter(
    (emp) =>
      emp &&
      !isFakePerson(emp.name) &&
      !fromAccounts.some((fa) => fa.name === emp.name || (fa.accountId && fa.accountId === emp.accountId))
  );

  return [...fromAccounts, ...validSaved];
}

const initialFormState = {
  name: "",
  position: "Sotuvchi",
  phone: "",
  salary: "5000000",
  hired: new Date().toISOString().slice(0, 10),
  status: "Ishlamoqda",
  accountId: "",
};

function Employees() {
  const [activeTab, setActiveTab] = useState("employees"); // "employees" | "applications"
  const [employees, setEmployees] = useState(() => getDerivedEmployees());
  const [applications, setApplications] = useState(() => getJobApplications());

  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formFields, setFormFields] = useState(initialFormState);

  // Sync state with storage events
  useEffect(() => {
    const syncData = () => {
      setEmployees(getDerivedEmployees());
      setApplications(getJobApplications());
    };
    window.addEventListener("nova_employees_updated", syncData);
    window.addEventListener("nova_applications_updated", syncData);
    window.addEventListener("storage", syncData);
    return () => {
      window.removeEventListener("nova_employees_updated", syncData);
      window.removeEventListener("nova_applications_updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("nova_employees_v1", JSON.stringify(employees));
  }, [employees]);

  const registeredAccounts = getAccounts().filter(
    (acc) => !acc.isEmployee && acc.role !== "admin" && !isFakePerson(acc.username)
  );

  const formatSalary = (salary) => new Intl.NumberFormat("uz-UZ").format(salary);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectRegisteredUser = (accountId) => {
    if (!accountId) {
      setFormFields((prev) => ({ ...prev, accountId: "" }));
      return;
    }
    const acc = registeredAccounts.find((a) => a.id === accountId);
    if (acc) {
      const fullName = `${acc.firstName || acc.username} ${acc.surname || ""}`.trim();
      setFormFields((prev) => ({
        ...prev,
        accountId: acc.id,
        name: fullName || acc.username,
        phone: acc.phone || "+998 90 000 00 00",
      }));
    }
  };

  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setFormFields({
      name: employee.name,
      position: employee.position,
      phone: employee.phone,
      salary: employee.salary,
      hired: employee.hired,
      status: employee.status,
      accountId: employee.accountId || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormFields(initialFormState);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingId
            ? {
                ...employee,
                name: formFields.name,
                position: formFields.position,
                phone: formFields.phone,
                salary: Number(formFields.salary),
                hired: formFields.hired,
                status: formFields.status,
              }
            : employee
        )
      );
    } else {
      if (formFields.accountId) {
        hireUserAsEmployee({
          accountId: formFields.accountId,
          position: formFields.position,
          salary: Number(formFields.salary),
        });
      }

      const newEmployee = {
        id: Date.now(),
        name: formFields.name,
        position: formFields.position,
        phone: formFields.phone,
        salary: Number(formFields.salary),
        hired: formFields.hired,
        status: formFields.status,
        accountId: formFields.accountId || null,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu xodimni o'chirmoqchimisiz?")) return;
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  const toggleStatus = (id) => {
    setEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id !== id) return employee;
        const nextStatus =
          employee.status === "Ishlamoqda"
            ? "Ta'tilda"
            : employee.status === "Ta'tilda"
            ? "Bo'shatilgan"
            : "Ishlamoqda";
        return { ...employee, status: nextStatus };
      })
    );
  };

  const handleApproveApp = (app) => {
    const salaryStr = window.prompt(`${app.name} uchun oylik maoshni kiriting (so'mda):`, "5000000");
    if (salaryStr === null) return;
    const salary = Number(salaryStr) || 5000000;
    approveJobApplication(app.id, salary);
    setEmployees(getDerivedEmployees());
    setApplications(getJobApplications());
  };

  const handleRejectApp = (appId) => {
    if (!window.confirm("Ushbu arizani rad etmoqchimisiz?")) return;
    rejectJobApplication(appId);
    setApplications(getJobApplications());
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) || employee.phone.includes(searchText);
    const matchesPosition = positionFilter === "all" || employee.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const pendingApps = applications.filter((a) => a.status === "Kutilmoqda");

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Ishlamoqda").length;
  const onLeave = employees.filter((e) => e.status === "Ta'tilda").length;
  const totalSalary = employees
    .filter((e) => e.status === "Ishlamoqda")
    .reduce((sum, e) => sum + e.salary, 0);

  const statusClass = (status) => {
    switch (status) {
      case "Ishlamoqda":
      case "Qabul qilindi":
        return "satisfaction-happy";
      case "Ta'tilda":
      case "Kutilmoqda":
        return "satisfaction-neutral";
      case "Bo'shatilgan":
      case "Rad etildi":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  return (
    <div className="employees-page">
      <div className="products-header">
        <div>
          <h1>Xodimlar va Ishga Qabul Qilish 🧑‍💼</h1>
          <p>Haqiqiy xodimlar va sayt orqali kelib tushgan online arizalarni boshqaring.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="add-product-button" onClick={() => setShowModal(true)}>
            + Yangi xodim qo'shish
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          type="button"
          className={`action-button ${activeTab === "employees" ? "accent" : ""}`}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            background: activeTab === "employees" ? "#6366f1" : "rgba(255,255,255,0.08)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onClick={() => setActiveTab("employees")}
        >
          👥 Faol Xodimlar ({totalEmployees})
        </button>
        <button
          type="button"
          className={`action-button ${activeTab === "applications" ? "accent" : ""}`}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            background: activeTab === "applications" ? "#6366f1" : "rgba(255,255,255,0.08)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
            position: "relative",
          }}
          onClick={() => setActiveTab("applications")}
        >
          📩 Online Arizalar {pendingApps.length > 0 && `(${pendingApps.length})`}
        </button>
      </div>

      {activeTab === "employees" ? (
        <>
          <div className="stats-grid orders-stats">
            <div className="stat-card purple">
              <div className="stat-icon">🧑‍💼</div>
              <div>
                <p>Jami xodimlar</p>
                <h2>{totalEmployees}</h2>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">✅</div>
              <div>
                <p>Ishlamoqda</p>
                <h2>{activeEmployees}</h2>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">🌴</div>
              <div>
                <p>Ta'tilda</p>
                <h2>{onLeave}</h2>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">💵</div>
              <div>
                <p>Oylik fond</p>
                <h2>{formatSalary(totalSalary)}</h2>
                <span>so'm</span>
              </div>
            </div>
          </div>

          <div className="products-toolbar">
            <input
              type="text"
              placeholder="🔍 Ism yoki telefon bo'yicha qidirish..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={positionFilter}
              onChange={(event) => setPositionFilter(event.target.value)}
            >
              <option value="all">Barcha lavozimlar</option>
              {POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div className="orders-list">
            <div className="order-row employee-row order-row-head">
              <span>Xodim</span>
              <span>Lavozim</span>
              <span>Oyligi</span>
              <span>Ishga kirgan</span>
              <span>Holati</span>
              <span>Amallar</span>
            </div>

            {filteredEmployees.map((employee) => (
              <div className="order-row employee-row" key={employee.id}>
                <div className="order-customer">
                  <div className="order-avatar">🧑‍💼</div>
                  <div>
                    <h4>{employee.name}</h4>
                    <p>{employee.phone}</p>
                  </div>
                </div>

                <div className="order-product-cell">{employee.position}</div>

                <div className="order-price-cell">{formatSalary(employee.salary)} so'm</div>

                <div className="order-date-cell">{formatDate(employee.hired)}</div>

                <div className="order-status-cell">
                  <span className={`status-badge ${statusClass(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>

                <div className="admin-actions">
                  <button className="edit-button" onClick={() => handleEditClick(employee)}>
                    ✏️ Tahrirlash
                  </button>
                  <button className="secondary-button" onClick={() => toggleStatus(employee.id)}>
                    🔁 Holat
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(employee.id)}>
                    🗑️ O'chirish
                  </button>
                </div>
              </div>
            ))}

            {filteredEmployees.length === 0 && (
              <div className="no-products" style={{ padding: "40px", textAlign: "center" }}>
                <h2>🧑‍💼 Hozircha xodimlar mavjud emas</h2>
                <p>
                  Saytdan ro'yxatdan o'tgan foydalanuvchilar online ariza topshirganda yoki siz tomoningizdan
                  xodim sifatida tayinlanganda shu yerda ko'rinadi.
                </p>
                <button
                  type="button"
                  className="add-product-button"
                  style={{ marginTop: "15px" }}
                  onClick={() => setShowModal(true)}
                >
                  + Birinchi xodimni tayinlash
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ONLINE ARIZALAR TAB */
        <div className="orders-list">
          <div className="order-row order-row-head" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 2fr 1fr 1.5fr" }}>
            <span>Nomzod</span>
            <span>Lavozim</span>
            <span>Sana</span>
            <span>Tajriba / Xabar</span>
            <span>Holat</span>
            <span>Amallar</span>
          </div>

          {applications.map((app) => (
            <div
              className="order-row"
              key={app.id}
              style={{ gridTemplateColumns: "1.5fr 1fr 1fr 2fr 1fr 1.5fr" }}
            >
              <div className="order-customer">
                <div className="order-avatar">📝</div>
                <div>
                  <h4>{app.name}</h4>
                  <p>{app.phone}</p>
                </div>
              </div>

              <div><strong>{app.position}</strong></div>
              <div>{app.appliedAt}</div>
              <div style={{ fontSize: "13px", opacity: 0.9 }}>{app.message || app.experience}</div>

              <div>
                <span className={`status-badge ${statusClass(app.status)}`}>{app.status}</span>
              </div>

              <div className="admin-actions">
                {app.status === "Kutilmoqda" ? (
                  <>
                    <button
                      className="edit-button"
                      style={{ background: "#10b981", borderColor: "#10b981" }}
                      onClick={() => handleApproveApp(app)}
                    >
                      ✅ Ishga olish
                    </button>
                    <button className="delete-button" onClick={() => handleRejectApp(app.id)}>
                      ❌ Rad etish
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: "12px", opacity: 0.6 }}>Ko'rib chiqilgan</span>
                )}
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="no-products" style={{ padding: "40px", textAlign: "center" }}>
              <h2>📩 Hozircha online arizalar yo'q</h2>
              <p>Mijozlar yoki foydalanuvchilar sayt orqali ishga ariza topshirganda barcha arizalar shu yerga tushadi.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {!editingId && registeredAccounts.length > 0 && (
                <div className="form-group" style={{ background: "rgba(99,102,241,0.1)", padding: "12px", borderRadius: "8px" }}>
                  <label>💡 Ro'yxatdan o'tgan foydalanuvchini tanlash (ixtiyoriy):</label>
                  <select
                    value={formFields.accountId}
                    onChange={(e) => handleSelectRegisteredUser(e.target.value)}
                  >
                    <option value="">Yangi nom kiritish...</option>
                    {registeredAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.firstName || acc.username} ({acc.phone || acc.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>To'liq ism</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ism familiyani kiriting"
                  value={formFields.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lavozim</label>
                <select name="position" value={formFields.position} onChange={handleInputChange}>
                  {POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Telefon raqami</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+998 90 123 45 67"
                  value={formFields.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Oylik maoshi (so'm)</label>
                <input
                  type="number"
                  name="salary"
                  placeholder="5000000"
                  value={formFields.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ishga qabul qilingan sana</label>
                <input
                  type="date"
                  name="hired"
                  value={formFields.hired}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Holati</label>
                <select name="status" value={formFields.status} onChange={handleInputChange}>
                  {STATUS_LIST.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Bekor qilish
                </button>
                <button type="submit" className="save-button">
                  {editingId ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;