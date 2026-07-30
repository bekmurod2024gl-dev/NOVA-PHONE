import { useState } from "react";

const initialPendingOrders = [
  {
    id: 1,
    user: "Ali Valiyev",
    product: "iPhone 15 Pro",
    price: "12 500 000",
    time: "10 daqiqa oldin",
  },
  {
    id: 2,
    user: "Jasur Karimov",
    product: "Samsung S24 Ultra",
    price: "14 800 000",
    time: "32 daqiqa oldin",
  },
];

const lowStockItems = [
  { id: 1, name: "Google Pixel 9", quantity: 8 },
  { id: 2, name: "Xiaomi 14", quantity: 6 },
];

const attendance = [
  {
    id: 1,
    name: "Nodira Tosheva",
    position: "Sotuvchi",
    initial: "N",
    present: true,
    checkIn: "08:52",
    activity: "Faol",
    tasksToday: 14,
  },
  {
    id: 2,
    name: "Rustam Qodirov",
    position: "Kassir",
    initial: "R",
    present: true,
    checkIn: "09:05",
    activity: "Faol",
    tasksToday: 21,
  },
  {
    id: 3,
    name: "Zebo Ergasheva",
    position: "Ombor xodimi",
    initial: "Z",
    present: true,
    checkIn: "08:40",
    activity: "Past faollik",
    tasksToday: 3,
  },
  {
    id: 4,
    name: "Aziz Nurmatov",
    position: "Yetkazib beruvchi",
    initial: "A",
    present: false,
    checkIn: "—",
    activity: "Kelmadi",
    tasksToday: 0,
  },
];

const customerReviews = [
  {
    id: 1,
    customer: "Madina Sobirova",
    product: "Google Pixel 9",
    rating: 5,
    comment: "Hammasi a'lo darajada, xodimlar juda yordamchi bo'lishdi!",
    time: "2 soat oldin",
  },
  {
    id: 2,
    customer: "Sardor Akmalov",
    product: "Xiaomi 14",
    rating: 2,
    comment: "Ekranida nuqson bor edi, qaytarib berdim. Sifat nazorati sust.",
    time: "5 soat oldin",
  },
  {
    id: 3,
    customer: "Dilnoza Karimova",
    product: "iPhone 14",
    rating: 4,
    comment: "Yaxshi, faqat yetkazish biroz kechikdi.",
    time: "kecha",
  },
];

const damagedItems = [
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

function ManagerDashboard() {
  const [pendingOrders, setPendingOrders] = useState(initialPendingOrders);

  const handleApprove = (id) => {
    setPendingOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const handleReject = (id) => {
    if (!window.confirm("Bu buyurtmani rad etmoqchimisiz?")) return;
    setPendingOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech";

  const formatSum = (value) => new Intl.NumberFormat("uz-UZ").format(value);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" });

  const todayRevenue = 18500000;
  const totalLoss = damagedItems.reduce((sum, item) => sum + item.loss, 0);
  const netProfit = todayRevenue - totalLoss;

  const presentCount = attendance.filter((a) => a.present).length;
  const absentCount = attendance.filter((a) => !a.present).length;

  const avgRating = (
    customerReviews.reduce((sum, r) => sum + r.rating, 0) / customerReviews.length
  ).toFixed(1);

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div className="manager-page">
      {/* GREETING BANNER */}
      <div className="manager-banner">
        <div>
          <span className="manager-banner-tag">MANAGER PANELI</span>
          <h1>{greeting}, Menejer 👋</h1>
          <p>Bugun {pendingOrders.length} ta buyurtma tasdiqlashingizni kutmoqda.</p>
        </div>
        <div className="manager-banner-figure">📋</div>
      </div>

      {/* HORIZONTAL STAT STRIP */}
      <div className="manager-stat-strip">
        <div className="manager-stat-item">
          <span className="manager-stat-value">24</span>
          <span className="manager-stat-label">Bugungi buyurtmalar</span>
        </div>
        <div className="manager-stat-divider"></div>
        <div className="manager-stat-item">
          <span className="manager-stat-value">18.5M</span>
          <span className="manager-stat-label">Bugungi savdo</span>
        </div>
        <div className="manager-stat-divider"></div>
        <div className="manager-stat-item">
          <span className="manager-stat-value accent-warn">{pendingOrders.length}</span>
          <span className="manager-stat-label">Kutilmoqda</span>
        </div>
        <div className="manager-stat-divider"></div>
        <div className="manager-stat-item">
          <span className="manager-stat-value accent-ok">{presentCount}/{attendance.length}</span>
          <span className="manager-stat-label">Ishda</span>
        </div>
      </div>

      {/* PROFIT / LOSS OVERVIEW */}
      <div className="manager-finance-row">
        <div className="finance-card finance-profit">
          <div className="finance-icon">📈</div>
          <div>
            <p>Bugungi sof foyda</p>
            <h2>{formatSum(netProfit)} <span>so'm</span></h2>
          </div>
        </div>

        <div className="finance-card finance-revenue">
          <div className="finance-icon">💰</div>
          <div>
            <p>Umumiy tushum</p>
            <h2>{formatSum(todayRevenue)} <span>so'm</span></h2>
          </div>
        </div>

        <div className="finance-card finance-loss">
          <div className="finance-icon">📉</div>
          <div>
            <p>Zarar (buzilgan mahsulot)</p>
            <h2>{formatSum(totalLoss)} <span>so'm</span></h2>
          </div>
        </div>
      </div>

      {/* PRIORITY: PENDING APPROVALS */}
      <div className="manager-priority-panel">
        <div className="manager-panel-header">
          <h2>🔔 Tasdiqlash kutayotgan buyurtmalar</h2>
          <span className="manager-panel-count">{pendingOrders.length} ta</span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="manager-empty-state">
            <span>✅</span>
            <p>Hammasi tasdiqlangan — hozircha kutilayotgan buyurtma yo'q!</p>
          </div>
        ) : (
          <div className="manager-approval-list">
            {pendingOrders.map((order) => (
              <div className="manager-approval-card" key={order.id}>
                <div className="manager-approval-info">
                  <div className="manager-approval-avatar">👤</div>
                  <div>
                    <h4>{order.user}</h4>
                    <p>
                      {order.product} · <span>{order.price} so'm</span>
                    </p>
                    <span className="manager-approval-time">{order.time}</span>
                  </div>
                </div>

                <div className="manager-approval-actions">
                  <button className="manager-approve-btn" onClick={() => handleApprove(order.id)}>
                    ✅ Tasdiqlash
                  </button>
                  <button className="manager-reject-btn" onClick={() => handleReject(order.id)}>
                    ✕ Rad etish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ATTENDANCE & ACTIVITY */}
      <div className="manager-priority-panel">
        <div className="manager-panel-header">
          <h2>🧑‍💼 Xodimlar davomati va faolligi</h2>
          <span className="manager-panel-count">
            {presentCount} keldi · {absentCount} kelmadi
          </span>
        </div>

        <div className="attendance-list">
          {attendance.map((person) => (
            <div className="attendance-row" key={person.id}>
              <div className="manager-approval-info">
                <div className="manager-approval-avatar">{person.initial}</div>
                <div>
                  <h4>{person.name}</h4>
                  <p>{person.position}</p>
                </div>
              </div>

              <div className="attendance-checkin">
                <span className="attendance-label">Kelgan vaqti</span>
                <strong>{person.checkIn}</strong>
              </div>

              <div className="attendance-tasks">
                <span className="attendance-label">Bajarilgan vazifa</span>
                <strong>{person.tasksToday} ta</strong>
              </div>

              <span
                className={`status-badge ${
                  person.present
                    ? person.activity === "Faol"
                      ? "satisfaction-happy"
                      : "satisfaction-neutral"
                    : "satisfaction-sad"
                }`}
              >
                {person.present ? `● ${person.activity}` : "✕ Kelmadi"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      <div className="manager-priority-panel">
        <div className="manager-panel-header">
          <h2>💬 Mijozlar izohlari</h2>
          <span className="manager-panel-count">O'rtacha: {avgRating} ★</span>
        </div>

        <div className="review-list">
          {customerReviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-top">
                <div>
                  <h4>{review.customer}</h4>
                  <p className="review-product">{review.product}</p>
                </div>
                <span className="review-stars">{renderStars(review.rating)}</span>
              </div>
              <p className="review-comment">"{review.comment}"</p>
              <span className="review-time">{review.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DAMAGED ITEMS + LOW STOCK */}
      <div className="manager-widgets-row">
        <div className="manager-widget">
          <h3>🔧 Buzilgan / singan mahsulotlar</h3>
          <ul className="manager-widget-list damaged-list">
            {damagedItems.map((item) => (
              <li key={item.id} className="damaged-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.reason}</p>
                  <span className="damaged-date">{formatDate(item.date)}</span>
                </div>
                <span className="accent-danger">-{formatSum(item.loss)} so'm</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="manager-widget">
          <h3>⚠️ Kam qolgan mahsulotlar</h3>
          <ul className="manager-widget-list">
            {lowStockItems.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <strong className="accent-warn">{item.quantity} ta</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;