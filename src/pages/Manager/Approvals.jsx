import { useEffect, useState } from "react";

const defaultOrders = [
  {
    id: 1,
    user: "Ali Valiyev",
    phone: "+998 90 123 45 67",
    product: "iPhone 15 Pro",
    price: 12500000,
    time: "10 daqiqa oldin",
    status: "Kutilmoqda",
  },
  {
    id: 2,
    user: "Jasur Karimov",
    phone: "+998 91 234 56 78",
    product: "Samsung S24 Ultra",
    price: 14800000,
    time: "32 daqiqa oldin",
    status: "Kutilmoqda",
  },
  {
    id: 3,
    user: "Madina Sobirova",
    phone: "+998 93 345 67 89",
    product: "Google Pixel 9",
    price: 9200000,
    time: "1 soat oldin",
    status: "Kutilmoqda",
  },
  {
    id: 4,
    user: "Sardor Akmalov",
    phone: "+998 94 456 78 90",
    product: "Xiaomi 14",
    price: 7800000,
    time: "kecha",
    status: "Tasdiqlangan",
  },
  {
    id: 5,
    user: "Dilnoza Karimova",
    phone: "+998 95 567 89 01",
    product: "iPhone 14",
    price: 10500000,
    time: "2 kun oldin",
    status: "Rad etilgan",
  },
];

function Approvals() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("nova_approvals_v1");
    return saved ? JSON.parse(saved) : defaultOrders;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Kutilmoqda");

  useEffect(() => {
    localStorage.setItem("nova_approvals_v1", JSON.stringify(orders));
  }, [orders]);

  const formatSum = (value) => new Intl.NumberFormat("uz-UZ").format(value);

  const handleApprove = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Tasdiqlangan" } : o))
    );
  };

  const handleReject = (id) => {
    if (!window.confirm("Bu buyurtmani rad etmoqchimisiz?")) return;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Rad etilgan" } : o)));
  };

  const filtered = orders.filter((o) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      o.user.toLowerCase().includes(searchText) || o.product.toLowerCase().includes(searchText);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status === "Kutilmoqda").length;
  const approvedCount = orders.filter((o) => o.status === "Tasdiqlangan").length;
  const rejectedCount = orders.filter((o) => o.status === "Rad etilgan").length;

  const statusClass = (status) => {
    switch (status) {
      case "Kutilmoqda":
        return "status-pending";
      case "Tasdiqlangan":
        return "satisfaction-happy";
      case "Rad etilgan":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>Tasdiqlash 🔔</h1>
          <p>Buyurtmalarni ko'rib chiqing, tasdiqlang yoki rad eting.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
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
            <p>Tasdiqlangan</p>
            <h2>{approvedCount}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">✕</div>
          <div>
            <p>Rad etilgan</p>
            <h2>{rejectedCount}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Mijoz yoki mahsulot bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Barchasi</option>
          <option value="Kutilmoqda">Kutilmoqda</option>
          <option value="Tasdiqlangan">Tasdiqlangan</option>
          <option value="Rad etilgan">Rad etilgan</option>
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row order-row-head">
          <span>Mijoz</span>
          <span>Mahsulot</span>
          <span>Narxi</span>
          <span>Vaqti</span>
          <span>Holati</span>
          <span>Amallar</span>
        </div>

        {filtered.map((order) => (
          <div className="order-row" key={order.id}>
            <div className="order-customer">
              <div className="order-avatar">👤</div>
              <div>
                <h4>{order.user}</h4>
                <p>{order.phone}</p>
              </div>
            </div>

            <div className="order-product-cell">{order.product}</div>
            <div className="order-price-cell">{formatSum(order.price)} so'm</div>
            <div className="order-date-cell">{order.time}</div>

            <div>
              <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
            </div>

            <div className="order-actions-cell">
              {order.status === "Kutilmoqda" ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="edit-button" onClick={() => handleApprove(order.id)}>
                    ✅
                  </button>
                  <button className="delete-button" onClick={() => handleReject(order.id)}>
                    ✕
                  </button>
                </div>
              ) : (
                <span style={{ color: "#64748b", fontSize: "12px" }}>Hal qilingan</span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-products">
            <h2>😔 Buyurtma topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Approvals;