import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [selectedStat, setSelectedStat] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("7");

  const [products] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "12 500 000",
    },
    {
      id: 2,
      name: "Samsung S24 Ultra",
      price: "14 800 000",
    },
    {
      id: 3,
      name: "Google Pixel 9",
      price: "9 200 000",
    },
  ]);

  const [orders] = useState([
    {
      id: 1,
      user: "Ali Valiyev",
      product: "iPhone 15 Pro",
      price: "12 500 000",
    },
    {
      id: 2,
      user: "Jasur Karimov",
      product: "Samsung S24 Ultra",
      price: "14 800 000",
    },
    {
      id: 3,
      user: "Madina Sobirova",
      product: "Google Pixel 9",
      price: "9 200 000",
    },
    {
      id: 4,
      user: "Sardor Akmalov",
      product: "Xiaomi 14",
      price: "7 800 000",
    },
    {
      id: 5,
      user: "Dilnoza Karimova",
      product: "iPhone 14",
      price: "10 500 000",
    },
  ]);

  const chartData = {
    7: {
      values: [45, 70, 55, 85, 65, 95, 78],
      labels: ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"],
    },

    30: {
      values: [35, 55, 48, 75, 60, 88, 70, 95, 65, 80],

      labels: [
        "1-3",
        "4-6",
        "7-9",
        "10-12",
        "13-15",
        "16-18",
        "19-21",
        "22-24",
        "25-27",
        "28-30",
      ],
    },

    year: {
      values: [60, 75, 55, 90, 70, 85, 65, 95, 80, 88, 72, 98],

      labels: [
        "Yan",
        "Fev",
        "Mar",
        "Apr",
        "May",
        "Iyun",
        "Iyul",
        "Avg",
        "Sen",
        "Okt",
        "Noy",
        "Dek",
      ],
    },
  };

  const currentChart = chartData[chartPeriod];

  const statDetails = {
    users: {
      title: "Jami foydalanuvchilar",
      icon: "👥",
      value: "1,248",
      description:
        "Mobile Store tizimida ro‘yxatdan o‘tgan barcha foydalanuvchilar.",

      details: [
        "Faol foydalanuvchilar: 1,120",
        "Yangi foydalanuvchilar: 128",
        "Bu oy o‘sish: +12%",
      ],
    },

    products: {
      title: "Jami mahsulotlar",
      icon: "📱",
      value: products.length,

      description: "Do‘konda mavjud bo‘lgan barcha mahsulotlar.",

      details: [
        `Jami mahsulotlar: ${products.length}`,
        "Yangi mahsulotlar: +8",
        "Omborda mavjud: 342",
      ],
    },

    sales: {
      title: "Umumiy savdo",
      icon: "💰",
      value: "245M",

      description: "Do‘konning umumiy savdo ko‘rsatkichi.",

      details: ["Bugungi savdo: 18.5M", "Bu oy: 245M", "O‘sish: +18.5%"],
    },

    orders: {
      title: "Buyurtmalar",
      icon: "📦",
      value: "2,486",

      description: "Tizimdagi barcha buyurtmalar statistikasi.",

      details: [
        "Jami buyurtmalar: 2,486",
        "Bugungi buyurtmalar: 24",
        "Jarayondagi buyurtmalar: 18",
      ],
    },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard 👑</h1>

          <p>Mobile Store boshqaruv paneliga xush kelibsiz.</p>
        </div>

        <button
          className="add-product-button"
          onClick={() => navigate("/admin/products")}
        >
          + Yangi mahsulot
        </button>
      </div>

      <div className="stats-grid">
        <div
          className="stat-card purple"
          onClick={() => setSelectedStat("users")}
        >
          <div className="stat-icon">👥</div>

          <div>
            <p>Jami foydalanuvchilar</p>

            <h2>1,248</h2>

            <span>+12% bu oy</span>
          </div>
        </div>

        <div
          className="stat-card blue"
          onClick={() => setSelectedStat("products")}
        >
          <div className="stat-icon">📱</div>

          <div>
            <p>Jami mahsulotlar</p>

            <h2>{products.length}</h2>

            <span>+8 ta yangi</span>
          </div>
        </div>

        <div
          className="stat-card green"
          onClick={() => setSelectedStat("sales")}
        >
          <div className="stat-icon">💰</div>

          <div>
            <p>Umumiy savdo</p>

            <h2>245M</h2>

            <span>+18.5%</span>
          </div>
        </div>

        <div
          className="stat-card orange"
          onClick={() => setSelectedStat("orders")}
        >
          <div className="stat-icon">📦</div>

          <div>
            <p>Buyurtmalar</p>

            <h2>2,486</h2>

            <span>+24 bugun</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="card-header">
            <h2>Savdo statistikasi</h2>

            <select
              value={chartPeriod}
              onChange={(event) => setChartPeriod(event.target.value)}
            >
              <option value="7">Oxirgi 7 kun</option>

              <option value="30">Oxirgi 30 kun</option>

              <option value="year">Bu yil</option>
            </select>
          </div>

          <div className="fake-chart">
            <div className="chart-bars">
              {currentChart.values.map((value, index) => (
                <div
                  key={index}
                  style={{
                    height: `${value}%`,
                  }}
                ></div>
              ))}
            </div>

            <div className="chart-days">
              {currentChart.labels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-orders">
          <div className="card-header">
            <h2>So‘nggi buyurtmalar</h2>

            <button onClick={() => setShowAllOrders(!showAllOrders)}>
              {showAllOrders ? "Yopish" : "Hammasi"}
            </button>
          </div>

          {(showAllOrders ? orders : orders.slice(0, 3)).map((order) => (
            <div className="order-item" key={order.id}>
              <div className="order-user">👤</div>

              <div>
                <h4>{order.user}</h4>

                <p>{order.product}</p>
              </div>

              <strong>{order.price}</strong>
            </div>
          ))}
        </div>
      </div>

      {selectedStat && (
        <div className="modal-overlay" onClick={() => setSelectedStat(null)}>
          <div
            className="modal-content stat-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                {statDetails[selectedStat].icon}{" "}
                {statDetails[selectedStat].title}
              </h2>

              <button onClick={() => setSelectedStat(null)}>✕</button>
            </div>

            <div className="stat-detail-main">
              <h1>{statDetails[selectedStat].value}</h1>

              <p>{statDetails[selectedStat].description}</p>
            </div>

            <div className="stat-details-list">
              {statDetails[selectedStat].details.map((detail, index) => (
                <div key={index}>✓ {detail}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
