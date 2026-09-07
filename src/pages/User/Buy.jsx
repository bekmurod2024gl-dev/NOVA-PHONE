import { useEffect, useMemo, useState } from "react";
import { getSessionUser, readScopedState, writeScopedState } from "../../utils/userStorage";

const PROMO_CODES = {
  NOVA10: { label: "NOVA10", discount: 0.1, note: "10% chegirma" },
  DRUM20: { label: "DRUM20", discount: 0.2, note: "20% bonus" },
  WELCOME5: { label: "WELCOME5", discount: 0.05, note: "5% xush kelibsiz" },
  VIPFREE: { label: "VIPFREE", discount: 0.15, note: "15% VIP bonus" },
};

const DRUM_PADS = ["🥁", "🔊", "🎵", "✨", "💥", "🪩"];
const BONUS_REWARDS = [
  { code: "NOVA10", title: "10% chegirma", emoji: "🎁", color: "#22c55e", icon: "🎁" },
  { code: "WELCOME5", title: "Xush kelibsiz bonus", emoji: "🎉", color: "#38bdf8", icon: "🎉" },
  { code: "DRUM20", title: "20% bonus sovg'a", emoji: "🥁", color: "#f59e0b", icon: "🥁" },
  { code: "VIPFREE", title: "VIP bonus", emoji: "👑", color: "#f472b6", icon: "👑" },
  { code: "GIFT50", title: "5000 so'm gift", emoji: "💸", color: "#14b8a6", icon: "💸" },
  { code: "EARBUD", title: "TWS quloqchin", emoji: "🎧", color: "#a78bfa", icon: "🎧" },
  { code: "CASE", title: "Korpus seti", emoji: "📱", color: "#fb7185", icon: "📱" },
  { code: "STICKER", title: "Maxsus sticker", emoji: "✨", color: "#facc15", icon: "✨" },
];
const SLOT_SYMBOLS = ["7", "⭐", "💎", "🎁", "🎉", "👑", "💸", "🎧"];
const WHEEL_SEGMENTS = [
  { label: "NOVA10", color: "#f97316" },
  { label: "VIPFREE", color: "#facc15" },
  { label: "WELCOME5", color: "#22c55e" },
  { label: "DRUM20", color: "#3b82f6" },
  { label: "GIFT50", color: "#a78bfa" },
  { label: "EARBUD", color: "#f472b6" },
  { label: "CASE", color: "#14b8a6" },
  { label: "STICKER", color: "#fb7185" },
];

function Buy() {
  const currentUser = getSessionUser();
  const [purchases, setPurchases] = useState(() => readScopedState("nova_user_purchases_v1", []));
  const [ratingDraft, setRatingDraft] = useState({});
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [gameMessage, setGameMessage] = useState("");
  const [bonusPrize, setBonusPrize] = useState("Sovg'a tayyorlanmoqda...");
  const [drumBeat, setDrumBeat] = useState("");
  const [slotValues, setSlotValues] = useState(["7", "7", "7"]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [paymentForm, setPaymentForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    writeScopedState("nova_user_purchases_v1", purchases);
  }, [purchases, currentUser?.id]);

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });

  const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const subtotal = useMemo(
    () => purchases.filter((p) => p.status !== "Bekor qilindi").reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    [purchases]
  );

  const discountRate = appliedPromo ? PROMO_CODES[appliedPromo]?.discount || 0 : 0;
  const shippingCost = subtotal > 0 ? 15000 : 0;
  const total = Math.max(subtotal - subtotal * discountRate + shippingCost, 0);

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

  const applyPromoCode = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPaymentMessage("Promokod kiriting!");
      return;
    }

    const promo = PROMO_CODES[code];
    if (!promo) {
      setPaymentMessage("Bu promokod mavjud emas. Qayta urinib ko'ring.");
      return;
    }

    setAppliedPromo(code);
    setPaymentMessage(`${promo.note} qo'llanildi.`);
  };

  const handleCheckout = (event) => {
    event.preventDefault();

    if (!purchases.length) {
      setPaymentMessage("Hech qanday buyurtma yo'q. Avval mahsulot tanlang.");
      return;
    }

    if (
      !paymentForm.cardHolder ||
      !paymentForm.cardNumber ||
      !paymentForm.expiry ||
      !paymentForm.cvv
    ) {
      setPaymentMessage("Karta ma'lumotlarini to'liq kiriting.");
      return;
    }

    setPaymentMessage(
      `Demo to'lov muvaffaqiyatli bajarildi. ${formatPrice(total)} so'mdan ${appliedPromo ? PROMO_CODES[appliedPromo].note : "chegirma qo'llanilmadi"}.`
    );
    setPaymentForm({ cardHolder: "", cardNumber: "", expiry: "", cvv: "" });
  };

  const revealReward = (reward, rotationDelta = 0) => {
    setBonusPrize(`${reward.icon} ${reward.code} — ${reward.title}`);
    setAppliedPromo(reward.code);
    setPromoInput(reward.code);
    setGameMessage(`Sovg'a tanlandi: ${reward.title}. Bu bonus mini-o'yin bo'lib, qimor emas.`);
    setWheelRotation((prev) => prev + rotationDelta);
  };

  const playDrumGame = () => {
    const rewarded = BONUS_REWARDS[Math.floor(Math.random() * BONUS_REWARDS.length)];
    const randomBeat = DRUM_PADS[Math.floor(Math.random() * DRUM_PADS.length)];
    const index = BONUS_REWARDS.indexOf(rewarded);
    const rotationDelta = 360 * 4 + (360 - (index * 360) / BONUS_REWARDS.length - 20);
    setDrumBeat(`${randomBeat} Boom!`);
    revealReward(rewarded, rotationDelta);
  };

  const spinLuckyBonus = () => {
    const selected = BONUS_REWARDS[Math.floor(Math.random() * BONUS_REWARDS.length)];
    const wheelText = ["🎯", "🎊", "🎁", "✨"][Math.floor(Math.random() * 4)];
    const values = Array.from({ length: 3 }, () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
    setSlotValues(values);
    setDrumBeat(`${wheelText} Lucky spin`);
    revealReward(selected);
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "rgba(15,23,42,0.78)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 18,
            padding: 20,
            color: "#e2e8f0",
          }}
        >
          <h3 style={{ marginTop: 0 }}>💳 Karta orqali to'lov</h3>
          <form onSubmit={handleCheckout} style={{ display: "grid", gap: 12 }}>
            <input
              id="card-holder"
              name="cardHolder"
              type="text"
              autoComplete="cc-name"
              placeholder="Karta egasi"
              value={paymentForm.cardHolder}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, cardHolder: event.target.value }))}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            <input
              id="card-number"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={paymentForm.cardNumber}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, cardNumber: event.target.value }))}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                id="card-expiry"
                name="expiry"
                type="text"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={paymentForm.expiry}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, expiry: event.target.value }))}
                style={{ padding: 10, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              />
              <input
                id="card-cvv"
                name="cvv"
                type="password"
                autoComplete="cc-csc"
                placeholder="CVV"
                value={paymentForm.cvv}
                onChange={(event) => setPaymentForm((prev) => ({ ...prev, cvv: event.target.value }))}
                style={{ padding: 10, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="promo-code"
                name="promoCode"
                type="text"
                autoComplete="off"
                placeholder="Promokod"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
                style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              />
              <button type="button" className="secondary-button" onClick={applyPromoCode}>
                Qo'llash
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#cbd5e1" }}>
              <span>Mahsulotlar summasi</span>
              <strong>{formatPrice(subtotal)} so'm</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#cbd5e1" }}>
              <span>Chegirma</span>
              <strong>-{formatPrice(subtotal * discountRate)} so'm</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#cbd5e1" }}>
              <span>Yetkazib berish</span>
              <strong>{formatPrice(shippingCost)} so'm</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: "#fff" }}>
              <span>Umumiy</span>
              <span>{formatPrice(total)} so'm</span>
            </div>

            <button type="submit" className="shop-buy-btn">To'lovni tasdiqlash</button>
            {paymentMessage && <p style={{ margin: 0, color: "#a7f3d0", fontSize: 14 }}>{paymentMessage}</p>}
          </form>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.78)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 18,
            padding: 20,
            color: "#e2e8f0",
          }}
        >
          <h3 style={{ marginTop: 0 }}>🎵 Bonus mini-o'yin</h3>
          <p style={{ marginTop: 0, color: "#cbd5e1", fontSize: 13 }}>
            Bu bonus va sovg'a mini-o'yini bo'lib, qimor emas. Faqat chegirma va sovg'a tanlash uchun ishlatiladi.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <button type="button" className="admin-save-button" onClick={playDrumGame}>
              🥁 Barabanni aylantirish
            </button>
            <button type="button" className="secondary-button" onClick={spinLuckyBonus}>
              🎰 Lucky bonus aylantirish
            </button>

            <div
              style={{
                position: "relative",
                width: 300,
                height: 300,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "18px solid transparent",
                  borderRight: "18px solid transparent",
                  borderTop: "28px solid #f8fafc",
                  zIndex: 5,
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.7))",
                }}
              />

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "8px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 18px 35px rgba(15, 23, 42, 0.35)",
                  background: `conic-gradient(${WHEEL_SEGMENTS.map((segment, index) => `${segment.color} ${index * (360 / WHEEL_SEGMENTS.length)}deg ${(index + 1) * (360 / WHEEL_SEGMENTS.length)}deg`).join(", ")})`,
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: "transform 3.2s cubic-bezier(0.2, 0.7, 0.2, 1)",
                }}
              >
                {WHEEL_SEGMENTS.map((segment, index) => {
                  const angle = (360 / WHEEL_SEGMENTS.length) * index + 18;
                  return (
                    <div
                      key={`${segment.label}-${index}`}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: "30%",
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-110px) rotate(${-angle}deg)`,
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                      }}
                    >
                      <span>{segment.label}</span>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  position: "absolute",
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(180deg, #f8fafc, #dbeafe)",
                  border: "4px solid rgba(15,23,42,0.9)",
                  color: "#111827",
                  fontWeight: 900,
                  zIndex: 2,
                  boxShadow: "inset 0 0 18px rgba(255,255,255,0.6)",
                }}
              >
                🎁
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "linear-gradient(180deg, #3b3b3b, #121212)",
                  border: "3px solid #f8fafc",
                  borderRadius: 16,
                  padding: "18px 18px",
                  boxShadow: "inset 0 0 12px rgba(255,255,255,0.2), 0 8px 18px rgba(0,0,0,0.25)",
                }}
              >
                {slotValues.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(180deg, #fef3c7, #fbbf24)",
                      color: "#111827",
                      fontSize: 28,
                      fontWeight: 900,
                      boxShadow: "inset 0 0 12px rgba(255,255,255,0.6)",
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>

              <button
                type="button"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: "none",
                  background: "radial-gradient(circle at 35% 35%, #fca5a5, #ef4444 45%, #b91c1c 100%)",
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 900,
                  boxShadow: "0 8px 20px rgba(239,68,68,0.5)",
                  cursor: "pointer",
                }}
                aria-label="Lucky bonus spin"
              >
                ▶
              </button>
            </div>

            <div
              style={{
                minHeight: 64,
                borderRadius: 12,
                background: "rgba(59,130,246,0.12)",
                border: "1px dashed rgba(96,165,250,0.6)",
                padding: 12,
                color: "#dbeafe",
              }}
            >
              <strong>{drumBeat || "Sovg'a halqasi tayyorlanmoqda..."}</strong>
            </div>

            <div
              style={{
                borderRadius: 12,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.4)",
                padding: 12,
                color: "#bbf7d0",
                fontWeight: 600,
              }}
            >
              {bonusPrize}
            </div>

            {gameMessage && <p style={{ margin: 0, color: "#fcd34d" }}>{gameMessage}</p>}
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