import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import {
  getAccounts,
  getCompletedSalesRecords,
  getSalesRecords,
  isFakePerson,
} from "../../utils/userStorage";

function AdminDashboard() {
  const navigate = useNavigate();
  const { t, lang } = useLocale();
  const [selectedStat, setSelectedStat] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("7");

  const [accounts, setAccounts] = useState(() => getAccounts());
  const [rawRecords, setRawRecords] = useState(() =>
    getSalesRecords().filter((s) => !isFakePerson(s.customer))
  );

  useEffect(() => {
    const sync = () => {
      setAccounts(getAccounts());
      setRawRecords(getSalesRecords().filter((s) => !isFakePerson(s.customer)));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("nova_sales_updated", sync);
    window.addEventListener("nova_profile_updated", sync);
    window.addEventListener("nova_purchases_updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("nova_sales_updated", sync);
      window.removeEventListener("nova_profile_updated", sync);
      window.removeEventListener("nova_purchases_updated", sync);
    };
  }, []);
  const numberLocale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ";
  const formatMoney = (value) => new Intl.NumberFormat(numberLocale).format(value);
  const orders = rawRecords.map((r) => ({
    user: r.customer,
    product: r.product,
    price: formatMoney(r.price),
  }));

  const realUsersCount = accounts.length || 2;
  const totalProductsCount = 36;
  const completedRecords = getCompletedSalesRecords(rawRecords);
  const totalRevenue = completedRecords.reduce((sum, r) => sum + (Number(r.price) || 0), 0);
  const formattedRevenue = totalRevenue >= 1000000
    ? (totalRevenue / 1000000).toFixed(1).replace(".0", "") + "M"
        : formatMoney(totalRevenue);
  const totalOrdersCount = rawRecords.length;
  const completedOrdersCount = completedRecords.length;

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
      value: `${realUsersCount} ta`,
      description: "Mobile Store tizimida ro'yxatdan o'tgan haqiqiy foydalanuvchilar soni.",
      details: [
        `Jami ro'yxatdan o'tganlar: ${realUsersCount} ta`,
        `Real mijozlar: ${accounts.filter((a) => a.role === "user").length} ta`,
        `Xodimlar: ${accounts.filter((a) => a.isEmployee).length} ta`,
      ],
    },

    products: {
      title: "Jami mahsulotlar",
      icon: "📱",
      value: `${totalProductsCount} ta`,
      description: "Do'konda sotuvda mavjud barcha original smartfonlar.",
      details: [
        `Jami modellar: ${totalProductsCount} ta`,
        "Brendlar: Apple, Samsung, Xiaomi, Google, OnePlus, Huawei, Realme, Vivo, Oppo",
        "Kafolat: 1 yil rasmiy kafolat",
      ],
    },

    sales: {
      title: "Umumiy savdo",
      icon: "💰",
      value: formattedRevenue,
      description: "Do'kondan qilingan barcha haqiqiy xaridlar va tushum ko'rsatkichi.",
      details: [
        `${t("real_revenue")}: ${formatMoney(totalRevenue)} ${t("currency_label")}`,
        `${t("average_check")}: ${completedOrdersCount > 0 ? formatMoney(Math.round(totalRevenue / completedOrdersCount)) + ` ${t("currency_label")}` : `0 ${t("currency_label")}`}`,
        "To'lov usullari: Uzcard, Humo, Visa, Mastercard",
      ],
    },

    orders: {
      title: "Buyurtmalar",
      icon: "📦",
      value: `${totalOrdersCount} ta`,
      description: "Mijozlar tomonidan rasmiylashtirilgan haqiqiy buyurtmalar.",
      details: [
        `Jami buyurtmalar: ${totalOrdersCount} ta`,
        `Yetkazilganlar: ${rawRecords.filter((r) => r.status === "Yetkazildi").length} ta`,
        `Yo'ldagilar: ${rawRecords.filter((r) => r.status === "Yetkazilmoqda" || r.status === "Kutilmoqda").length} ta`,
      ],
    },
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{t("admin_dashboard_title")} 👑</h1>

          <p>{t("admin_dashboard_subtitle")}</p>
        </div>

        <button
          className="add-product-button"
          onClick={() => navigate("/admin/products")}
        >
          + {t("new_product")}
        </button>
        <button
          className="secondary-button"
          onClick={() => navigate("/admin/orders")}
        >
          📦 {t("view_orders")}
        </button>
      </div>

      <div className="stats-grid">
        <div
          className="stat-card purple"
          onClick={() => setSelectedStat("users")}
        >
          <div className="stat-icon">👥</div>

          <div>
            <p>{t("total_users")}</p>

            <h2>{realUsersCount}</h2>

            <span>{t("genuine_registered")}</span>
          </div>
        </div>

        <div
          className="stat-card blue"
          onClick={() => setSelectedStat("products")}
        >
          <div className="stat-icon">📱</div>

          <div>
            <p>{t("total_products")}</p>

            <h2>{totalProductsCount}</h2>

            <span>{t("active_catalog")}</span>
          </div>
        </div>

        <div
          className="stat-card green"
          onClick={() => setSelectedStat("sales")}
        >
          <div className="stat-icon">💰</div>

          <div>
            <p>{t("total_revenue")}</p>

              <h2>{formattedRevenue} {t("currency_label")}</h2>

            <span>{t("real_revenue")}</span>
          </div>
        </div>

        <div
          className="stat-card orange"
          onClick={() => setSelectedStat("orders")}
        >
          <div className="stat-icon">📦</div>

          <div>
            <p>{t("orders")}</p>

            <h2>{totalOrdersCount}</h2>

            <span>{t("total_purchases")}</span>
          </div>
        </div>
      </div>


      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="card-header">
            <h2>{t("sales_stats")}</h2>

            <select
              value={chartPeriod}
              onChange={(event) => setChartPeriod(event.target.value)}
            >
              <option value="7">{t("last_7_days")}</option>

              <option value="30">{t("last_30_days")}</option>

              <option value="year">{t("this_year")}</option>
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
            <h2>{t("recent_orders")}</h2>

            <button onClick={() => setShowAllOrders(!showAllOrders)}>
              {showAllOrders ? t("show_less") : t("all")}
            </button>
          </div>

          {orders.length === 0 ? (
            <p style={{ padding: "20px", opacity: 0.7, textAlign: "center" }}>
              {t("no_orders_yet")}
            </p>
          ) : (
            (showAllOrders ? orders : orders.slice(0, 3)).map((order) => (
              <div className="order-item" key={order.id}>
                <div className="order-user">👤</div>
                <div>
                  <h4>{order.user}</h4>
                  <p>{order.product}</p>
                </div>
                <strong>{order.price} {t("currency_label")}</strong>
              </div>
            ))
          )}
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
