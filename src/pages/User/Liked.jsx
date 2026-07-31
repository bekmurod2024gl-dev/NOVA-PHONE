import { useEffect, useState } from "react";

const API_URL = "https://novaphone-backend.onrender.com";

const generateFallbackImage = (name) => {
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23f87171' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='2' width='14' height='20' rx='2' ry='2'/%3E%3Cline x1='12' y1='18' x2='12.01' y2='18'/%3E%3C/svg%3E`;
};

function Liked() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(() => {
    try {
      const saved = localStorage.getItem("nova_user_liked_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
        console.error("Sevimlilarni yuklashda xatolik:", err);
        setError("Mahsulotlarni yuklab bo'lmadi. Backend ishlab turganini tekshiring.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("nova_user_liked_v1", JSON.stringify(liked));
  }, [liked]);

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);

  const removeLiked = (id) => {
    setLiked((prev) => prev.filter((f) => f !== id));
  };

  const likedProducts = catalog.filter((p) => liked.includes(p.id));

  return (
    <div className="shop-page">
      <div className="products-header">
        <div>
          <h1>Sevimlilar ❤️</h1>
          <p>Yoqtirgan mahsulotlaringiz shu yerda saqlanadi. Jami: {likedProducts.length} ta</p>
        </div>
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

      {!loading && !error && likedProducts.length === 0 && (
        <div className="no-products">
          <h2>😔 Hali sevimli mahsulot yo'q</h2>
          <p>Mahsulotlar bo'limida yoqtirgan telefoningizni ❤️ tugmasi bilan belgilang.</p>
        </div>
      )}

      {!loading && !error && likedProducts.length > 0 && (
        <div className="products-grid">
          {likedProducts.map((product) => {
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
                    className="shop-like-btn liked"
                    onClick={() => removeLiked(product.id)}
                  >
                    ❤️
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Liked;