import { useEffect, useState } from "react";
import { useLocale } from "../../context/LocaleContext";

const LOW_STOCK_THRESHOLD = 10;
const MOVEMENT_TYPES = ["Kirim", "Chiqim"];

const defaultStock = [
  { id: 1, name: "iPhone 15 Pro", brand: "Apple", quantity: 25 },
  { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", quantity: 18 },
  { id: 3, name: "Xiaomi 14 Ultra", brand: "Xiaomi", quantity: 22 },
  { id: 4, name: "Google Pixel 9", brand: "Google", quantity: 8 },
  { id: 5, name: "Xiaomi 14", brand: "Xiaomi", quantity: 6 },
  { id: 6, name: "iPhone 14", brand: "Apple", quantity: 14 },
];

const defaultMovements = [
  {
    id: 1,
    productId: 1,
    productName: "iPhone 15 Pro",
    type: "Kirim",
    quantity: 30,
    date: "2026-07-15",
    note: "Yetkazib beruvchidan yangi partiya",
  },
  {
    id: 2,
    productId: 1,
    productName: "iPhone 15 Pro",
    type: "Chiqim",
    quantity: 5,
    date: "2026-07-20",
    note: "Do'kon savdosi",
  },
  {
    id: 3,
    productId: 4,
    productName: "Google Pixel 9",
    type: "Chiqim",
    quantity: 12,
    date: "2026-07-22",
    note: "Online buyurtmalar",
  },
  {
    id: 4,
    productId: 5,
    productName: "Xiaomi 14",
    type: "Chiqim",
    quantity: 9,
    date: "2026-07-24",
    note: "Do'kon savdosi",
  },
  {
    id: 5,
    productId: 3,
    productName: "Xiaomi 14 Ultra",
    type: "Kirim",
    quantity: 15,
    date: "2026-07-25",
    note: "Yetkazib beruvchidan yangi partiya",
  },
];

const initialFormState = {
  productId: "",
  type: "Kirim",
  quantity: "",
  note: "",
};

function Warehouse() {
  const { t, lang } = useLocale();
  const [stock, setStock] = useState(() => {
    const saved = localStorage.getItem("nova_warehouse_stock_v1");
    return saved ? JSON.parse(saved) : defaultStock;
  });

  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem("nova_warehouse_movements_v1");
    return saved ? JSON.parse(saved) : defaultMovements;
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [formFields, setFormFields] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem("nova_warehouse_stock_v1", JSON.stringify(stock));
  }, [stock]);

  useEffect(() => {
    localStorage.setItem("nova_warehouse_movements_v1", JSON.stringify(movements));
  }, [movements]);

  const numberLocale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ";
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(numberLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormFields(initialFormState);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const product = stock.find((item) => item.id === Number(formFields.productId));
    if (!product) return;

    const qty = Number(formFields.quantity);
    const isIncoming = formFields.type === "Kirim";

    if (!isIncoming && qty > product.quantity) {
      alert("Chiqim miqdori omborda mavjud miqdordan ko'p bo'lishi mumkin emas!");
      return;
    }

    setStock((prev) =>
      prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + (isIncoming ? qty : -qty) }
          : item
      )
    );

    setMovements((prev) => [
      {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        type: formFields.type,
        quantity: qty,
        date: new Date().toISOString().slice(0, 10),
        note: formFields.note || "-",
      },
      ...prev,
    ]);

    handleCloseModal();
  };

  const filteredMovements = movements.filter((movement) => {
    const searchText = search.toLowerCase();
    const matchesSearch = movement.productName.toLowerCase().includes(searchText);
    const matchesType = typeFilter === "all" || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalProducts = stock.length;
  const lowStockCount = stock.filter((item) => item.quantity <= LOW_STOCK_THRESHOLD).length;
  const totalIncoming = movements
    .filter((m) => m.type === "Kirim")
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalOutgoing = movements
    .filter((m) => m.type === "Chiqim")
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="warehouse-page">
      <div className="products-header">
        <div>
          <h1>{t("warehouse_title")} 🏬</h1>
          <p>{t("warehouse_subtitle")}</p>
        </div>
        <button className="add-product-button" onClick={() => setShowModal(true)}>
          + {t("add_movement")}
        </button>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">📦</div>
          <div>
            <p>{t("product_types")}</p>
            <h2>{totalProducts}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⚠️</div>
          <div>
            <p>{t("low_stock_products")}</p>
            <h2>{lowStockCount}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">⬇️</div>
          <div>
            <p>{t("total_incoming")}</p>
            <h2>{totalIncoming}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">⬆️</div>
          <div>
            <p>{t("total_outgoing")}</p>
            <h2>{totalOutgoing}</h2>
          </div>
        </div>
      </div>

      {/* STOCK OVERVIEW */}
      <div className="warehouse-section">
        <h2 className="section-title">{t("stock_status")}</h2>

        <div className="stock-table">
          <div className="stock-row stock-row-head">
            <span>{t("product")}</span>
            <span>{t("brand_name")}</span>
            <span>{t("remaining_quantity")}</span>
            <span>{t("status")}</span>
          </div>

          {stock.map((item) => (
            <div className="stock-row" key={item.id}>
              <span>{item.name}</span>
              <span>{item.brand}</span>
              <span>{item.quantity} {t("item_suffix")}</span>
              <span>
                {item.quantity <= LOW_STOCK_THRESHOLD ? (
                  <span className="status-badge satisfaction-sad">⚠️ {t("low_stock")}</span>
                ) : (
                  <span className="status-badge satisfaction-happy">✅ {t("sufficient_stock")}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MOVEMENT HISTORY */}
      <div className="warehouse-section">
        <h2 className="section-title">{t("stock_history")}</h2>

        <div className="products-toolbar">
          <input
            type="text"
            placeholder={`🔍 ${t("search_product")}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">{t("all")}</option>
            {MOVEMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "Kirim" ? t("incoming") : t("outgoing")}
              </option>
            ))}
          </select>
        </div>

        <div className="orders-list">
          <div className="order-row movement-row order-row-head">
            <span>{t("product")}</span>
            <span>{t("movement_type")}</span>
            <span>{t("quantity")}</span>
            <span>{t("date")}</span>
            <span>{t("note")}</span>
          </div>

          {filteredMovements.map((movement) => (
            <div className="order-row movement-row" key={movement.id}>
              <span>{movement.productName}</span>
              <span>
                <span
                  className={`status-badge ${
                    movement.type === "Kirim" ? "satisfaction-happy" : "satisfaction-sad"
                  }`}
                >
                  {movement.type === "Kirim" ? "⬇️" : "⬆️"} {movement.type === "Kirim" ? t("incoming") : t("outgoing")}
                </span>
              </span>
              <span>{movement.quantity} {t("item_suffix")}</span>
              <span className="order-date-cell">{formatDate(movement.date)}</span>
              <span className="movement-note">{movement.note}</span>
            </div>
          ))}

          {filteredMovements.length === 0 && (
            <div className="no-products">
              <h2>😔 {t("no_movements")}</h2>
              <p>{t("search_filter_hint")}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{t("stock_history")}</h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <select
                name="productId"
                value={formFields.productId}
                onChange={handleInputChange}
                required
              >
                <option value="">{t("select_product")}</option>
                {stock.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({t("current_quantity")}: {item.quantity} {t("item_suffix")})
                  </option>
                ))}
              </select>

              <select name="type" value={formFields.type} onChange={handleInputChange} required>
                {MOVEMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                name="quantity"
                type="number"
                min="1"
                placeholder={t("quantity")}
                value={formFields.quantity}
                onChange={handleInputChange}
                required
              />

              <input
                name="note"
                type="text"
                placeholder={t("note")}
                value={formFields.note}
                onChange={handleInputChange}
              />

              <button type="submit">💾 {t("save")}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warehouse;