import { useEffect, useState } from "react";

// WIKIPEDIA DAN OLINGAN HAQIQIY RASMLAR
const catalog = [
  { id: 1, name: "iPhone 15 Pro", brand: "Apple", category: "Apple", price: 12500000, oldPrice: 15000000, discount: 17, rating: 4.9, liked: 124, stock: 25, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/IPhone_14_Pro_Max.jpg/400px-IPhone_14_Pro_Max.jpg", description: "Titan korpusli premium iPhone." },
  { id: 2, name: "iPhone 15", brand: "Apple", category: "Apple", price: 9800000, oldPrice: 11000000, discount: 11, rating: 4.8, liked: 85, stock: 40, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/IPhone_14_Pro.jpg/400px-IPhone_14_Pro.jpg", description: "Dynamic Island bilan yangi avlod iPhone." },
  { id: 3, name: "iPhone 14 Pro Max", brand: "Apple", category: "Apple", price: 11900000, oldPrice: 14000000, discount: 15, rating: 4.8, liked: 215, stock: 12, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/IPhone_14_Pro_Max.jpg/400px-IPhone_14_Pro_Max.jpg", description: "Katta ekran va kuchli kamera." },
  { id: 4, name: "iPhone 13", brand: "Apple", category: "Apple", price: 7500000, oldPrice: 8500000, discount: 12, rating: 4.6, liked: 340, stock: 50, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/IPhone_13_Pro_Max.png/400px-IPhone_13_Pro_Max.png", description: "Eng ommabop Apple smartfoni." },
  { id: 5, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "Samsung", price: 14800000, oldPrice: 17000000, discount: 13, rating: 4.9, liked: 98, stock: 18, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Samsung_Galaxy_S23_Ultra.jpg/400px-Samsung_Galaxy_S23_Ultra.jpg", description: "Galaxy AI va S Pen bilan." },
  { id: 6, name: "Samsung Galaxy S24+", brand: "Samsung", category: "Samsung", price: 11200000, oldPrice: 13000000, discount: 14, rating: 4.7, liked: 64, stock: 22, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Samsung_Galaxy_S22_Plus.jpg/400px-Samsung_Galaxy_S22_Plus.jpg", description: "Premium Samsung flagmani." },
  { id: 7, name: "Samsung Galaxy A55", brand: "Samsung", category: "Samsung", price: 4600000, oldPrice: 5200000, discount: 12, rating: 4.5, liked: 189, stock: 65, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Samsung_Galaxy_A54_5G.png/400px-Samsung_Galaxy_A54_5G.png", description: "O'rta klassdagi kuchli telefon." },
  { id: 8, name: "Samsung Z Flip5", brand: "Samsung", category: "Samsung", price: 9500000, oldPrice: 11000000, discount: 14, rating: 4.5, liked: 78, stock: 14, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Samsung_Galaxy_Z_Flip4.png/400px-Samsung_Galaxy_Z_Flip4.png", description: "Buklama Samsung telefoni." },
  { id: 9, name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "Xiaomi", price: 10500000, oldPrice: 12000000, discount: 13, rating: 4.8, liked: 76, stock: 22, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Xiaomi_13_Pro.png/400px-Xiaomi_13_Pro.png", description: "Leica kamerali Xiaomi." },
  { id: 10, name: "Redmi Note 13 Pro+", brand: "Xiaomi", category: "Xiaomi", price: 4400000, oldPrice: 5000000, discount: 12, rating: 4.5, liked: 245, stock: 80, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Redmi_Note_12_Pro_Plus.png/400px-Redmi_Note_12_Pro_Plus.png", description: "200MP kamerali Redmi." },
  { id: 11, name: "Poco F6 Pro", brand: "Xiaomi", category: "Xiaomi", price: 5800000, oldPrice: 6500000, discount: 11, rating: 4.7, liked: 134, stock: 35, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Poco_F3.jpg/400px-Poco_F3.jpg", description: "Snapdragon protsessorli Poco." },
  { id: 12, name: "Redmi 13C", brand: "Xiaomi", category: "Xiaomi", price: 1600000, oldPrice: 1900000, discount: 16, rating: 4.3, liked: 412, stock: 120, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Redmi_Note_11.png/400px-Redmi_Note_11.png", description: "Hamyonbop Redmi telefoni." },
  { id: 13, name: "Google Pixel 8 Pro", brand: "Google", category: "Google", price: 10200000, oldPrice: 12000000, discount: 15, rating: 4.8, liked: 115, stock: 14, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Google_Pixel_7.png/400px-Google_Pixel_7.png", description: "Toza Android tajribasi." },
  { id: 14, name: "Google Pixel 8", brand: "Google", category: "Google", price: 7800000, oldPrice: 8900000, discount: 12, rating: 4.6, liked: 88, stock: 20, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Google_Pixel_7.png/400px-Google_Pixel_7.png", description: "Google flagmani." },
  { id: 15, name: "Google Pixel 7a", brand: "Google", category: "Google", price: 4900000, oldPrice: 5500000, discount: 11, rating: 4.5, liked: 142, stock: 28, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Google_Pixel_6a.png/400px-Google_Pixel_6a.png", description: "Pixel kamerasi bilan." },
  { id: 16, name: "Google Pixel Fold", brand: "Google", category: "Google", price: 15500000, oldPrice: 18000000, discount: 14, rating: 4.4, liked: 31, stock: 5, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Google_Pixel_Fold.png/400px-Google_Pixel_Fold.png", description: "Buklama Pixel." },
  { id: 17, name: "OnePlus 12", brand: "OnePlus", category: "OnePlus", price: 9200000, oldPrice: 10500000, discount: 12, rating: 4.8, liked: 89, stock: 16, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/OnePlus_11.png/400px-OnePlus_11.png", description: "Flagman OnePlus." },
  { id: 18, name: "OnePlus 12R", brand: "OnePlus", category: "OnePlus", price: 6200000, oldPrice: 7000000, discount: 11, rating: 4.6, liked: 73, stock: 24, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/OnePlus_8T.png/400px-OnePlus_8T.png", description: "Narx va sifat bo'yicha zo'r." },
  { id: 19, name: "OnePlus Nord 4", brand: "OnePlus", category: "OnePlus", price: 4500000, oldPrice: 5100000, discount: 12, rating: 4.5, liked: 52, stock: 45, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/OnePlus_Nord_CE_5G.png/400px-OnePlus_Nord_CE_5G.png", description: "Metall korpusli zamonaviy OnePlus." },
  { id: 20, name: "OnePlus Nord CE 4", brand: "OnePlus", category: "OnePlus", price: 3500000, oldPrice: 3900000, discount: 10, rating: 4.4, liked: 61, stock: 50, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/OnePlus_Nord_CE_5G.png/400px-OnePlus_Nord_CE_5G.png", description: "100W tezkor quvvatlashga ega." },
  { id: 21, name: "Huawei Pura 70 Ultra", brand: "Huawei", category: "Huawei", price: 13500000, oldPrice: 16000000, discount: 16, rating: 4.9, liked: 61, stock: 7, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Huawei_P50_Pro.png/400px-Huawei_P50_Pro.png", description: "Professional kamerali Huawei." },
  { id: 22, name: "Huawei Mate 60 Pro", brand: "Huawei", category: "Huawei", price: 11000000, oldPrice: 12500000, discount: 12, rating: 4.7, liked: 49, stock: 10, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Huawei_Mate_50_Pro.png/400px-Huawei_Mate_50_Pro.png", description: "Kirin protsessorli flagman." },
  { id: 23, name: "Huawei Nova 12 Pro", brand: "Huawei", category: "Huawei", price: 5900000, oldPrice: 6700000, discount: 12, rating: 4.5, liked: 74, stock: 15, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Huawei_Nova_9.png/400px-Huawei_Nova_9.png", description: "Selfi kamerasi bilan mashhur." },
  { id: 24, name: "Huawei Mate X5", brand: "Huawei", category: "Huawei", price: 19500000, oldPrice: 22000000, discount: 11, rating: 4.6, liked: 25, stock: 4, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Huawei_Mate_X2.png/400px-Huawei_Mate_X2.png", description: "Buklama premium telefon." },
  { id: 25, name: "Realme GT 6", brand: "Realme", category: "Realme", price: 6400000, oldPrice: 7200000, discount: 11, rating: 4.6, liked: 83, stock: 33, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Realme_GT_3.png/400px-Realme_GT_3.png", description: "Kuchli Snapdragon protsessori." },
  { id: 26, name: "Realme 12 Pro Plus", brand: "Realme", category: "Realme", price: 4300000, oldPrice: 4900000, discount: 12, rating: 4.5, liked: 114, stock: 55, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Realme_GT_Neo_3.png/400px-Realme_GT_Neo_3.png", description: "Periskop kamerali model." },
  { id: 27, name: "Realme C67", brand: "Realme", category: "Realme", price: 2100000, oldPrice: 2400000, discount: 13, rating: 4.3, liked: 230, stock: 90, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Realme_C35.jpg/400px-Realme_C35.jpg", description: "108MP kamerali budjet telefon." },
  { id: 28, name: "Realme 12 5G", brand: "Realme", category: "Realme", price: 2800000, oldPrice: 3200000, discount: 13, rating: 4.4, liked: 91, stock: 42, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Realme_8_5G.png/400px-Realme_8_5G.png", description: "5G qo'llab-quvvatlovchi model." },
  { id: 29, name: "Oppo Find X7 Ultra", brand: "Oppo", category: "Oppo", price: 11500000, oldPrice: 13000000, discount: 12, rating: 4.8, liked: 41, stock: 9, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Oppo_Find_X5_Pro.png/400px-Oppo_Find_X5_Pro.png", description: "Premium Oppo flagmani." },
  { id: 30, name: "Oppo Reno 12 Pro", brand: "Oppo", category: "Oppo", price: 5400000, oldPrice: 6200000, discount: 13, rating: 4.5, liked: 67, stock: 38, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Oppo_Reno_6.png/400px-Oppo_Reno_6.png", description: "AI kamerali zamonaviy model." },
  { id: 31, name: "Oppo A78", brand: "Oppo", category: "Oppo", price: 2300000, oldPrice: 2600000, discount: 12, rating: 4.4, liked: 154, stock: 75, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Oppo_A74_5G.png/400px-Oppo_A74_5G.png", description: "AMOLED displeyli telefon." },
  { id: 32, name: "Oppo Find N3 Flip", brand: "Oppo", category: "Oppo", price: 9900000, oldPrice: 11500000, discount: 14, rating: 4.6, liked: 48, stock: 11, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Oppo_Find_N2_Flip.png/400px-Oppo_Find_N2_Flip.png", description: "Buklama Oppo telefoni." },
  { id: 33, name: "Vivo X100 Pro", brand: "Vivo", category: "Vivo", price: 10800000, oldPrice: 12500000, discount: 14, rating: 4.8, liked: 59, stock: 11, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Vivo_X80_Pro.png/400px-Vivo_X80_Pro.png", description: "Zeiss kamerali Vivo." },
  { id: 34, name: "Vivo V30 Pro", brand: "Vivo", category: "Vivo", price: 5600000, oldPrice: 6300000, discount: 11, rating: 4.6, liked: 92, stock: 42, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Vivo_V23.png/400px-Vivo_V23.png", description: "Aura Light chirog'iga ega portret ustasi." },
  { id: 35, name: "Vivo Y200 5G", brand: "Vivo", category: "Vivo", price: 3100000, oldPrice: 3500000, discount: 11, rating: 4.3, liked: 104, stock: 60, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Vivo_Y76_5G.png/400px-Vivo_Y76_5G.png", description: "Chiroyli orqa panelli yupqa dizayn." },
  { id: 36, name: "Vivo T2x 5G", brand: "Vivo", category: "Vivo", price: 1900000, oldPrice: 2200000, discount: 14, rating: 4.2, liked: 178, stock: 88, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Vivo_Y21.png/400px-Vivo_Y21.png", description: "Hamyonbop va tezkor 5G smartfon." }
];

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Huawei", "Realme", "Oppo", "Vivo"];

function getDeliveryDate() {
  const days = 3 + Math.floor(Math.random() * 5);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function Products() {
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

      <div className="products-grid">
        {filtered.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={product.image}
                alt={product.name}
                style={{ objectFit: "contain", backgroundColor: "#fff" }}
              />
              <span className="discount-badge">-{product.discount}%</span>

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
                <span>⭐ {product.rating}</span>
              </div>

              <div className="price-row">
                <del>{formatPrice(product.oldPrice)} so'm</del>
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
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-products">
          <h2>😔 Mahsulot topilmadi</h2>
          <p>Boshqa nom yoki brend bilan qidirib ko'ring.</p>
        </div>
      )}
    </div>
  );
}

export default Products;