import { useEffect, useState } from "react";

const STATUS_LIST = ["Kutilmoqda", "Yetkazilmoqda", "Yetkazildi", "Bekor qilindi"];

const defaultOrders = [
  {
    id: 1,
    user: "Ali Valiyev",
    phone: "+998 90 123 45 67",
    product: "iPhone 15 Pro",
    price: 12500000,
    date: "2026-07-20",
    status: "Yetkazildi",
  },
  {
    id: 2,
    user: "Jasur Karimov",
    phone: "+998 91 234 56 78",
    product: "Samsung S24 Ultra",
    price: 14800000,
    date: "2026-07-22",
    status: "Yetkazilmoqda",
  },
  {
    id: 3,
    user: "Madina Sobirova",
    phone: "+998 93 345 67 89",
    product: "Google Pixel 9",
    price: 9200000,
    date: "2026-07-23",
    status: "Kutilmoqda",
  },
  {
    id: 4,
    user: "Sardor Akmalov",
    phone: "+998 94 456 78 90",
    product: "Xiaomi 14",
    price: 7800000,
    date: "2026-07-24",
    status: "Bekor qilindi",
  },
  {
    id: 5,
    user: "Dilnoza Karimova",
    phone: "+998 95 567 89 01",
    product: "iPhone 14",
    price: 10500000,
    date: "2026-07-25",
    status: "Kutilmoqda",
  },
];

function Orders() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("nova_orders_v1");
    return saved ? JSON.parse(saved) : defaultOrders;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    const matchesSearch =
      order.user.toLowerCase().includes(searchText) ||
      order.product.toLowerCase().includes(searchText) ||
      order.phone.includes(searchText);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "Kutilmoqda").length;
  const deliveredCount = orders.filter((o) => o.status === "Yetkazildi").length;
  const cancelledCount = orders.filter((o) => o.status === "Bekor qilindi").length;

  const statusClass = (status) => {
    switch (status) {
      case "Kutilmoqda":
        return "status-pending";
      case "Yetkazilmoqda":
        return "status-shipping";
      case "Yetkazildi":
        return "status-delivered";
      case "Bekor qilindi":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>Buyurtmalar 📦</h1>
          <p>Barcha mijozlar buyurtmalarini shu yerda boshqarasiz.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">📦</div>
          <div>
            <p>Jami buyurtmalar</p>
            <h2>{totalOrders}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div>
            <p>Kutilmoqda</p>
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
          <div className="stat-icon">❌</div>
          <div>
            <p>Bekor qilingan</p>
            <h2>{cancelledCount}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Mijoz, mahsulot yoki telefon bo'yicha qidirish..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">Barcha statuslar</option>
          {STATUS_LIST.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row order-row-head">
          <span>Mijoz</span>
          <span>Mahsulot</span>
          <span>Narxi</span>
          <span>Sana</span>
          <span>Status</span>
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
          <div className="no-products">
            <h2>😔 Buyurtma topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;