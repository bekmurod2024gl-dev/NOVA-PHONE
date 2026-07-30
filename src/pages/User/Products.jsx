import { useEffect, useState } from "react";

// Barcha yo'llar sizning 'images' papkangizga moslashtirildi
const catalog = [
  { id: 1, name: "iPhone 15 Pro", brand: "Apple", category: "Apple", price: 12500000, oldPrice: 15000000, discount: 17, rating: 4.9, liked: 124, stock: 25, image: "/images/iphone12pro.jpeg", description: "Titan korpusli premium iPhone." },
  { id: 2, name: "iPhone 15", brand: "Apple", category: "Apple", price: 9800000, oldPrice: 11000000, discount: 11, rating: 4.8, liked: 85, stock: 40, image: "/images/images.jpeg", description: "Dynamic Island bilan yangi avlod iPhone." },
  { id: 3, name: "iPhone 14 Pro Max", brand: "Apple", category: "Apple", price: 11900000, oldPrice: 14000000, discount: 15, rating: 4.8, liked: 215, stock: 12, image: "/images/images.jpeg", description: "Katta ekran va kuchli kamera." },
  { id: 4, name: "iPhone 13", brand: "Apple", category: "Apple", price: 7500000, oldPrice: 8500000, discount: 12, rating: 4.6, liked: 150, stock: 30, image: "/images/images.jpeg", description: "Eng ommabop Apple smartfoni." },
  
  { id: 5, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "Samsung", price: 14500000, oldPrice: 17000000, discount: 15, rating: 4.9, liked: 120, stock: 18, image: "/images/samsung.jpeg", description: "Galaxy AI va S Pen bilan." },
  { id: 6, name: "Samsung Galaxy S24+", brand: "Samsung", category: "Samsung", price: 11200000, oldPrice: 13000000, discount: 14, rating: 4.7, liked: 64, stock: 22, image: "/images/samsung.jpeg", description: "Premium Samsung flagmani." },
  { id: 7, name: "Samsung Galaxy A55", brand: "Samsung", category: "Samsung", price: 4600000, oldPrice: 5200000, discount: 12, rating: 4.5, liked: 189, stock: 65, image: "/images/samsung.jpeg", description: "O'rta klassdagi kuchli telefon." },
  { id: 8, name: "Samsung Z Flip5", brand: "Samsung", category: "Samsung", price: 9500000, oldPrice: 11000000, discount: 14, rating: 4.5, liked: 78, stock: 14, image: "/images/samsung.jpeg", description: "Buklama Samsung telefoni." },
  
  { id: 9, name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "Xiaomi", price: 10500000, oldPrice: 12000000, discount: 13, rating: 4.8, liked: 76, stock: 22, image: "/images/ultra.jpeg", description: "Leica kamerali Xiaomi." },
  { id: 10, name: "Redmi Note 13 Pro+", brand: "Xiaomi", category: "Xiaomi", price: 4400000, oldPrice: 5000000, discount: 12, rating: 4.5, liked: 245, stock: 80, image: "/images/note13.jpeg", description: "200MP kamerali Redmi." },
  { id: 11, name: "Poco F6 Pro", brand: "Xiaomi", category: "Xiaomi", price: 5800000, oldPrice: 6500000, discount: 11, rating: 4.7, liked: 134, stock: 35, image: "/images/pocco.jpeg", description: "Snapdragon protsessorli Poco." },
  { id: 12, name: "Redmi 13C", brand: "Xiaomi", category: "Xiaomi", price: 1600000, oldPrice: 1900000, discount: 16, rating: 4.3, liked: 412, stock: 120, image: "/images/redmic.jpeg", description: "Hamyonbop Redmi telefoni." },
  
  { id: 13, name: "Google Pixel 8 Pro", brand: "Google", category: "Google", price: 10200000, oldPrice: 12000000, discount: 15, rating: 4.8, liked: 115, stock: 14, image: "/images/google7.jpeg", description: "Toza Android tajribasi." },
  { id: 14, name: "Google Pixel 8", brand: "Google", category: "Google", price: 7800000, oldPrice: 8900000, discount: 12, rating: 4.6, liked: 88, stock: 20, image: "/images/google7.jpeg", description: "Google flagmani." },
  { id: 15, name: "Google Pixel 7a", brand: "Google", category: "Google", price: 4900000, oldPrice: 5500000, discount: 11, rating: 4.5, liked: 142, stock: 28, image: "/images/google7.jpeg", description: "Pixel kamerasi bilan." },
  { id: 16, name: "Google Pixel Fold", brand: "Google", category: "Google", price: 15500000, oldPrice: 18000000, discount: 14, rating: 4.4, liked: 31, stock: 5, image: "/images/x5.jpeg", description: "Buklama Pixel." },
  
  { id: 17, name: "OnePlus 12", brand: "OnePlus", category: "OnePlus", price: 9200000, oldPrice: 10500000, discount: 12, rating: 4.8, liked: 89, stock: 16, image: "/images/oneplus.jpeg", description: "Flagman OnePlus." },
  { id: 18, name: "OnePlus 12R", brand: "OnePlus", category: "OnePlus", price: 6200000, oldPrice: 7000000, discount: 11, rating: 4.6, liked: 73, stock: 24, image: "/images/oneplusR.jpeg", description: "Narx va sifat bo'yicha zo'r." },
  { id: 19, name: "OnePlus Nord 4", brand: "OnePlus", category: "OnePlus", price: 4500000, oldPrice: 5100000, discount: 12, rating: 4.5, liked: 52, stock: 45, image: "/images/nord4.jpeg", description: "Metall korpusli zamonaviy OnePlus." },
  { id: 20, name: "OnePlus Nord CE 4", brand: "OnePlus", category: "OnePlus", price: 3500000, oldPrice: 3900000, discount: 10, rating: 4.4, liked: 61, stock: 50, image: "/images/nord4.jpeg", description: "100W tezkor quvvatlashga ega." },
  
  { id: 21, name: "Huawei Pura 70 Ultra", brand: "Huawei", category: "Huawei", price: 13500000, oldPrice: 16000000, discount: 16, rating: 4.9, liked: 61, stock: 7, image: "/images/huavie.jpeg", description: "Professional kamerali Huawei." },
  { id: 22, name: "Huawei Mate 60 Pro", brand: "Huawei", category: "Huawei", price: 11000000, oldPrice: 12500000, discount: 12, rating: 4.7, liked: 49, stock: 10, image: "/images/mate.jpeg", description: "Kirin protsessorli flagman." },
  { id: 23, name: "Huawei Nova 12 Pro", brand: "Huawei", category: "Huawei", price: 5900000, oldPrice: 6700000, discount: 12, rating: 4.5, liked: 74, stock: 15, image: "/images/huavienna.jpeg", description: "Selfi kamerasi bilan mashhur." },
  { id: 24, name: "Huawei Mate X5", brand: "Huawei", category: "Huawei", price: 19500000, oldPrice: 22000000, discount: 11, rating: 4.6, liked: 25, stock: 4, image: "/images/x5.jpeg", description: "Buklama premium telefon." },
  
  { id: 25, name: "Realme GT 6", brand: "Realme", category: "Realme", price: 6400000, oldPrice: 7200000, discount: 11, rating: 4.6, liked: 83, stock: 33, image: "/images/gt.jpeg", description: "Kuchli Snapdragon protsessori." },
  { id: 26, name: "Realme 12 Pro Plus", brand: "Realme", category: "Realme", price: 4300000, oldPrice: 4900000, discount: 12, rating: 4.5, liked: 114, stock: 55, image: "/images/realme.jpeg", description: "Periskop kamerali model." },
  { id: 27, name: "Realme C67", brand: "Realme", category: "Realme", price: 2100000, oldPrice: 2400000, discount: 13, rating: 4.3, liked: 230, stock: 90, image: "/images/realme.jpeg", description: "108MP kamerali budjet telefon." },
  { id: 28, name: "Realme 12 5G", brand: "Realme", category: "Realme", price: 2800000, oldPrice: 3200000, discount: 13, rating: 4.4, liked: 91, stock: 42, image: "/images/realme.jpeg", description: "5G qo'llab-quvvatlovchi model." },
  
  { id: 29, name: "Oppo Find X7 Ultra", brand: "Oppo", category: "Oppo", price: 11500000, oldPrice: 13000000, discount: 12, rating: 4.8, liked: 41, stock: 9, image: "/images/x7Ultra.jpeg", description: "Premium Oppo flagmani." },
  { id: 30, name: "Oppo Reno 12 Pro", brand: "Oppo", category: "Oppo", price: 5400000, oldPrice: 6200000, discount: 13, rating: 4.5, liked: 67, stock: 38, image: "/images/opporeno.jpeg", description: "AI kamerali zamonaviy model." },
  { id: 31, name: "Oppo A78", brand: "Oppo", category: "Oppo", price: 2300000, oldPrice: 2600000, discount: 12, rating: 4.4, liked: 154, stock: 75, image: "/images/opporeno.jpeg", description: "AMOLED displeyli telefon." },
  { id: 32, name: "Oppo Find N3 Flip", brand: "Oppo", category: "Oppo", price: 9900000, oldPrice: 11500000, discount: 14, rating: 4.6, liked: 48, stock: 11, image: "/images/n3.jpeg", description: "Buklama Oppo telefoni." },
  
  { id: 33, name: "Vivo X100 Pro", brand: "Vivo", category: "Vivo", price: 10800000, oldPrice: 12500000, discount: 14, rating: 4.8, liked: 59, stock: 11, image: "/images/vivo.jpeg", description: "Zeiss kamerali Vivo." },
  { id: 34, name: "Vivo V30 Pro", brand: "Vivo", category: "Vivo", price: 5600000, oldPrice: 6300000, discount: 11, rating: 4.6, liked: 92, stock: 42, image: "/images/vivo.jpeg", description: "Aura Light chirog'iga ega portret ustasi." },
  { id: 35, name: "Vivo Y200 5G", brand: "Vivo", category: "Vivo", price: 3100000, oldPrice: 3500000, discount: 11, rating: 4.3, liked: 104, stock: 60, image: "/images/vivo.jpeg", description: "Chiroyli orqa panelli yupqa dizayn." },
  { id: 36, name: "Vivo T2x 5G", brand: "Vivo", category: "Vivo", price: 1900000, oldPrice: 2200000, discount: 14, rating: 4.2, liked: 178, stock: 88, image: "/images/t2x.jpeg", description: "Hamyonbop va tezkor 5G smartfon." }
];

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
                style={{ backgroundColor: "#f8fafc", objectFit: "contain" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = generateFallbackImage(product.name);
                }}
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