import { useEffect, useState } from "react";
import { getSalesRecords, isFakePerson, safeParse } from "../../utils/userStorage";

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

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu buyurtmani o'chirmoqchimisiz?")) return;
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

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>Mijozlar Buyurtmalari 🛒</h1>
          <p>Haqiqiy xaridorlar tomonidan rasmiylashtirilgan buyurtmalar nazorati.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">📦</div>
          <div>
            <p>Jami buyurtmalar</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🚚</div>
          <div>
            <p>Jarayonda</p>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div>
            <p>Yetkazildi</p>
            <h2>{deliveredCount}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">💰</div>
          <div>
            <p>Buyurtmalar summasi</p>
            <h2>{formatPrice(totalSum)}</h2>
            <span>so'm</span>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Xaridor, telefon yoki telefon modeli bo'yicha qidirish..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">Barcha holatlar</option>
          {STATUS_LIST.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row order-row-head">
          <span>Xaridor</span>
          <span>Mahsulot</span>
          <span>Narxi</span>
          <span>Buyurtma sanasi</span>
          <span>Holati</span>
          <span>Amallar</span>
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
                {order.status}
              </span>
              <select
                className="status-select"
                value={order.status}
                onChange={(event) => handleStatusChange(order.id, event.target.value)}
              >
                {STATUS_LIST.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="order-actions-cell">
              <button className="delete-button" onClick={() => handleDelete(order.id)}>
                🗑️ O'chirish
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="no-products" style={{ padding: "40px", textAlign: "center" }}>
            <h2>📦 Hozircha buyurtmalar mavjud emas</h2>
            <p>Haqiqiy foydalanuvchilar mahsulot sotib olganda, ularning barcha buyurtmalari shu yerda ko'rinadi.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;