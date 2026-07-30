import { useEffect, useState } from "react";

const defaultReviews = [
  {
    id: 1,
    customer: "Madina Sobirova",
    product: "Google Pixel 9",
    rating: 5,
    comment: "Hammasi a'lo darajada, xodimlar juda yordamchi bo'lishdi!",
    time: "2 soat oldin",
  },
  {
    id: 2,
    customer: "Sardor Akmalov",
    product: "Xiaomi 14",
    rating: 2,
    comment: "Ekranida nuqson bor edi, qaytarib berdim. Sifat nazorati sust.",
    time: "5 soat oldin",
  },
  {
    id: 3,
    customer: "Dilnoza Karimova",
    product: "iPhone 14",
    rating: 4,
    comment: "Yaxshi, faqat yetkazish biroz kechikdi.",
    time: "kecha",
  },
  {
    id: 4,
    customer: "Ali Valiyev",
    product: "iPhone 15 Pro",
    rating: 5,
    comment: "Tez yetkazib berishdi, mahsulot originaliga to'g'ri keldi.",
    time: "2 kun oldin",
  },
  {
    id: 5,
    customer: "Otabek Rustamov",
    product: "Xiaomi 14 Ultra",
    rating: 2,
    comment: "Batareya tez tugaydi, kutganimdek chiqmadi.",
    time: "3 kun oldin",
  },
];

function Reviews() {
  const [reviews] = useState(() => {
    const saved = localStorage.getItem("nova_reviews_v1");
    return saved ? JSON.parse(saved) : defaultReviews;
  });

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("nova_reviews_v1", JSON.stringify(reviews));
  }, [reviews]);

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "high" && r.rating >= 4) ||
      (ratingFilter === "low" && r.rating <= 2);
    return matchesSearch && matchesRating;
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const highCount = reviews.filter((r) => r.rating >= 4).length;
  const lowCount = reviews.filter((r) => r.rating <= 2).length;

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>Mijozlar izohlari 💬</h1>
          <p>Mijozlarning fikr-mulohazalarini shu yerdan kuzatib boring.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">⭐</div>
          <div>
            <p>O'rtacha reyting</p>
            <h2>{avgRating}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">😊</div>
          <div>
            <p>Ijobiy izohlar</p>
            <h2>{highCount}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">😞</div>
          <div>
            <p>Salbiy izohlar</p>
            <h2>{lowCount}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Mijoz yoki mahsulot bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="all">Barchasi</option>
          <option value="high">Ijobiy (4-5 ★)</option>
          <option value="low">Salbiy (1-2 ★)</option>
        </select>
      </div>

      <div className="review-list">
        {filtered.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-top">
              <div>
                <h4>{review.customer}</h4>
                <p className="review-product">{review.product}</p>
              </div>
              <span className="review-stars">{renderStars(review.rating)}</span>
            </div>
            <p className="review-comment">"{review.comment}"</p>
            <span className="review-time">{review.time}</span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-products">
            <h2>😔 Izoh topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;