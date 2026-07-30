import { useEffect, useState } from "react";

const DISCOUNT_TYPES = ["Foizli", "Aniq summa"];

const defaultPromotions = [
  {
    id: 1,
    title: "Yozgi chegirma",
    code: "SUMMER25",
    type: "Foizli",
    value: 25,
    startDate: "2026-07-01",
    endDate: "2026-08-15",
    usageCount: 142,
    usageLimit: 500,
  },
  {
    id: 2,
    title: "Yangi mijozlar uchun",
    code: "WELCOME10",
    type: "Foizli",
    value: 10,
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    usageCount: 320,
    usageLimit: 1000,
  },
  {
    id: 3,
    title: "iPhone seriyasiga chegirma",
    code: "IPHONE500K",
    type: "Aniq summa",
    value: 500000,
    startDate: "2026-07-15",
    endDate: "2026-07-31",
    usageCount: 47,
    usageLimit: 100,
  },
  {
    id: 4,
    title: "Bahorgi aksiya",
    code: "SPRING2026",
    type: "Foizli",
    value: 15,
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    usageCount: 210,
    usageLimit: 210,
  },
];

const initialFormState = {
  title: "",
  code: "",
  type: "Foizli",
  value: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
};

function Promotions() {
  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem("nova_promotions_v1");
    return saved ? JSON.parse(saved) : defaultPromotions;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formFields, setFormFields] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem("nova_promotions_v1", JSON.stringify(promotions));
  }, [promotions]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatValue = (promo) =>
    promo.type === "Foizli"
      ? `${promo.value}%`
      : `${new Intl.NumberFormat("uz-UZ").format(promo.value)} so'm`;

  const getStatus = (promo) => {
    const today = new Date().toISOString().slice(0, 10);
    if (promo.usageCount >= promo.usageLimit) return "Tugagan";
    if (today < promo.startDate) return "Rejalashtirilgan";
    if (today > promo.endDate) return "Muddati o'tgan";
    return "Faol";
  };

  const statusClass = (status) => {
    switch (status) {
      case "Faol":
        return "satisfaction-happy";
      case "Rejalashtirilgan":
        return "status-shipping";
      case "Muddati o'tgan":
      case "Tugagan":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (promo) => {
    setEditingId(promo.id);
    setFormFields({
      title: promo.title,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      startDate: promo.startDate,
      endDate: promo.endDate,
      usageLimit: promo.usageLimit,
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
      setPromotions((prev) =>
        prev.map((promo) =>
          promo.id === editingId
            ? {
                ...promo,
                title: formFields.title,
                code: formFields.code.toUpperCase(),
                type: formFields.type,
                value: Number(formFields.value),
                startDate: formFields.startDate,
                endDate: formFields.endDate,
                usageLimit: Number(formFields.usageLimit),
              }
            : promo
        )
      );
    } else {
      const newPromo = {
        id: Date.now(),
        title: formFields.title,
        code: formFields.code.toUpperCase(),
        type: formFields.type,
        value: Number(formFields.value),
        startDate: formFields.startDate,
        endDate: formFields.endDate,
        usageCount: 0,
        usageLimit: Number(formFields.usageLimit),
      };
      setPromotions((prev) => [...prev, newPromo]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu aksiyani o'chirmoqchimisiz?")) return;
    setPromotions((prev) => prev.filter((promo) => promo.id !== id));
  };

  const filteredPromotions = promotions.filter((promo) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      promo.title.toLowerCase().includes(searchText) ||
      promo.code.toLowerCase().includes(searchText);
    const matchesStatus = statusFilter === "all" || getStatus(promo) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPromotions = promotions.length;
  const activePromotions = promotions.filter((p) => getStatus(p) === "Faol").length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);
  const expiredPromotions = promotions.filter((p) =>
    ["Muddati o'tgan", "Tugagan"].includes(getStatus(p))
  ).length;

  return (
    <div className="promotions-page">
      <div className="products-header">
        <div>
          <h1>Aksiyalar 🎁</h1>
          <p>Chegirmalar va promo kodlarni shu yerdan boshqarasiz.</p>
        </div>
        <button className="add-product-button" onClick={() => setShowModal(true)}>
          + Yangi aksiya
        </button>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">🎁</div>
          <div>
            <p>Jami aksiyalar</p>
            <h2>{totalPromotions}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">🔥</div>
          <div>
            <p>Faol aksiyalar</p>
            <h2>{activePromotions}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">🎟️</div>
          <div>
            <p>Jami ishlatilgan</p>
            <h2>{totalUsage}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⌛</div>
          <div>
            <p>Muddati o'tgan</p>
            <h2>{expiredPromotions}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Nomi yoki promo kod bo'yicha qidirish..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">Barcha holatlar</option>
          <option value="Faol">Faol</option>
          <option value="Rejalashtirilgan">Rejalashtirilgan</option>
          <option value="Muddati o'tgan">Muddati o'tgan</option>
          <option value="Tugagan">Tugagan</option>
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row promo-row order-row-head">
          <span>Aksiya</span>
          <span>Promo kod</span>
          <span>Chegirma</span>
          <span>Muddati</span>
          <span>Ishlatilgan</span>
          <span>Holati</span>
          <span>Amallar</span>
        </div>

        {filteredPromotions.map((promo) => {
          const status = getStatus(promo);
          return (
            <div className="order-row promo-row" key={promo.id}>
              <span>{promo.title}</span>

              <span>
                <code className="promo-code">{promo.code}</code>
              </span>

              <span className="order-price-cell">{formatValue(promo)}</span>

              <span className="order-date-cell">
                {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
              </span>

              <span className="order-date-cell">
                {promo.usageCount} / {promo.usageLimit}
              </span>

              <span>
                <span className={`status-badge ${statusClass(status)}`}>{status}</span>
              </span>

              <div className="admin-actions">
                <button className="edit-button" onClick={() => handleEditClick(promo)}>
                  ✏️
                </button>
                <button className="delete-button" onClick={() => handleDelete(promo.id)}>
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {filteredPromotions.length === 0 && (
          <div className="no-products">
            <h2>😔 Aksiya topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Aksiyani tahrirlash" : "Yangi aksiya qo'shish"}</h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <input
                name="title"
                type="text"
                placeholder="Aksiya nomi"
                value={formFields.title}
                onChange={handleInputChange}
                required
              />

              <input
                name="code"
                type="text"
                placeholder="Promo kod (masalan: SUMMER25)"
                value={formFields.code}
                onChange={handleInputChange}
                required
              />

              <select name="type" value={formFields.type} onChange={handleInputChange} required>
                {DISCOUNT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                name="value"
                type="number"
                placeholder={formFields.type === "Foizli" ? "Chegirma foizi" : "Chegirma summasi"}
                value={formFields.value}
                onChange={handleInputChange}
                required
              />

              <input
                name="startDate"
                type="date"
                value={formFields.startDate}
                onChange={handleInputChange}
                required
              />

              <input
                name="endDate"
                type="date"
                value={formFields.endDate}
                onChange={handleInputChange}
                required
              />

              <input
                name="usageLimit"
                type="number"
                placeholder="Foydalanish limiti"
                value={formFields.usageLimit}
                onChange={handleInputChange}
                required
              />

              <button type="submit">{editingId ? "💾 Saqlash" : "➕ Aksiya qo'shish"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;