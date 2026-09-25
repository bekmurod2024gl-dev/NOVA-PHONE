import { useEffect, useState } from "react";
import { getSalesRecords, isFakePerson, safeParse } from "../../utils/userStorage";

const SATISFACTION_LIST = ["Mamnun", "Neytral", "Norozi"];

function getRealSales() {
  const records = getSalesRecords();
  const saved = safeParse(localStorage.getItem("nova_sales_v1"), []);
  const combined = [...records, ...saved].filter(
    (sale) => sale && !isFakePerson(sale.customer || sale.user)
  );

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

function Sales() {
  const [sales, setSales] = useState(() => getRealSales());
  const [search, setSearch] = useState("");
  const [satisfactionFilter, setSatisfactionFilter] = useState("all");

  useEffect(() => {
    const syncSales = () => {
      setSales(getRealSales());
    };
    window.addEventListener("storage", syncSales);
    window.addEventListener("nova_sales_updated", syncSales);
    return () => {
      window.removeEventListener("storage", syncSales);
      window.removeEventListener("nova_sales_updated", syncSales);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("nova_sales_v1", JSON.stringify(sales));
  }, [sales]);

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleSatisfactionChange = (id, newSatisfaction) => {
    setSales((prev) =>
      prev.map((sale) =>
        sale.id === id ? { ...sale, satisfaction: newSatisfaction } : sale
      )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu savdo yozuvini o'chirmoqchimisiz?")) return;
    setSales((prev) => prev.filter((sale) => sale.id !== id));
  };

  const filteredSales = sales.filter((sale) => {
    const searchText = search.toLowerCase();
    const customer = (sale.customer || sale.user || "").toLowerCase();
    const product = (sale.product || "").toLowerCase();
    const phone = sale.phone || "";
    const matchesSearch =
      customer.includes(searchText) || product.includes(searchText) || phone.includes(searchText);
    const matchesSatisfaction =
      satisfactionFilter === "all" || sale.satisfaction === satisfactionFilter;
    return matchesSearch && matchesSatisfaction;
  });

  const totalSum = sales.reduce((sum, sale) => sum + Number(sale.price || 0), 0);
  const satisfiedCount = sales.filter((s) => s.satisfaction === "Mamnun").length;
  const dissatisfiedCount = sales.filter((s) => s.satisfaction === "Norozi").length;
  const satisfactionRate =
    sales.length > 0 ? Math.round((satisfiedCount / sales.length) * 100) : 0;

  const satisfactionClass = (satisfaction) => {
    switch (satisfaction) {
      case "Mamnun":
        return "satisfaction-happy";
      case "Neytral":
        return "satisfaction-neutral";
      case "Norozi":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  const satisfactionEmoji = (satisfaction) => {
    switch (satisfaction) {
      case "Mamnun":
        return "😊";
      case "Neytral":
        return "😐";
      case "Norozi":
        return "😞";
      default:
        return "⭐";
    }
  };

  const renderStars = (rating = 5) => {
    return "★".repeat(Math.min(5, Math.max(1, rating))) + "☆".repeat(Math.max(0, 5 - rating));
  };

  return (
    <div className="sales-page">
      <div className="products-header">
        <div>
          <h1>Savdolar va Mijozlar Fikri 💰</h1>
          <p>Haqiqiy xaridorlar va amalga oshirilgan savdolar hisoboti.</p>
        </div>
      </div>

      <div className="stats-grid sales-stats">
        <div className="stat-card green">
          <div className="stat-icon">💵</div>
          <div>
            <p>Jami tushum</p>
            <h2>{formatPrice(totalSum)}</h2>
            <span>so'm</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">🛍️</div>
          <div>
            <p>Jami savdolar soni</p>
            <h2>{sales.length}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">😊</div>
          <div>
            <p>Mamnun mijozlar</p>
            <h2>{satisfiedCount}</h2>
            <span>({satisfactionRate}%)</span>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">😞</div>
          <div>
            <p>Norozi mijozlar</p>
            <h2>{dissatisfiedCount}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Mijoz, telefon yoki telefon modeli bo'yicha qidirish..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={satisfactionFilter}
          onChange={(event) => setSatisfactionFilter(event.target.value)}
        >
          <option value="all">Barcha holatlar</option>
          {SATISFACTION_LIST.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-list sales-list">
        <div className="order-row sale-row order-row-head">
          <span>Mijoz</span>
          <span>Mahsulot</span>
          <span>Summasi</span>
          <span>Sanasi</span>
          <span>Holati</span>
          <span>Mamnunlik</span>
          <span>Amallar</span>
        </div>

        {filteredSales.map((sale) => (
          <div className="order-row sale-row" key={sale.id}>
            <div className="order-customer">
              <div className="order-avatar">👤</div>
              <div>
                <h4>{sale.customer || sale.user}</h4>
                <p>{sale.phone}</p>
              </div>
            </div>

            <div className="order-product-cell">{sale.product}</div>

            <div className="order-price-cell">{formatPrice(sale.price)} so'm</div>

            <div className="order-date-cell">{formatDate(sale.date)}</div>

            <div className="order-date-cell">{sale.status}</div>

            <div className="satisfaction-cell">
              <span className={`status-badge ${satisfactionClass(sale.satisfaction)}`}>
                {satisfactionEmoji(sale.satisfaction)} {sale.satisfaction}
              </span>
              <span className="star-rating" title={sale.comment}>
                {renderStars(sale.rating)}
              </span>
              <select
                className="status-select"
                value={sale.satisfaction}
                onChange={(event) =>
                  handleSatisfactionChange(sale.id, event.target.value)
                }
              >
                {SATISFACTION_LIST.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="order-actions-cell">
              <button className="delete-button" onClick={() => handleDelete(sale.id)}>
                🗑️ O'chirish
              </button>
            </div>
          </div>
        ))}

        {filteredSales.length === 0 && (
          <div className="no-products" style={{ padding: "40px", textAlign: "center" }}>
            <h2>🛍️ Hozircha savdolar mavjud emas</h2>
            <p>
              Haqiqiy foydalanuvchilar saytdan ro'yxatdan o'tib smartfon xarid qilganda, barcha xaridlar va sharhlar
              avtomatik ravishda shu yerda aks etadi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;