import { useEffect, useState } from "react";

const SATISFACTION_LIST = ["Mamnun", "Neytral", "Norozi"];

const defaultSales = [
  {
    id: 1,
    customer: "Ali Valiyev",
    phone: "+998 90 123 45 67",
    product: "iPhone 15 Pro",
    price: 12500000,
    date: "2026-07-20",
    status: "Yetkazildi",
    satisfaction: "Mamnun",
    rating: 5,
    comment: "Tez yetkazib berishdi, mahsulot originaliga to'g'ri keldi.",
  },
  {
    id: 2,
    customer: "Jasur Karimov",
    phone: "+998 91 234 56 78",
    product: "Samsung S24 Ultra",
    price: 14800000,
    date: "2026-07-21",
    status: "Yetkazildi",
    satisfaction: "Neytral",
    rating: 3,
    comment: "Qadoqlash yaxshi emas edi, lekin mahsulot ishlayapti.",
  },
  {
    id: 3,
    customer: "Madina Sobirova",
    phone: "+998 93 345 67 89",
    product: "Google Pixel 9",
    price: 9200000,
    date: "2026-07-22",
    status: "Yetkazildi",
    satisfaction: "Mamnun",
    rating: 5,
    comment: "Hammasi a'lo darajada!",
  },
  {
    id: 4,
    customer: "Sardor Akmalov",
    phone: "+998 94 456 78 90",
    product: "Xiaomi 14",
    price: 7800000,
    date: "2026-07-23",
    status: "Qaytarildi",
    satisfaction: "Norozi",
    rating: 1,
    comment: "Ekranida nuqson bor edi, qaytarib berdim.",
  },
  {
    id: 5,
    customer: "Dilnoza Karimova",
    phone: "+998 95 567 89 01",
    product: "iPhone 14",
    price: 10500000,
    date: "2026-07-24",
    status: "Yetkazildi",
    satisfaction: "Mamnun",
    rating: 4,
    comment: "Yaxshi, faqat yetkazish biroz kechikdi.",
  },
  {
    id: 6,
    customer: "Otabek Rustamov",
    phone: "+998 97 678 90 12",
    product: "Xiaomi 14 Ultra",
    price: 10500000,
    date: "2026-07-25",
    status: "Yetkazildi",
    satisfaction: "Norozi",
    rating: 2,
    comment: "Batareya tez tugaydi, kutganimdek chiqmadi.",
  },
];

function Sales() {
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("nova_sales_v1");
    return saved ? JSON.parse(saved) : defaultSales;
  });

  const [search, setSearch] = useState("");
  const [satisfactionFilter, setSatisfactionFilter] = useState("all");

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
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchText) ||
      sale.product.toLowerCase().includes(searchText) ||
      sale.phone.includes(searchText);
    const matchesSatisfaction =
      satisfactionFilter === "all" || sale.satisfaction === satisfactionFilter;
    return matchesSearch && matchesSatisfaction;
  });

  const totalSum = sales.reduce((sum, sale) => sum + sale.price, 0);
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
        return "❓";
    }
  };

  const renderStars = (rating) =>
    "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div className="sales-page">
      <div className="products-header">
        <div>
          <h1>Savdolar 💰</h1>
          <p>Barcha sotilgan mahsulotlar va mijozlar fikri shu yerda.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div>
            <p>Umumiy tushum</p>
            <h2>{formatPrice(totalSum)}</h2>
            <span>so'm</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">😊</div>
          <div>
            <p>Mamnun mijozlar</p>
            <h2>{satisfiedCount}</h2>
            <span>{satisfactionRate}% mamnunlik</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">😞</div>
          <div>
            <p>Norozi mijozlar</p>
            <h2>{dissatisfiedCount}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">📦</div>
          <div>
            <p>Jami savdolar</p>
            <h2>{sales.length}</h2>
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
                <h4>{sale.customer}</h4>
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
          <div className="no-products">
            <h2>😔 Savdo topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;