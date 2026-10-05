import { useEffect, useMemo, useState } from "react";
import { getSessionUser, getUserPurchases, saveUserPurchases, updateSalesReview } from "../../utils/userStorage";
import ConfirmModal from "../../components/ConfirmModal";

const CARD_TYPES = [
  { id: "uzcard", name: "Uzcard", prefix: "8600", icon: "🟢", bg: "linear-gradient(135deg, #059669, #10b981)" },
  { id: "humo", name: "Humo", prefix: "9860", icon: "🔵", bg: "linear-gradient(135deg, #0284c7, #38bdf8)" },
  { id: "visa", name: "Visa", prefix: "4", icon: "🟡", bg: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
  { id: "mastercard", name: "Mastercard", prefix: "5", icon: "🟠", bg: "linear-gradient(135deg, #c2410c, #f97316)" },
];

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
  const [purchases, setPurchases] = useState(() => getUserPurchases(currentUser?.id));
  const [ratingDraft, setRatingDraft] = useState({});
  const [satisfactionDraft, setSatisfactionDraft] = useState({});
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [gameMessage, setGameMessage] = useState("");
  const [bonusPrize, setBonusPrize] = useState("Sovg'a tayyorlanmoqda...");
  const [drumBeat, setDrumBeat] = useState("");
  const [slotValues, setSlotValues] = useState(["7", "7", "7"]);
  const [wheelRotation, setWheelRotation] = useState(0);

  const [selectedCardType, setSelectedCardType] = useState("uzcard");
  const [paymentForm, setPaymentForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [cancelModal, setCancelModal] = useState({ isOpen: false, purchaseId: null, productName: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, purchaseId: null, productName: "" });

  useEffect(() => {
    const sync = () => {
      setPurchases(getUserPurchases(currentUser?.id));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("nova_purchases_updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("nova_purchases_updated", sync);
    };
  }, [currentUser?.id]);

  const openCancelModal = (item) => {
    setCancelModal({
      isOpen: true,
      purchaseId: item.id,
      productName: item.productName || item.product || "Mahsulot",
    });
  };

  const confirmCancel = () => {
    if (!cancelModal.purchaseId) return;
    const updated = purchases.map((p) =>
      p.id === cancelModal.purchaseId ? { ...p, status: "Bekor qilindi" } : p
    );
    setPurchases(updated);
    saveUserPurchases(updated, currentUser?.id);
  };

  const openDeleteModal = (item) => {
    setDeleteModal({
      isOpen: true,
      purchaseId: item.id,
      productName: item.productName || item.product || "Mahsulot",
    });
  };

  const confirmDelete = () => {
    if (!deleteModal.purchaseId) return;
    const updated = purchases.filter((p) => p.id !== deleteModal.purchaseId);
    setPurchases(updated);
    saveUserPurchases(updated, currentUser?.id);
  };


  const setDraftRating = (id, rating) => {
    setRatingDraft((prev) => ({ ...prev, [id]: rating }));
  };

  const submitRating = (id) => {
    const rating = ratingDraft[id] ?? 5;
    const satisfaction = satisfactionDraft[id] ?? "Mamnun";
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, myRating: rating, satisfaction } : p)));
    updateSalesReview({ purchaseId: id, rating, satisfaction });
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

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    if (raw.startsWith("8600") || raw.startsWith("5614")) setSelectedCardType("uzcard");
    else if (raw.startsWith("9860")) setSelectedCardType("humo");
    else if (raw.startsWith("4")) setSelectedCardType("visa");
    else if (raw.startsWith("5")) setSelectedCardType("mastercard");

    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
    setPaymentForm((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2, 4);
    }
    setPaymentForm((prev) => ({ ...prev, expiry: raw }));
  };

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPaymentForm((prev) => ({ ...prev, cvv: raw }));
  };

  const handleCheckout = (event) => {
    event.preventDefault();

    if (!purchases.length) {
      setPaymentMessage("⚠️ Hech qanday buyurtma yo'q. Avval mahsulot tanlang.");
      return;
    }

    const cleanCard = paymentForm.cardNumber.replace(/\s/g, "");
    if (!paymentForm.cardHolder.trim() || cleanCard.length < 16 || !paymentForm.expiry.includes("/") || paymentForm.cvv.length < 3) {
      setPaymentMessage("⚠️ Karta ma'lumotlarini (16 ta raqam, muddat va CVV) to'liq kiriting.");
      return;
    }

    const activeCardObj = CARD_TYPES.find((c) => c.id === selectedCardType) || CARD_TYPES[0];
    setPaymentMessage(
      `✅ ${activeCardObj.name} orqali to'lov muvaffaqiyatli amalga oshirildi! Jami: ${formatPrice(total)} so'm ${appliedPromo ? `(${PROMO_CODES[appliedPromo].note})` : ""}.`
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
            background: "rgba(15,23,42,0.85)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 20,
            padding: 24,
            color: "#e2e8f0",
            boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>💳 Karta orqali to'lov</h3>

          {/* VIRTUAL CARD PREVIEW */}
          {(() => {
            const activeCard = CARD_TYPES.find((c) => c.id === selectedCardType) || CARD_TYPES[0];
            return (
              <div
                style={{
                  background: activeCard.bg,
                  borderRadius: 16,
                  padding: "18px 22px",
                  color: "#ffffff",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
                  marginBottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 160,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>💳</span>
                  <span style={{ fontWeight: 800, letterSpacing: 1.5, fontSize: 15, textTransform: "uppercase" }}>
                    {activeCard.name}
                  </span>
                </div>
                <div style={{ margin: "16px 0 12px", fontSize: 19, letterSpacing: 2.5, fontFamily: "monospace", fontWeight: 700 }}>
                  {paymentForm.cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, textTransform: "uppercase", opacity: 0.9 }}>
                  <div>
                    <div style={{ fontSize: 9, opacity: 0.75 }}>KARTA EGASI</div>
                    <div style={{ fontWeight: 600 }}>{paymentForm.cardHolder || "ISM FAMILIYA"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, opacity: 0.75 }}>MUDDATI</div>
                    <div style={{ fontWeight: 600 }}>{paymentForm.expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* CARD TYPE SELECTOR TABS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 16 }}>
            {CARD_TYPES.map((card) => {
              const isSelected = selectedCardType === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedCardType(card.id)}
                  style={{
                    padding: "8px 6px",
                    borderRadius: 10,
                    background: isSelected ? card.bg : "rgba(255,255,255,0.06)",
                    border: isSelected ? "1.5px solid #ffffff" : "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{card.icon}</span>
                  <span>{card.name}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCheckout} style={{ display: "grid", gap: 12 }}>
            <input
              id="card-holder"
              name="cardHolder"
              type="text"
              autoComplete="cc-name"
              placeholder="Karta egasi (Masalan: BOBOMUROD JUMABOYEV)"
              value={paymentForm.cardHolder}
              onChange={(event) => setPaymentForm((prev) => ({ ...prev, cardHolder: event.target.value.toUpperCase() }))}
              style={{ padding: 11, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }}
              required
            />
            <input
              id="card-number"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="16 xonali karta raqami (8600 / 9860 / 4... / 5...)"
              value={paymentForm.cardNumber}
              onChange={handleCardNumberChange}
              style={{ padding: 11, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14, fontFamily: "monospace" }}
              required
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                id="card-expiry"
                name="expiry"
                type="text"
                autoComplete="cc-exp"
                placeholder="Amal qilish muddati (MM/YY)"
                value={paymentForm.expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                style={{ padding: 11, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }}
                required
              />
              <input
                id="card-cvv"
                name="cvv"
                type="password"
                autoComplete="cc-csc"
                placeholder="CVV / CVC (3 xonali)"
                value={paymentForm.cvv}
                onChange={handleCvvChange}
                maxLength={4}
                style={{ padding: 11, borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14 }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="promo-code"
                name="promoCode"
                type="text"
                autoComplete="off"
                placeholder="Promokod (masalan: NOVA10, WELCOME5)"
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
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#fff", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10 }}>
              <span>Jami to'lov</span>
              <span style={{ color: "#38bdf8" }}>{formatPrice(total)} so'm</span>
            </div>

            <button type="submit" className="shop-buy-btn" style={{ marginTop: 8 }}>
              💳 To'lovni tasdiqlash
            </button>
            {paymentMessage && (
              <p style={{ margin: "4px 0 0", color: paymentMessage.includes("✅") ? "#34d399" : "#f87171", fontSize: 13.5, fontWeight: 500 }}>
                {paymentMessage}
              </p>
            )}
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
                    <button className="delete-button" onClick={() => openCancelModal(purchase)}>
                      ✕ Bekor qilish
                    </button>
                  ) : purchase.status === "Bekor qilindi" ? (
                    <button className="delete-button" onClick={() => openDeleteModal(purchase)}>
                      🗑️ Ro'yxatdan o'chirish
                    </button>
                  ) : purchase.myRating > 0 ? (
                    <div className="my-rating-done">
                      <span className="review-stars">
                        {"★".repeat(purchase.myRating)}
                        {"☆".repeat(5 - purchase.myRating)}
                      </span>
                      <p>{purchase.satisfaction === "Norozi" ? "😞 Norozi" : purchase.satisfaction === "Neytral" ? "😐 Neytral" : "😊 Mamnun"}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="rate-label">Mahsulotni baholang:</p>
                      <select
                        className="status-select"
                        value={satisfactionDraft[purchase.id] ?? purchase.satisfaction ?? "Mamnun"}
                        onChange={(event) => setSatisfactionDraft((prev) => ({ ...prev, [purchase.id]: event.target.value }))}
                        style={{ marginBottom: 8 }}
                      >
                        <option value="Mamnun">😊 Mamnun</option>
                        <option value="Neytral">😐 Neytral</option>
                        <option value="Norozi">😞 Norozi</option>
                      </select>
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

      {/* CONFIRMATION MODALS */}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, purchaseId: null, productName: "" })}
        onConfirm={confirmCancel}
        title="Buyurtmani bekor qilish"
        message={`"${cancelModal.productName}" buyurtmasini bekor qilmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.`}
        confirmText="Ha, bekor qilish"
        cancelText="Yo'q, qolsin"
        type="danger"
        icon="⚠️"
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, purchaseId: null, productName: "" })}
        onConfirm={confirmDelete}
        title="Ro'yxatdan o'chirish"
        message={`"${deleteModal.productName}" buyurtmasini tarixdan butunlay o'chirmoqchimisiz?`}
        confirmText="Ha, o'chirish"
        cancelText="Qaytish"
        type="danger"
        icon="🗑️"
      />
    </div>
  );
}

export default Buy;