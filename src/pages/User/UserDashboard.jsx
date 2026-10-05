import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSessionUser, submitJobApplication, getUserDisplayName, getUserPurchases, getUserLiked } from "../../utils/userStorage";
import { useLocale } from "../../context/LocaleContext";

const catalog = [
  {
    id: 1,
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    price: 19500000,
    oldPrice: 22000000,
    discount: 11,
    rating: 4.9,
    image: "/images/iphone15pro.jpeg",
    description: "Apple kompaniyasining iPhone 16 Pro Max modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 17200000,
    oldPrice: 19500000,
    discount: 12,
    rating: 4.9,
    image: "/images/15.jpeg",
    description: "Apple kompaniyasining iPhone 16 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 3,
    name: "iPhone 16",
    brand: "Apple",
    price: 13800000,
    oldPrice: 15500000,
    discount: 11,
    rating: 4.8,
    image: "/images/14promax.jpeg",
    description: "Apple kompaniyasining iPhone 16 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 4,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 16500000,
    oldPrice: 19000000,
    discount: 13,
    rating: 4.9,
    image: "https://placehold.co/400x400/0369a1/ffffff?text=iPhone+15+Pro+Max",
    description: "Apple kompaniyasining iPhone 15 Pro Max modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 5,
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 12500000,
    oldPrice: 15000000,
    discount: 17,
    rating: 4.9,
    image: "https://placehold.co/400x400/a16207/ffffff?text=iPhone+15+Pro",
    description: "Apple kompaniyasining iPhone 15 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 6,
    name: "iPhone 15",
    brand: "Apple",
    price: 10900000,
    oldPrice: 12800000,
    discount: 15,
    rating: 4.7,
    image: "https://placehold.co/400x400/1e293b/ffffff?text=iPhone+15",
    description: "Apple kompaniyasining iPhone 15 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 7,
    name: "iPhone 14",
    brand: "Apple",
    price: 10500000,
    oldPrice: 12000000,
    discount: 12,
    rating: 4.7,
    image: "https://placehold.co/400x400/0f766e/ffffff?text=iPhone+14",
    description: "Apple kompaniyasining iPhone 14 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 8,
    name: "iPhone 13",
    brand: "Apple",
    price: 8600000,
    oldPrice: 10200000,
    discount: 16,
    rating: 4.6,
    image: "https://placehold.co/400x400/7c3aed/ffffff?text=iPhone+13",
    description: "Apple kompaniyasining iPhone 13 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 9,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 14800000,
    oldPrice: 17000000,
    discount: 13,
    rating: 4.8,
    image: "https://placehold.co/400x400/b91c1c/ffffff?text=Samsung+Galaxy+S24+Ultra",
    description: "Samsung kompaniyasining Samsung Galaxy S24 Ultra modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 10,
    name: "Samsung Galaxy S24+",
    brand: "Samsung",
    price: 12600000,
    oldPrice: 14500000,
    discount: 13,
    rating: 4.7,
    image: "https://placehold.co/400x400/0369a1/ffffff?text=Samsung+Galaxy+S24+",
    description: "Samsung kompaniyasining Samsung Galaxy S24+ modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 11,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    price: 10200000,
    oldPrice: 12000000,
    discount: 15,
    rating: 4.6,
    image: "https://placehold.co/400x400/a16207/ffffff?text=Samsung+Galaxy+S24",
    description: "Samsung kompaniyasining Samsung Galaxy S24 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 12,
    name: "Samsung Galaxy Z Fold 6",
    brand: "Samsung",
    price: 21500000,
    oldPrice: 24000000,
    discount: 10,
    rating: 4.8,
    image: "https://placehold.co/400x400/1e293b/ffffff?text=Samsung+Galaxy+Z+Fold+6",
    description: "Samsung kompaniyasining Samsung Galaxy Z Fold 6 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 13,
    name: "Samsung Galaxy Z Flip 6",
    brand: "Samsung",
    price: 15800000,
    oldPrice: 18000000,
    discount: 12,
    rating: 4.7,
    image: "https://placehold.co/400x400/0f766e/ffffff?text=Samsung+Galaxy+Z+Flip+6",
    description: "Samsung kompaniyasining Samsung Galaxy Z Flip 6 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 14,
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    price: 5400000,
    oldPrice: 6300000,
    discount: 14,
    rating: 4.4,
    image: "https://placehold.co/400x400/7c3aed/ffffff?text=Samsung+Galaxy+A55",
    description: "Samsung kompaniyasining Samsung Galaxy A55 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 15,
    name: "Samsung Galaxy A35",
    brand: "Samsung",
    price: 4200000,
    oldPrice: 5000000,
    discount: 16,
    rating: 4.3,
    image: "https://placehold.co/400x400/b91c1c/ffffff?text=Samsung+Galaxy+A35",
    description: "Samsung kompaniyasining Samsung Galaxy A35 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 16,
    name: "Samsung Galaxy Note 20 Ultra",
    brand: "Samsung",
    price: 7800000,
    oldPrice: 9500000,
    discount: 18,
    rating: 4.5,
    image: "https://placehold.co/400x400/0369a1/ffffff?text=Samsung+Galaxy+Note+20+Ultra",
    description: "Samsung kompaniyasining Samsung Galaxy Note 20 Ultra modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 17,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 10500000,
    oldPrice: 12000000,
    discount: 12,
    rating: 4.7,
    image: "https://placehold.co/400x400/a16207/ffffff?text=Xiaomi+14+Ultra",
    description: "Xiaomi kompaniyasining Xiaomi 14 Ultra modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 18,
    name: "Xiaomi 14",
    brand: "Xiaomi",
    price: 8900000,
    oldPrice: 10200000,
    discount: 13,
    rating: 4.6,
    image: "https://placehold.co/400x400/1e293b/ffffff?text=Xiaomi+14",
    description: "Xiaomi kompaniyasining Xiaomi 14 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 19,
    name: "Redmi Note 13 Pro",
    brand: "Xiaomi",
    price: 3800000,
    oldPrice: 4500000,
    discount: 16,
    rating: 4.4,
    image: "https://placehold.co/400x400/0f766e/ffffff?text=Redmi+Note+13+Pro",
    description: "Xiaomi kompaniyasining Redmi Note 13 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 20,
    name: "Redmi Note 13",
    brand: "Xiaomi",
    price: 2900000,
    oldPrice: 3400000,
    discount: 15,
    rating: 4.3,
    image: "https://placehold.co/400x400/7c3aed/ffffff?text=Redmi+Note+13",
    description: "Xiaomi kompaniyasining Redmi Note 13 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 21,
    name: "Poco X6 Pro",
    brand: "Xiaomi",
    price: 3600000,
    oldPrice: 4200000,
    discount: 14,
    rating: 4.5,
    image: "https://placehold.co/400x400/b91c1c/ffffff?text=Poco+X6+Pro",
    description: "Xiaomi kompaniyasining Poco X6 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 22,
    name: "Poco F6",
    brand: "Xiaomi",
    price: 4500000,
    oldPrice: 5200000,
    discount: 13,
    rating: 4.4,
    image: "https://placehold.co/400x400/0369a1/ffffff?text=Poco+F6",
    description: "Xiaomi kompaniyasining Poco F6 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 23,
    name: "Xiaomi Mi 11",
    brand: "Xiaomi",
    price: 5200000,
    oldPrice: 6100000,
    discount: 15,
    rating: 4.2,
    image: "https://placehold.co/400x400/a16207/ffffff?text=Xiaomi+Mi+11",
    description: "Xiaomi kompaniyasining Xiaomi Mi 11 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 24,
    name: "Google Pixel 9 Pro",
    brand: "Google",
    price: 13200000,
    oldPrice: 15000000,
    discount: 12,
    rating: 4.7,
    image: "https://placehold.co/400x400/1e293b/ffffff?text=Google+Pixel+9+Pro",
    description: "Google kompaniyasining Google Pixel 9 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 25,
    name: "Google Pixel 9",
    brand: "Google",
    price: 9200000,
    oldPrice: 10800000,
    discount: 15,
    rating: 4.6,
    image: "https://placehold.co/400x400/0f766e/ffffff?text=Google+Pixel+9",
    description: "Google kompaniyasining Google Pixel 9 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 26,
    name: "Google Pixel 8a",
    brand: "Google",
    price: 6800000,
    oldPrice: 7900000,
    discount: 14,
    rating: 4.5,
    image: "https://placehold.co/400x400/7c3aed/ffffff?text=Google+Pixel+8a",
    description: "Google kompaniyasining Google Pixel 8a modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 27,
    name: "Google Pixel 8",
    brand: "Google",
    price: 8400000,
    oldPrice: 9800000,
    discount: 14,
    rating: 4.6,
    image: "https://placehold.co/400x400/b91c1c/ffffff?text=Google+Pixel+8",
    description: "Google kompaniyasining Google Pixel 8 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 28,
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 9800000,
    oldPrice: 11500000,
    discount: 15,
    rating: 4.6,
    image: "https://placehold.co/400x400/0369a1/ffffff?text=OnePlus+12",
    description: "OnePlus kompaniyasining OnePlus 12 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 29,
    name: "OnePlus 12R",
    brand: "OnePlus",
    price: 6900000,
    oldPrice: 8200000,
    discount: 16,
    rating: 4.5,
    image: "https://placehold.co/400x400/a16207/ffffff?text=OnePlus+12R",
    description: "OnePlus kompaniyasining OnePlus 12R modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 30,
    name: "OnePlus Nord 4",
    brand: "OnePlus",
    price: 5100000,
    oldPrice: 6000000,
    discount: 15,
    rating: 4.3,
    image: "https://placehold.co/400x400/1e293b/ffffff?text=OnePlus+Nord+4",
    description: "OnePlus kompaniyasining OnePlus Nord 4 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 31,
    name: "Huawei P60 Pro",
    brand: "Huawei",
    price: 11200000,
    oldPrice: 13000000,
    discount: 14,
    rating: 4.5,
    image: "https://placehold.co/400x400/0f766e/ffffff?text=Huawei+P60+Pro",
    description: "Huawei kompaniyasining Huawei P60 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 32,
    name: "Huawei Mate 60 Pro",
    brand: "Huawei",
    price: 14500000,
    oldPrice: 16500000,
    discount: 12,
    rating: 4.6,
    image: "https://placehold.co/400x400/7c3aed/ffffff?text=Huawei+Mate+60+Pro",
    description: "Huawei kompaniyasining Huawei Mate 60 Pro modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 33,
    name: "Huawei Nova 12",
    brand: "Huawei",
    price: 5600000,
    oldPrice: 6500000,
    discount: 14,
    rating: 4.2,
    image: "https://placehold.co/400x400/b91c1c/ffffff?text=Huawei+Nova+12",
    description: "Huawei kompaniyasining Huawei Nova 12 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 34,
    name: "Realme 12 Pro+",
    brand: "Realme",
    price: 4800000,
    oldPrice: 5600000,
    discount: 14,
    rating: 4.3,
    image: "https://placehold.co/400x400/0369a1/ffffff?text=Realme+12+Pro+",
    description: "Realme kompaniyasining Realme 12 Pro+ modeli — zamonaviy dizayn va yuqori unumdorlik.",
  },
  {
    id: 35,
    name: "Realme GT 6",
    brand: "Realme",
    price: 6200000,
    oldPrice: 7300000,
    discount: 15,
    rating: 4.4,
    image: "https://placehold.co/400x400/a16207/ffffff?text=Realme+GT+6",
    description: "Realme kompaniyasining Realme GT 6 modeli — zamonaviy dizayn va yuqori unumdorlik.",
  }
];

function UserDashboard() {
  const { t, lang } = useLocale();
  const [currentUser, setCurrentUser] = useState(() => getSessionUser());
  const [purchases, setPurchases] = useState(() => getUserPurchases(currentUser?.id));
  const [liked, setLiked] = useState(() => getUserLiked(currentUser?.id));

  useEffect(() => {
    const sync = () => {
      const u = getSessionUser();
      setCurrentUser(u);
      setPurchases(getUserPurchases(u?.id));
      setLiked(getUserLiked(u?.id));
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("nova_purchases_updated", sync);
    window.addEventListener("nova_liked_updated", sync);
    window.addEventListener("nova_sales_updated", sync);
    window.addEventListener("nova_profile_updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("nova_purchases_updated", sync);
      window.removeEventListener("nova_liked_updated", sync);
      window.removeEventListener("nova_sales_updated", sync);
      window.removeEventListener("nova_profile_updated", sync);
    };
  }, []);

  const [showJobModal, setShowJobModal] = useState(false);
  const [jobPosition, setJobPosition] = useState("Sotuvchi-maslahatchi");
  const [jobExperience, setJobExperience] = useState("");
  const [jobMessage, setJobMessage] = useState("");
  const [jobSubmitted, setJobSubmitted] = useState(false);

  const isAlreadyEmployee = currentUser?.isEmployee;

  const handleJobSubmit = (e) => {
    e.preventDefault();
    submitJobApplication({
      applicantId: currentUser?.id,
      name: getUserDisplayName(currentUser),
      phone: currentUser?.phone,
      email: currentUser?.email,
      position: jobPosition,
      experience: jobExperience,
      message: jobMessage,
    });
    setJobSubmitted(true);
    setTimeout(() => {
      setShowJobModal(false);
      setJobSubmitted(false);
      setJobExperience("");
      setJobMessage("");
    }, 2500);
  };

  const displayName = getUserDisplayName(currentUser);
  const numberLocale = lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ";
  const formatPrice = (price) => new Intl.NumberFormat(numberLocale).format(price);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(numberLocale, { day: "2-digit", month: "2-digit" });

  const totalSpent = purchases
    .filter((p) => p.status !== "Bekor qilindi")
    .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const activeCount = purchases.filter((p) => p.status === "Yetkazilmoqda" || p.status === "Kutilmoqda").length;
  const deliveredCount = purchases.filter((p) => p.status === "Yetkazildi").length;

  // Eng yaqin yetkazib berish
  const upcoming = purchases
    .filter((p) => p.status === "Yetkazilmoqda")
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))[0];

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  };

  // Eng ko'p yoqtirilgan brend (liked asosida)
  const likedProducts = catalog.filter((p) => liked.includes(p.id));
  const brandCounts = {};
  likedProducts.forEach((p) => {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
  });
  const favoriteBrand =
    Object.keys(brandCounts).length > 0
      ? Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "—";

  const recommended = catalog.slice(0, 3);

  const statusClass = (status) => {
    switch (status) {
      case "Kutilmoqda":
        return "status-pending";
      case "Yetkazilmoqda":
        return "status-shipping";
      case "Yetkazildi":
        return "satisfaction-happy";
      case "Bekor qilindi":
        return "satisfaction-sad";
      default:
        return "";
    }
  };

  const statusLabel = (status) => ({
    Kutilmoqda: t("in_transit"),
    Yetkazilmoqda: t("in_transit"),
    Yetkazildi: t("delivered"),
    "Bekor qilindi": t("cancelled"),
  }[status] || status);

  return (
    <div className="user-home-page">
      {/* GREETING BANNER */}
      <div className="user-banner">
        <div>
          <span className="user-banner-tag">{t("customer_panel")}</span>
              <h1>{t("hello")}, {displayName}! 👋</h1>
              <p>{t("new_phones")}</p>
          <Link to="/user/products" className="user-banner-cta">
                📱 {t("browse_products")}
          </Link>
          <div className="user-banner-actions">
                <Link to="/user/liked" className="secondary-button">❤️ {t("nav_favorites")}</Link>
                <Link to="/user/buy" className="secondary-button">🛒 {t("nav_cart")}</Link>
          </div>
        </div>
        <div className="user-banner-figure">📱</div>
      </div>

      {/* STAT STRIP */}
      <div className="user-stat-strip">
        <div className="user-stat-item">
          <span className="user-stat-value">{purchases.length}</span>
          <span className="user-stat-label">{t("total_purchases")}</span>
        </div>
        <div className="user-stat-divider"></div>
        <div className="user-stat-item">
          <span className="user-stat-value accent-pink">{activeCount}</span>
          <span className="user-stat-label">{t("in_transit")}</span>
        </div>
        <div className="user-stat-divider"></div>
        <div className="user-stat-item">
          <span className="user-stat-value accent-heart">{liked.length}</span>
          <span className="user-stat-label">{t("nav_favorites")}</span>
        </div>
        <div className="user-stat-divider"></div>
        <div className="user-stat-item">
          <span className="user-stat-value">{formatPrice(totalSpent)}</span>
          <span className="user-stat-label">{t("total_spent")} ({t("currency_label")})</span>
        </div>
      </div>

      {/* UPCOMING DELIVERY - qo'shimcha bo'lim */}
      {upcoming && upcoming.deliveryDate && (
        <div className="user-section-card delivery-highlight">
          <div className="delivery-highlight-icon">🚚</div>
          <div className="delivery-highlight-info">
            <h3>{t("nearest_delivery")}</h3>
            <p>
              <strong>{upcoming.productName}</strong> — {formatDate(upcoming.deliveryDate)} {t("delivery_date").toLowerCase()}
              {daysUntil(upcoming.deliveryDate) > 0 && ` (${daysUntil(upcoming.deliveryDate)} ${t("days_left")})`}
            </p>
          </div>
          <Link to="/user/buy" className="user-see-all">
            {t("view")} →
          </Link>
        </div>
      )}

      {/* QUICK INFO ROW - qo'shimcha bo'lim */}
      <div className="user-widgets-row">
        <div className="user-mini-widget">
          <span className="user-mini-icon">🏆</span>
          <div>
            <p>{t("favorite_brand")}</p>
            <h4>{favoriteBrand}</h4>
          </div>
        </div>

        <div className="user-mini-widget">
          <span className="user-mini-icon">✅</span>
          <div>
            <p>{t("delivered_orders")}</p>
            <h4>{deliveredCount} {t("item_suffix")}</h4>
          </div>
        </div>

        <div className="user-mini-widget">
          <span className="user-mini-icon">🎁</span>
          <div>
            <p>{t("catalog_products")}</p>
            <h4>{catalog.length} {t("phones")}</h4>
          </div>
        </div>
      </div>

      {/* ONLINE ISHGA TOPSHIRISH BANNER */}
      <div
        className="user-section-card"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)",
          border: "1px solid rgba(99,102,241,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "36px" }}>💼</div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", color: "#fff" }}>
              {isAlreadyEmployee ? t("employee_heading") : t("team_heading")}
            </h3>
            <p style={{ margin: 0, opacity: 0.85, fontSize: "13.5px" }}>
              {isAlreadyEmployee
                ? t("employee_message")
                : t("team_message")}
            </p>
          </div>
        </div>
        {isAlreadyEmployee ? (
          <Link
            to="/employee"
            className="add-product-button"
            style={{ textDecoration: "none", background: "#10b981", whiteSpace: "nowrap" }}
          >
            👷‍♂️ {t("employee_panel")} →
          </Link>
        ) : (
          <button
            type="button"
            className="add-product-button"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => setShowJobModal(true)}
          >
            📝 {t("apply_job")}
          </button>
        )}
      </div>

      {/* RECENT PURCHASES */}
      <div className="user-section-card">
        <div className="manager-panel-header">
          <h2>🛒 {t("latest_purchases")}</h2>
          <Link to="/user/buy" className="user-see-all">
            {t("all")} →
          </Link>
        </div>

        {purchases.length === 0 ? (
          <div className="manager-empty-state">
            <span>📱</span>
            <p>{t("no_orders")} — {t("no_purchase_hint")}</p>
          </div>
        ) : (
          <div className="my-orders-list">
            {purchases.slice(0, 4).map((purchase) => {
              const productName = purchase.productName || purchase.product || "Mahsulot";
              const productPrice = Number(purchase.price) || 0;
              const productImage = purchase.image || "/images/iphone15pro.jpeg";
              return (
                <div className="my-order-card" key={purchase.id}>
                  <img
                    src={productImage}
                    alt={productName}
                    onError={(e) => (e.currentTarget.src = "/images/images.jpeg")}
                  />
                  <div className="my-order-info">
                    <h4>{productName}</h4>
                    <p>{formatPrice(productPrice)} {t("currency_label")}</p>
                    <span className={`status-badge ${statusClass(purchase.status)}`}>
                      {statusLabel(purchase.status || "Yetkazilmoqda")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        )}
      </div>

      {/* RECOMMENDED */}
      <div className="user-section-card">
        <div className="manager-panel-header">
          <h2>✨ {t("recommended_phones")}</h2>
          <Link to="/user/products" className="user-see-all">
            {t("all")} →
          </Link>
        </div>

        <div className="user-recommend-row">
          {recommended.map((product) => (
            <Link to="/user/products" className="user-recommend-card" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => (e.target.src = "https://placehold.co/150x150?text=📱")}
              />
              <span className="discount-badge">-{product.discount}%</span>
              <h4>{product.name}</h4>
              <strong>{formatPrice(product.price)} {t("currency_label")}</strong>
            </Link>
          ))}
        </div>
      </div>

      {/* JOB APPLICATION MODAL */}
      {showJobModal && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💼 {t("job_modal_title")}</h2>
              <button className="modal-close" onClick={() => setShowJobModal(false)}>
                ✕
              </button>
            </div>

            {jobSubmitted ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <span style={{ fontSize: "48px" }}>🎉</span>
                <h3 style={{ margin: "16px 0 8px 0" }}>{t("application_success")}</h3>
                <p style={{ opacity: 0.85, fontSize: "14px" }}>
                  {t("application_review")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleJobSubmit} className="modal-form">
                <div className="form-group">
                  <label>{t("candidate_name")}</label>
                  <input
                    type="text"
                    value={getUserDisplayName(currentUser)}
                    disabled
                    style={{ opacity: 0.8 }}
                  />
                </div>

                <div className="form-group">
                  <label>{t("phone_number")}</label>
                  <input
                    type="text"
                    value={currentUser?.phone || "+998 90 000 00 00"}
                    disabled
                    style={{ opacity: 0.8 }}
                  />
                </div>

                <div className="form-group">
                  <label>{t("desired_position")}</label>
                  <select
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    required
                  >
                    <option value="Sotuvchi-maslahatchi">{t("sales_consultant_position")}</option>
                    <option value="Kassir">{t("cashier_position")}</option>
                    <option value="Ombor xodimi">{t("warehouse_position")}</option>
                    <option value="Yetkazib beruvchi (Kuryer)">{t("courier_position")}</option>
                    <option value="Menejer yordamchisi">{t("assistant_manager_position")}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t("experience")} ({t("optional")})</label>
                  <input
                    type="text"
                    placeholder={t("experience_example")}
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{t("why_you_label")}</label>
                  <textarea
                    rows="3"
                    placeholder={t("about_you_placeholder")}
                    value={jobMessage}
                    onChange={(e) => setJobMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowJobModal(false)}
                  >
                    {t("form_cancel")}
                  </button>
                  <button type="submit" className="save-button">
                    🚀 {t("submit_application")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;