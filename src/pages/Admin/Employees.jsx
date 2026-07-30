import { useEffect, useState } from "react";

const POSITIONS = ["Sotuvchi", "Kassir", "Ombor xodimi", "Menejer", "Yetkazib beruvchi"];
const STATUS_LIST = ["Ishlamoqda", "Ta'tilda", "Bo'shatilgan"];

const defaultEmployees = [
  {
    id: 1,
    name: "Sherzod Yusupov",
    position: "Menejer",
    phone: "+998 90 111 22 33",
    salary: 8000000,
    hired: "2025-03-10",
    status: "Ishlamoqda",
  },
  {
    id: 2,
    name: "Nodira Tosheva",
    position: "Sotuvchi",
    phone: "+998 91 222 33 44",
    salary: 4500000,
    hired: "2025-08-15",
    status: "Ishlamoqda",
  },
  {
    id: 3,
    name: "Rustam Qodirov",
    position: "Kassir",
    phone: "+998 93 333 44 55",
    salary: 4000000,
    hired: "2026-01-20",
    status: "Ta'tilda",
  },
  {
    id: 4,
    name: "Zebo Ergasheva",
    position: "Ombor xodimi",
    phone: "+998 94 444 55 66",
    salary: 4200000,
    hired: "2025-11-05",
    status: "Ishlamoqda",
  },
  {
    id: 5,
    name: "Aziz Nurmatov",
    position: "Yetkazib beruvchi",
    phone: "+998 95 555 66 77",
    salary: 3800000,
    hired: "2025-06-01",
    status: "Bo'shatilgan",
  },
];

const initialFormState = {
  name: "",
  position: "",
  phone: "",
  salary: "",
  hired: "",
  status: "Ishlamoqda",
};

function Employees() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("nova_employees_v1");
    return saved ? JSON.parse(saved) : defaultEmployees;
  });

  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formFields, setFormFields] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem("nova_employees_v1", JSON.stringify(employees));
  }, [employees]);

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

  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setFormFields({
      name: employee.name,
      position: employee.position,
      phone: employee.phone,
      salary: employee.salary,
      hired: employee.hired,
      status: employee.status,
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
      const newEmployee = {
        id: Date.now(),
        name: formFields.name,
        position: formFields.position,
        phone: formFields.phone,
        salary: Number(formFields.salary),
        hired: formFields.hired,
        status: formFields.status,
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
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              status: employee.status === "Ishlamoqda" ? "Bo'shatilgan" : "Ishlamoqda",
            }
          : employee
      )
    );
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.phone.includes(searchText);
    const matchesPosition = positionFilter === "all" || employee.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Ishlamoqda").length;
  const onLeave = employees.filter((e) => e.status === "Ta'tilda").length;
  const totalSalary = employees
    .filter((e) => e.status === "Ishlamoqda")
    .reduce((sum, e) => sum + e.salary, 0);

  const statusClass = (status) => {
    switch (status) {
      case "Ishlamoqda":
        return "satisfaction-happy";
      case "Ta'tilda":
        return "satisfaction-neutral";
      case "Bo'shatilgan":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  return (
    <div className="employees-page">
      <div className="products-header">
        <div>
          <h1>Xodimlar 🧑‍💼</h1>
          <p>Do'kon xodimlarini shu yerdan boshqarasiz.</p>
        </div>
        <button className="add-product-button" onClick={() => setShowModal(true)}>
          + Yangi xodim
        </button>
      </div>

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
              <button className="delete-button" onClick={() => handleDelete(employee.id)}>
                🗑️ O'chirish
              </button>
            </div>
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="no-products">
            <h2>😔 Xodim topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}</h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <input
                name="name"
                type="text"
                placeholder="Xodim ismi"
                value={formFields.name}
                onChange={handleInputChange}
                required
              />

              <select
                name="position"
                value={formFields.position}
                onChange={handleInputChange}
                required
              >
                <option value="">Lavozimni tanlang</option>
                {POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>

              <input
                name="phone"
                type="text"
                placeholder="Telefon raqami"
                value={formFields.phone}
                onChange={handleInputChange}
                required
              />

              <input
                name="salary"
                type="number"
                placeholder="Oylik maoshi"
                value={formFields.salary}
                onChange={handleInputChange}
                required
              />

              <input
                name="hired"
                type="date"
                value={formFields.hired}
                onChange={handleInputChange}
                required
              />

              <select
                name="status"
                value={formFields.status}
                onChange={handleInputChange}
                required
              >
                {STATUS_LIST.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button type="submit">{editingId ? "💾 Saqlash" : "➕ Xodim qo'shish"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;