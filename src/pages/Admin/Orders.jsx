import { useEffect, useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import {
  deleteSalesRecord,
  getSalesRecords,
  isFakePerson,
  safeParse,
  updateSalesRecordStatus,
} from "../../utils/userStorage";

const STATUS_LIST = ["Kutilmoqda", "Yetkazilmoqda", "Yetkazildi", "Bekor qilindi"];

function getRealOrders() {
  const records = getSalesRecords();
  const saved = safeParse(localStorage.getItem("nova_orders_v1"), []);
  const combined = [...records.map((r) => ({
    id: r.id,
    user: r.customer || r.user,
    phone: r.phone,
    product: r.product,
    price: Number(r.price || 0),
    date: r.date,
    status: r.status || "Yetkazildi",
    satisfaction: r.satisfaction || "Mamnun",
    rating: Number(r.rating || 5),
    comment: r.comment || "",
  })), ...saved].filter((o) => o && !isFakePerson(o.user));

  const unique = [];
  const seen = new Set();
  for (const item of combined) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      unique.push(item);
    }
  }
  return unique;
}

function Orders() {
  const { t, lang } = useLocale();
  const [orders, setOrders] = useState(() => getRealOrders());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const syncOrders = () => setOrders(getRealOrders());
    window.addEventListener("storage", syncOrders);
    window.addEventListener("nova_sales_updated", syncOrders);
    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("nova_sales_updated", syncOrders);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("nova_orders_v1", JSON.stringify(orders));
  }, [orders]);

  const numberLocale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ";
  const formatPrice = (price) => new Intl.NumberFormat(numberLocale).format(price);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(numberLocale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleStatusChange = (id, newStatus) => {
    updateSalesRecordStatus(id, newStatus);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm(t("delete_order_prompt"))) return;
    deleteSalesRecord(id);
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();
    const user = (order.user || "").toLowerCase();
    const product = (order.product || "").toLowerCase();
    const phone = order.phone || "";
    const matchesSearch =
      user.includes(searchText) || product.includes(searchText) || phone.includes(searchText);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSum = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === "Yetkazildi").length;
  const pendingCount = orders.filter((o) => o.status === "Yetkazilmoqda" || o.status === "Kutilmoqda").length;

  const statusClass = (status) => {
    switch (status) {
      case "Yetkazildi":
        return "satisfaction-happy";
      case "Yetkazilmoqda":
      case "Kutilmoqda":
        return "satisfaction-neutral";
      case "Bekor qilindi":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  const statusLabel = (status) => ({
    Kutilmoqda: t("in_progress"),
    Yetkazilmoqda: t("in_transit"),
    Yetkazildi: t("delivered"),
    "Bekor qilindi": t("cancelled"),
  }[status] || status);

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>{t("orders_admin_title")} 🛒</h1>
          <p>{t("orders_subtitle")}</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">📦</div>
          <div>
            <p>{t("total_orders")}</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🚚</div>
          <div>
            <p>{t("in_progress")}</p>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div>
            <p>{t("delivered")}</p>
            <h2>{deliveredCount}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">💰</div>
          <div>
            <p>{t("order_sum")}</p>
            <h2>{formatPrice(totalSum)}</h2>
            <span>{t("currency_label")}</span>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder={`🔍 ${t("search_orders")}`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">{t("all_statuses")}</option>
          {STATUS_LIST.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row order-row-head">
          <span>{t("customer")}</span>
          <span>{t("product")}</span>
          <span>{t("price")}</span>
          <span>{t("order_date")}</span>
          <span>{t("status")}</span>
          <span>{t("actions")}</span>
        </div>

        {filteredOrders.map((order) => (
          <div className="order-row" key={order.id}>
            <div className="order-customer">
              <div className="order-avatar">👤</div>
              <div>
                <h4>{order.user}</h4>
                <p>{order.phone}</p>
              </div>
            </div>

            <div className="order-product-cell">{order.product}</div>

            <div className="order-price-cell">{formatPrice(order.price)} so'm</div>

            <div className="order-date-cell">{formatDate(order.date)}</div>

            <div className="order-status-cell">
              <span className={`status-badge ${statusClass(order.status)}`}>
                {statusLabel(order.status)}
              </span>
              <select
                className="status-select"
                value={order.status}
                onChange={(event) => handleStatusChange(order.id, event.target.value)}
              >
                {STATUS_LIST.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="order-actions-cell">
              <button className="delete-button" onClick={() => handleDelete(order.id)}>
                🗑️ {t("delete")}
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="no-products" style={{ padding: "40px", textAlign: "center" }}>
            <h2>📦 {t("orders_empty")}</h2>
            <p>{t("empty_order_description")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;