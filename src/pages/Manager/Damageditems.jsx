import { useEffect, useState } from "react";
import { useLocale } from "../../context/LocaleContext";

const defaultDamaged = [
  {
    id: 1,
    name: "Samsung S24 Ultra",
    reason: "Tashishda ekrani yorilgan",
    loss: 14800000,
    date: "2026-07-24",
  },
  {
    id: 2,
    name: "Xiaomi 14",
    reason: "Omborda namlikdan zararlangan",
    loss: 3200000,
    date: "2026-07-25",
  },
];

const initialForm = { name: "", reason: "", loss: "", date: "" };

function DamagedItems() {
  const { t, lang } = useLocale();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("nova_damaged_v1");
    return saved ? JSON.parse(saved) : defaultDamaged;
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formFields, setFormFields] = useState(initialForm);

  useEffect(() => {
    localStorage.setItem("nova_damaged_v1", JSON.stringify(items));
  }, [items]);

  const numberLocale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ";
  const formatSum = (value) => new Intl.NumberFormat(numberLocale).format(value);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(numberLocale, { day: "2-digit", month: "2-digit", year: "numeric" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setItems((prev) => [
      {
        id: Date.now(),
        name: formFields.name,
        reason: formFields.reason,
        loss: Number(formFields.loss),
        date: formFields.date,
      },
      ...prev,
    ]);
    setFormFields(initialForm);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu yozuvni o'chirmoqchimisiz?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalLoss = items.reduce((sum, item) => sum + item.loss, 0);

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>{t("damaged_title")} 🔧</h1>
          <p>{t("damage_subtitle")}</p>
        </div>
        <button className="add-product-button" onClick={() => setShowModal(true)}>
          + {t("new_record")}
        </button>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card orange">
          <div className="stat-icon">🔧</div>
          <div>
            <p>{t("total_records")}</p>
            <h2>{items.length}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">📉</div>
          <div>
            <p>{t("total_damage")}</p>
            <h2>{formatSum(totalLoss)}</h2>
            <span>{t("currency_label")}</span>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder={`🔍 ${t("search_product")}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="review-list">
        {filtered.map((item) => (
          <div className="review-card" key={item.id} style={{ borderLeftColor: "#f87171" }}>
            <div className="review-top">
              <div>
                <h4>{item.name}</h4>
                <p className="review-product">{item.reason}</p>
              </div>
              <span style={{ color: "#f87171", fontWeight: "bold", fontSize: "13px" }}>
                -{formatSum(item.loss)} {t("currency_label")}
              </span>
            </div>
            <span className="review-time">{formatDate(item.date)}</span>
            <div style={{ marginTop: "10px" }}>
              <button className="delete-button" onClick={() => handleDelete(item.id)}>
                🗑️ {t("delete")}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-products">
            <h2>😔 {t("no_damage_records")}</h2>
            <p>{t("search_filter_hint")}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t("add_damage_record")}</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                placeholder={t("product_name")}
                value={formFields.name}
                onChange={handleChange}
                required
              />
              <input
                name="reason"
                type="text"
                placeholder={t("damage_reason")}
                value={formFields.reason}
                onChange={handleChange}
                required
              />
              <input
                name="loss"
                type="number"
                placeholder={`${t("damage_amount")} (${t("currency_label")})`}
                value={formFields.loss}
                onChange={handleChange}
                required
              />
              <input
                name="date"
                type="date"
                value={formFields.date}
                onChange={handleChange}
                required
              />
              <button type="submit">💾 {t("save")}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DamagedItems;