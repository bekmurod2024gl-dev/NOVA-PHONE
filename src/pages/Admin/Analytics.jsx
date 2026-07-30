import { useState } from "react";

const chartData = {
  7: {
    values: [45, 70, 55, 85, 65, 95, 78],
    labels: ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"],
  },
  30: {
    values: [35, 55, 48, 75, 60, 88, 70, 95, 65, 80],
    labels: ["1-3", "4-6", "7-9", "10-12", "13-15", "16-18", "19-21", "22-24", "25-27", "28-30"],
  },
  year: {
    values: [60, 75, 55, 90, 70, 85, 65, 95, 80, 88, 72, 98],
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
  },
};

const topProducts = [
  { name: "iPhone 15 Pro", sold: 84, revenue: 1050000000, share: 92 },
  { name: "Samsung S24 Ultra", sold: 61, revenue: 902800000, share: 75 },
  { name: "Xiaomi 14 Ultra", sold: 53, revenue: 556500000, share: 62 },
  { name: "Google Pixel 9", sold: 38, revenue: 349600000, share: 45 },
  { name: "iPhone 14", sold: 29, revenue: 304500000, share: 34 },
];

const brandBreakdown = [
  { brand: "Apple", percent: 42, color: "#818cf8" },
  { brand: "Samsung", percent: 27, color: "#60a5fa" },
  { brand: "Xiaomi", percent: 22, color: "#4ade80" },
  { brand: "Boshqalar", percent: 9, color: "#fbbf24" },
];

function Analytics() {
  const [chartPeriod, setChartPeriod] = useState("7");
  const currentChart = chartData[chartPeriod];

  const formatSum = (value) => new Intl.NumberFormat("uz-UZ").format(value);

  return (
    <div className="analytics-page">
      <div className="products-header">
        <div>
          <h1>Tahlil 📊</h1>
          <p>Do'kon faoliyati bo'yicha umumiy statistik ko'rinish.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div>
            <p>Bu oy tushum</p>
            <h2>245M</h2>
            <span>+18.5% o'tgan oyga nisbatan</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">🧾</div>
          <div>
            <p>O'rtacha chek</p>
            <h2>{formatSum(11250000)}</h2>
            <span>+4.2%</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">📦</div>
          <div>
            <p>Sotilgan mahsulotlar</p>
            <h2>265 ta</h2>
            <span>+12% bu oy</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">😊</div>
          <div>
            <p>Mijozlar mamnunligi</p>
            <h2>87%</h2>
            <span>+3% o'sish</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="card-header">
            <h2>Savdo dinamikasi</h2>
            <select value={chartPeriod} onChange={(event) => setChartPeriod(event.target.value)}>
              <option value="7">Oxirgi 7 kun</option>
              <option value="30">Oxirgi 30 kun</option>
              <option value="year">Bu yil</option>
            </select>
          </div>

          <div className="fake-chart">
            <div className="chart-bars">
              {currentChart.values.map((value, index) => (
                <div key={index} style={{ height: `${value}%` }}></div>
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
            <h2>Brendlar ulushi</h2>
          </div>

          <div className="brand-breakdown">
            {brandBreakdown.map((item) => (
              <div className="brand-row" key={item.brand}>
                <div className="brand-row-top">
                  <span>{item.brand}</span>
                  <strong>{item.percent}%</strong>
                </div>
                <div className="brand-bar-track">
                  <div
                    className="brand-bar-fill"
                    style={{ width: `${item.percent}%`, background: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="warehouse-section">
        <h2 className="section-title">Eng ko'p sotilgan mahsulotlar</h2>

        <div className="orders-list">
          <div className="order-row top-product-row order-row-head">
            <span>Mahsulot</span>
            <span>Sotilgan</span>
            <span>Tushum</span>
            <span>Ulushi</span>
          </div>

          {topProducts.map((product) => (
            <div className="order-row top-product-row" key={product.name}>
              <span>{product.name}</span>
              <span>{product.sold} ta</span>
              <span className="order-price-cell">{formatSum(product.revenue)} so'm</span>
              <span>
                <div className="brand-bar-track small">
                  <div
                    className="brand-bar-fill"
                    style={{ width: `${product.share}%`, background: "#818cf8" }}
                  ></div>
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;