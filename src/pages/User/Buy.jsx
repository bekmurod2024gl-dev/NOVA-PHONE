import { useEffect, useState } from "react";

function Buy() {
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("nova_user_purchases_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [ratingDraft, setRatingDraft] = useState({});

  useEffect(() => {
    localStorage.setItem("nova_user_purchases_v1", JSON.stringify(purchases));
  }, [purchases]);

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });

  const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleCancel = (id) => {
    if (!window.confirm("Bu buyurtmani bekor qilmoqchimisiz?")) return;
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Bekor qilindi" } : p))
    );
  };

  const handleRemove = (id) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  const setDraftRating = (id, rating) => {
    setRatingDraft((prev) => ({ ...prev, [id]: rating }));
  };

  const submitRating = (id) => {
    const rating = ratingDraft[id];
    if (!rating) return;
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, myRating: rating } : p)));
  };

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

  const renderStars = (id, current) => {
    const displayed = ratingDraft[id] ?? current;
    return (
      <div className="my-star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={n <= displayed ? "star-filled" : "star-empty"}
            onClick={() => setDraftRating(id, n)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const activeCount = purchases.filter((p) => p.status === "Yetkazilmoqda").length;
  const deliveredCount = purchases.filter((p) => p.status === "Yetkazildi").length;
  const cancelledCount = purchases.filter((p) => p.status === "Bekor qilindi").length;

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>Buy — Xaridlarim 🛒</h1>
          <p>Barcha buyurtmalaringiz, yetkazish sanasi va holati shu yerda.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card blue">
          <div className="stat-icon">🚚</div>
          <div>
            <p>Yo'lda</p>
            <h2>{activeCount}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div>
            <p>Yetkazildi</p>
            <h2>{deliveredCount}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">✕</div>
          <div>
            <p>Bekor qilingan</p>
            <h2>{cancelledCount}</h2>
          </div>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="no-products">
          <h2>😔 Hali xarid yo'q</h2>
          <p>Products bo'limidan telefon tanlab, "Buy" tugmasini bosing!</p>
        </div>
      ) : (
        <div className="my-orders-list">
          {purchases.map((purchase) => {
            const remaining = daysUntil(purchase.deliveryDate);
            return (
              <div className="my-order-card" key={purchase.id}>
                <img
                  src={purchase.image}
                  alt={purchase.productName}
                  onError={(e) => (e.target.src = "https://placehold.co/120x120?text=📱")}
                />

                <div className="my-order-info">
                  <h4>{purchase.productName}</h4>
                  <p>
                    {formatPrice(purchase.price)} so'm · Buyurtma: {formatDate(purchase.orderDate)}
                  </p>

                  {purchase.status === "Yetkazilmoqda" && (
                    <p className="delivery-eta">
                      📦 Yetkazilish sanasi: <strong>{formatDate(purchase.deliveryDate)}</strong>{" "}
                      {remaining > 0 ? `(${remaining} kun qoldi)` : "(bugun-erta)"}
                    </p>
                  )}

                  <span className={`status-badge ${statusClass(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </div>

                <div className="my-order-rating">
                  {purchase.status === "Yetkazilmoqda" || purchase.status === "Kutilmoqda" ? (
                    <button className="delete-button" onClick={() => handleCancel(purchase.id)}>
                      ✕ Cancel
                    </button>
                  ) : purchase.status === "Bekor qilindi" ? (
                    <button className="delete-button" onClick={() => handleRemove(purchase.id)}>
                      🗑️ Ro'yxatdan o'chirish
                    </button>
                  ) : purchase.myRating > 0 ? (
                    <div className="my-rating-done">
                      <span className="review-stars">
                        {"★".repeat(purchase.myRating)}
                        {"☆".repeat(5 - purchase.myRating)}
                      </span>
                      <p>Rahmat, bahoyingiz uchun!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="rate-label">Mahsulotni baholang:</p>
                      {renderStars(purchase.id, purchase.myRating)}
                      <button className="edit-button" onClick={() => submitRating(purchase.id)}>
                        Baholash
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Buy;