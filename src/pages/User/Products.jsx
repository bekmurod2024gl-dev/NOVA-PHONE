import { useEffect, useState } from "react";

const API_URL = "https://novaphone-backend.onrender.com";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Huawei", "Realme", "Oppo", "Vivo"];

const generateFallbackImage = (name) => {
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23f87171' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='2' width='14' height='20' rx='2' ry='2'/%3E%3Cline x1='12' y1='18' x2='12.01' y2='18'/%3E%3C/svg%3E`;
};

function getDeliveryDate() {
  const days = 3 + Math.floor(Math.random() * 5);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function Products() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/`)
      .then((res) => {
        if (!res.ok) throw new Error("Server javob bermadi");
        return res.json();
      })
      .then((data) => {
        setCatalog(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Mahsulotlarni olishda xatolik:", err);
        setError("Mahsulotlarni yuklab bo'lmadi. Backend ishlab turganini tekshiring.");
      })
      .finally(() => setLoading(false));
  }, []);

  const [liked, setLiked] = useState(() => {
    try {
      const saved = localStorage.getItem("nova_user_liked_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem("nova_user_purchases_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [justBought, setJustBought] = useState(null);

  useEffect(() => {
    localStorage.setItem("nova_user_liked_v1", JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem("nova_user_purchases_v1", JSON.stringify(purchases));
  }, [purchases]);

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);

  const toggleLike = (id) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleBuy = (product) => {
    const newPurchase = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      image: product.image,
      price: product.price,
      orderDate: new Date().toISOString().slice(0, 10),
      deliveryDate: getDeliveryDate(),
      status: "Yetkazilmoqda",
      myRating: 0,
    };
    setPurchases((prev) => [newPurchase, ...prev]);
    setJustBought(product.id);
    setTimeout(() => setJustBought(null), 2000);
  };

  const filtered = catalog.filter((p) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchText) || p.brand.toLowerCase().includes(searchText);
    const matchesBrand = brandFilter === "all" || p.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="shop-page">
      <div className="products-header">
        <div>
          <h1>Mahsulotlar 📱</h1>
          <p>Yoqtirgan telefoningizni tanlang va buyurtma bering. Jami: {catalog.length} ta</p>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Telefon yoki brend qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="all">Barcha brendlar</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="no-products">
          <h2>⏳ Yuklanmoqda...</h2>
        </div>
      )}

      {!loading && error && (
        <div className="no-products">
          <h2>⚠️ Xatolik</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
      <div className="products-grid">
        {filtered.map((product) => {
          const oldPrice = product.oldPrice ?? Math.round(product.price * 1.15);
          const discount = product.discount ?? Math.round(((oldPrice - product.price) / oldPrice) * 100);
          const rating = product.rating ?? 4.5;

          return (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                style={{ backgroundColor: "#f8fafc", objectFit: "contain" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = generateFallbackImage(product.name);
                }}
              />
              <span className="discount-badge">-{discount}%</span>

              <button
                className={`shop-like-btn ${liked.includes(product.id) ? "liked" : ""}`}
                onClick={() => toggleLike(product.id)}
              >
                {liked.includes(product.id) ? "❤️" : "♡"}
              </button>
            </div>

            <div className="product-info">
              <div className="product-brand">{product.brand}</div>
              <h2>{product.name}</h2>
              <p className="product-description">{product.description}</p>

              <div className="rating-row">
                <span>⭐ {rating}</span>
              </div>

              <div className="price-row">
                <del>{formatPrice(oldPrice)} so'm</del>
                <h3>{formatPrice(product.price)} so'm</h3>
              </div>

              <button
                className="shop-buy-btn"
                onClick={() => handleBuy(product)}
                disabled={justBought === product.id}
              >
                {justBought === product.id ? "✅ Savatga qo'shildi!" : "🛒 Sotib olish"}
              </button>
            </div>
          </div>
          );
        })}
      </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="no-products">
          <h2>😔 Mahsulot topilmadi</h2>
          <p>Boshqa nom yoki brend bilan qidirib ko'ring.</p>
        </div>
      )}
    </div>
  );
}

export default Products;