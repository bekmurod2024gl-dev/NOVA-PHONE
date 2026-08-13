import { useEffect, useState } from "react";
import { useLocale } from "../../context/LocaleContext";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "Huawei", "Realme", "Oppo", "Vivo"];

// Backend ishlamasa ham rasmlar chiqishi uchun mahsulotlar bazasi
const HARDCODED_PRODUCTS = [
  {"name":"iPhone 15 Pro","brand":"Apple","price":12500000.0,"image":"/images/iphone15pro.jpeg","description":"Titan korpusli premium iPhone.","id":1},
  {"name":"iPhone 15","brand":"Apple","price":9800000.0,"image":"/images/15.jpeg","description":"Dynamic Island bilan yangi avlod iPhone.","id":2},
  {"name":"iPhone 14 Pro Max","brand":"Apple","price":11900000.0,"image":"/images/14promax.jpeg","description":"Katta ekran va kuchli kamera.","id":3},
  {"name":"iPhone 13","brand":"Apple","price":7500000.0,"image":"/images/13.jpeg","description":"Eng ommabop Apple smartfoni.","id":4},
  {"name":"Samsung Galaxy S24 Ultra","brand":"Samsung","price":14500000.0,"image":"/images/samsung.jpeg","description":"Galaxy AI va S Pen bilan.","id":5},
  {"name":"Samsung Galaxy S24+","brand":"Samsung","price":11200000.0,"image":"/images/24+.jpeg","description":"Premium Samsung flagmani.","id":6},
  {"name":"Samsung Galaxy A55","brand":"Samsung","price":4600000.0,"image":"/images/a55.jpeg","description":"O'rta klassdagi kuchli telefon.","id":7},
  {"name":"Samsung Z Flip5","brand":"Samsung","price":9500000.0,"image":"/images/flip.jpeg","description":"Buklama Samsung telefoni.","id":8},
  {"name":"Xiaomi 14 Ultra","brand":"Xiaomi","price":10500000.0,"image":"/images/ultra.jpeg","description":"Leica kamerali Xiaomi.","id":9},
  {"name":"Redmi Note 13 Pro+","brand":"Xiaomi","price":4400000.0,"image":"/images/note13.jpeg","description":"200MP kamerali Redmi.","id":10},
  {"name":"Poco F6 Pro","brand":"Xiaomi","price":5800000.0,"image":"/images/pocco.jpeg","description":"Snapdragon protsessorli Poco.","id":11},
  {"name":"Redmi 13C","brand":"Xiaomi","price":1600000.0,"image":"/images/redmic.jpeg","description":"Hamyonbop Redmi telefoni.","id":12},
  {"name":"Google Pixel 8 Pro","brand":"Google","price":10200000.0,"image":"/images/google7.jpeg","description":"Toza Android tajribasi.","id":13},
  {"name":"Google Pixel 8","brand":"Google","price":7800000.0,"image":"/images/google.jpeg","description":"Google flagmani.","id":14},
  {"name":"Google Pixel 7a","brand":"Google","price":4900000.0,"image":"/images/google7.jpeg","description":"Pixel kamerasi bilan.","id":15},
  {"name":"Google Pixel Fold","brand":"Google","price":15500000.0,"image":"/images/fold.jpeg","description":"Buklama Pixel.","id":16},
  {"name":"OnePlus 12","brand":"OnePlus","price":9200000.0,"image":"/images/oneplus.jpeg","description":"Flagman OnePlus.","id":17},
  {"name":"OnePlus 12R","brand":"OnePlus","price":6200000.0,"image":"/images/oneplusR.jpeg","description":"Narx va sifat bo'yicha zo'r.","id":18},
  {"name":"OnePlus Nord 4","brand":"OnePlus","price":4500000.0,"image":"/images/nord4.jpeg","description":"Metall korpusli zamonaviy OnePlus.","id":19},
  {"name":"OnePlus Nord CE 4","brand":"OnePlus","price":3500000.0,"image":"/images/CE.jpeg","description":"100W tezkor quvvatlashga ega.","id":20},
  {"name":"Huawei Pura 70 Ultra","brand":"Huawei","price":13500000.0,"image":"/images/huavie.jpeg","description":"Professional kamerali Huawei.","id":21},
  {"name":"Huawei Mate 60 Pro","brand":"Huawei","price":11000000.0,"image":"/images/mate.jpeg","description":"Kirin protsessorli flagman.","id":22},
  {"name":"Huawei Nova 12 Pro","brand":"Huawei","price":5900000.0,"image":"/images/huavienna.jpeg","description":"Selfi kamerasi bilan mashhur.","id":23},
  {"name":"Huawei Mate X5","brand":"Huawei","price":19500000.0,"image":"/images/x5.jpeg","description":"Buklama premium telefon.","id":24},
  {"name":"Realme GT 6","brand":"Realme","price":6400000.0,"image":"/images/gt.jpeg","description":"Kuchli Snapdragon protsessori.","id":25},
  {"name":"Realme 12 Pro Plus","brand":"Realme","price":4300000.0,"image":"/images/realme.jpeg","description":"Periskop kamerali model.","id":26},
  {"name":"Realme C67","brand":"Realme","price":2100000.0,"image":"/images/c67.jpeg","description":"108MP kamerali budjet telefon.","id":27},
  {"name":"Realme 12 5G","brand":"Realme","price":2800000.0,"image":"/images/5g.jpeg","description":"5G qo'llab-quvvatlovchi model.","id":28},
  {"name":"Oppo Find X7 Ultra","brand":"Oppo","price":11500000.0,"image":"/images/x7Ultra.jpeg","description":"Premium Oppo flagmani.","id":29},
  {"name":"Oppo Reno 12 Pro","brand":"Oppo","price":5400000.0,"image":"/images/30pro.jpeg","description":"AI kamerali zamonaviy model.","id":30},
  {"name":"Oppo A78","brand":"Oppo","price":2300000.0,"image":"/images/a78.jpeg","description":"AMOLED displeyli telefon.","id":31},
  {"name":"Oppo Find N3 Flip","brand":"Oppo","price":9900000.0,"image":"/images/n3.jpeg","description":"Buklama Oppo telefoni.","id":32},
  {"name":"Vivo X100 Pro","brand":"Vivo","price":10800000.0,"image":"/images/vivo.jpeg","description":"Zeiss kamerali Vivo.","id":33},
  {"name":"Vivo V30 Pro","brand":"Vivo","price":5600000.0,"image":"/images/30pro.jpeg","description":"Aura Light chirog'iga ega portret ustasi.","id":34},
  {"name":"Vivo Y200 5G","brand":"Vivo","price":3100000.0,"image":"/images/5g.jpeg","description":"Chiroyli orqa panelli yupqa dizayn.","id":35},
  {"name":"Vivo T2x 5G","brand":"Vivo","price":1900000.0,"image":"/images/t2x.jpeg","description":"Hamyonbop va tezkor 5G smartfon.","id":36}
];

function getDeliveryDate() {
  const days = 3 + Math.floor(Math.random() * 5);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function Products() {
  // Backendni kutish o'rniga to'g'ridan-to'g'ri massivni beramiz
  const [catalog] = useState(HARDCODED_PRODUCTS);

  const [liked, setLiked] = useState(() => {
    try {
      const saved = localStorage.getItem("nova_user_liked_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem("nova_user_purchases_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
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

  const { t, lang, setLang } = useLocale();

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price);

  const normalize = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9+]+/g, "")
      .replace(/\+/g, "plus");

  const languages = [
    { value: "uz", label: "UZ" },
    { value: "ru", label: "RU" },
    { value: "en", label: "EN" },
  ];

  const handleImgError = (e, product) => {
    try {
      const img = e.currentTarget;
      const attempts = parseInt(img.dataset.attempts || "0", 10);
      if (attempts === 0) {
        const slug = normalize(product.name);
        img.dataset.attempts = "1";
        img.src = `/images/${slug}.jpeg`;
        return;
      }
    } catch {}
    // final fallback
    e.currentTarget.src = "/images/images.jpeg";
  };

  const toggleLike = (id) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleBuy = (product) => {
    const newPurchase = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      image: product.image, // API_URL olib tashlandi
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

  const orderedProducts = [...filtered].sort((a, b) =>
    a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );

  return (
    <div className="shop-page">
      <div className="products-header">
        <div>
          <h1>{t("products_title")}</h1>
          <p>
            {t("products_sub")} Jami: {catalog.length} ta
          </p>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder={t("search_placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="all">{t("all_brands")}</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select className="products-lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
          {languages.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading va Error olib tashlandi, chunki mahsulotlar birdaniga keladi */}

      <div className="products-grid">
        {orderedProducts.map((product) => {
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
                  onError={(e) => handleImgError(e, product)}
                  data-attempts={0}
                  style={{ backgroundColor: "#f8fafc", objectFit: "contain" }}
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
                  {justBought === product.id ? t("added") : t("buy")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="no-products">
          <h2>{t("no_products")}</h2>
          <p>Boshqa nom yoki brend bilan qidirib ko'ring.</p>
        </div>
      )}
    </div>
  );
}

export default Products;