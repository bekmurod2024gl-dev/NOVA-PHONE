import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("nova_user_purchases_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("nova_user_liked_v1");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("nova_user_purchases_v1", JSON.stringify(purchases));
  }, [purchases]);

  const displayName = localStorage.getItem("nova_display_name") || "Mijoz";
  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" });

  const totalSpent = purchases
    .filter((p) => p.status !== "Bekor qilindi")
    .reduce((sum, p) => sum + p.price, 0);

  const activeCount = purchases.filter((p) => p.status === "Yetkazilmoqda").length;
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

  return (
    <div className="user-home-page">
      {/* GREETING BANNER */}
      <div className="user-banner">
        <div>
          <span className="user-banner-tag">MIJOZ PANELI</span>
          <h1>Salom, {displayName}! 👋</h1>
          <p>Yangi telefonlarni ko'rib chiqing va o'z buyurtmalaringizni kuzating.</p>
          <Link to="/user/products" className="user-banner-cta">
            📱 Mahsulotlarni ko'rish
          </Link>
        </div>
        <div className="user-banner-figure">📱</div>
      </div>

      {/* STAT STRIP */}
      <div className="user-stat-strip">
        <div className="user-stat-item">
          <span className="user-stat-value">{purchases.length}</span>
          <span className="user-stat-label">Jami xaridlar</span>
        </div>
        <div className="user-stat-divider"></div>
        <div className="user-stat-item">
          <span className="user-stat-value accent-pink">{activeCount}</span>
          <span className="user-stat-label">Yo'lda</span>
        </div>
        <div className="user-stat-divider"></div>
        <div className="user-stat-item">
          <span className="user-stat-value accent-heart">{liked.length}</span>
          <span className="user-stat-label">Sevimlilar</span>
        </div>
        <div className="user-stat-divider"></div>
        <div className="user-stat-item">
          <span className="user-stat-value">{formatPrice(totalSpent)}</span>
          <span className="user-stat-label">Jami sarflangan (so'm)</span>
        </div>
      </div>

      {/* UPCOMING DELIVERY - qo'shimcha bo'lim */}
      {upcoming && upcoming.deliveryDate && (
        <div className="user-section-card delivery-highlight">
          <div className="delivery-highlight-icon">🚚</div>
          <div className="delivery-highlight-info">
            <h3>Eng yaqin yetkazib berish</h3>
            <p>
              <strong>{upcoming.productName}</strong> — {formatDate(upcoming.deliveryDate)} sanasida
              yetkaziladi
              {daysUntil(upcoming.deliveryDate) > 0 && ` (${daysUntil(upcoming.deliveryDate)} kun qoldi)`}
            </p>
          </div>
          <Link to="/user/buy" className="user-see-all">
            Ko'rish →
          </Link>
        </div>
      )}

      {/* QUICK INFO ROW - qo'shimcha bo'lim */}
      <div className="user-widgets-row">
        <div className="user-mini-widget">
          <span className="user-mini-icon">🏆</span>
          <div>
            <p>Sevimli brendingiz</p>
            <h4>{favoriteBrand}</h4>
          </div>
        </div>

        <div className="user-mini-widget">
          <span className="user-mini-icon">✅</span>
          <div>
            <p>Yetkazib berilgan</p>
            <h4>{deliveredCount} ta buyurtma</h4>
          </div>
        </div>

        <div className="user-mini-widget">
          <span className="user-mini-icon">🎁</span>
          <div>
            <p>Katalogdagi mahsulotlar</p>
            <h4>{catalog.length} ta telefon</h4>
          </div>
        </div>
      </div>

      {/* RECENT PURCHASES */}
      <div className="user-section-card">
        <div className="manager-panel-header">
          <h2>🛒 So'nggi xaridlar</h2>
          <Link to="/user/buy" className="user-see-all">
            Hammasi →
          </Link>
        </div>

        {purchases.length === 0 ? (
          <div className="manager-empty-state">
            <span>📱</span>
            <p>Hali xarid yo'q — Products bo'limidan birinchi xaridingizni qiling!</p>
          </div>
        ) : (
          <div className="my-orders-list">
            {purchases.slice(0, 2).map((purchase) => (
              <div className="my-order-card" key={purchase.id}>
                <img
                  src={purchase.image}
                  alt={purchase.productName}
                  onError={(e) => (e.target.src = "https://placehold.co/120x120?text=📱")}
                />
                <div className="my-order-info">
                  <h4>{purchase.productName}</h4>
                  <p>{formatPrice(purchase.price)} so'm</p>
                  <span className={`status-badge ${statusClass(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECOMMENDED */}
      <div className="user-section-card">
        <div className="manager-panel-header">
          <h2>✨ Tavsiya etilgan telefonlar</h2>
          <Link to="/user/products" className="user-see-all">
            Hammasi →
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
              <strong>{formatPrice(product.price)} so'm</strong>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;