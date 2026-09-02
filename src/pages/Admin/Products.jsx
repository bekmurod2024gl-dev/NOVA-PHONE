import { useEffect, useState } from "react";

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  if (hostname === "localhost" || hostname === "127.0.0.1") return "/api";

  return "";
};

const API_URL = resolveApiBaseUrl();
const EMPTY_FORM = { name: "", brand: "", category: "Smartphone", price: "", stock: "", image: "/images/images.jpeg", description: "" };

async function safeJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Backend API javobini o'qib bo'lmadi. Backend URL yoki server konfiguratsiyasi noto'g'ri.");
  }
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    try {
      if (!API_URL) {
        throw new Error("Backend URL sozlanmagan. VITE_API_URL ni to'g'ri backend manzilga o'rnating.");
      }

      const response = await fetch(`${API_URL}/products/`);
      if (!response.ok) {
        const detail = await safeJsonResponse(response).catch(() => null);
        throw new Error(detail?.detail || detail?.message || "Mahsulotlarni yuklab bo'lmadi");
      }

      const payload = await safeJsonResponse(response);
      setProducts(Array.isArray(payload) ? payload : []);
      setError("");
    } catch (loadError) {
      setError(`${loadError.message}. Backend serverni ishga tushiring.`);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadProducts(); }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({ name: product.name || "", brand: product.brand || "", category: product.category || "Smartphone", price: product.price ?? "", stock: product.stock ?? "", image: product.image || "/images/images.jpeg", description: product.description || "" });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (!API_URL) {
        throw new Error("Backend URL sozlanmagan. VITE_API_URL ni to'g'ri backend manzilga o'rnating.");
      }

      const response = await fetch(`${API_URL}/products${editingId ? `/${editingId}` : "/"}`, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const detail = await safeJsonResponse(response).catch(() => null);
        throw new Error(detail?.detail || detail?.message || "Saqlashda xatolik yuz berdi");
      }

      await loadProducts();
      setMessage(editingId ? "Mahsulot yangilandi" : "Mahsulot qo'shildi");
      resetForm();
    } catch (saveError) {
      setError(`${saveError.message}. Backend serverni tekshiring.`);
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(product) {
    if (!window.confirm(`"${product.name}" mahsulotini o'chirmoqchimisiz?`)) return;
    try {
      if (!API_URL) {
        throw new Error("Backend URL sozlanmagan. VITE_API_URL ni to'g'ri backend manzilga o'rnating.");
      }

      const response = await fetch(`${API_URL}/products/${product.id}`, { method: "DELETE" });
      if (!response.ok) {
        const detail = await safeJsonResponse(response).catch(() => null);
        throw new Error(detail?.detail || detail?.message || "Mahsulotni o'chirib bo'lmadi");
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
      if (editingId === product.id) resetForm();
      setMessage("Mahsulot o'chirildi");
    } catch (removeError) {
      setError(`${removeError.message}. Backend serverni tekshiring.`);
    }
  }

  const visibleProducts = products.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="admin-products-page">
      <div className="products-header"><div><h1>Mahsulotlar</h1><p>Mahsulotlarni qo'shing, tahrirlang yoki o'chiring.</p></div><strong className="admin-products-count">Jami: {products.length} ta</strong></div>
      <form className="admin-product-form" onSubmit={saveProduct}>
        <div className="admin-form-heading"><h2>{editingId ? "Mahsulotni yangilash" : "Yangi mahsulot qo'shish"}</h2>{editingId && <button type="button" className="secondary-button" onClick={resetForm}>Bekor qilish</button>}</div>
        <div className="admin-form-grid">
          <input name="name" value={form.name} onChange={updateField} placeholder="Mahsulot nomi" required />
          <input name="brand" value={form.brand} onChange={updateField} placeholder="Brend" required />
          <input name="category" value={form.category} onChange={updateField} placeholder="Kategoriya" required />
          <input name="price" type="number" min="0" value={form.price} onChange={updateField} placeholder="Narxi" required />
          <input name="stock" type="number" min="0" value={form.stock} onChange={updateField} placeholder="Ombordagi soni" required />
          <input name="image" value={form.image} onChange={updateField} placeholder="Rasm manzili" required />
          <textarea name="description" value={form.description} onChange={updateField} placeholder="Tavsif" required />
        </div>
        <button className="admin-save-button" type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : editingId ? "Yangilash" : "Qo'shish"}</button>
      </form>
      {message && <p className="admin-success-message">{message}</p>}
      {error && <p className="admin-error-message">{error}</p>}
      <div className="admin-products-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mahsulot qidirish..." /><button type="button" className="secondary-button" onClick={loadProducts}>Yangilash</button></div>
      <div className="admin-products-table-wrap">
        {loading ? <p className="admin-products-empty">Yuklanmoqda...</p> : visibleProducts.length === 0 ? <p className="admin-products-empty">Mahsulot topilmadi.</p> : <div className="products-grid admin-products-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
          <div className="product-image"><img src={product.image || "/images/images.jpeg"} alt={product.name} onError={(event) => { event.currentTarget.src = "/images/images.jpeg"; }} /></div>
          <div className="product-info">
            <div className="product-brand">{product.brand}</div>
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <div className="price-row"><h3>{new Intl.NumberFormat("uz-UZ").format(product.price)} so'm</h3><span>Ombor: {product.stock} ta</span></div>
            <div className="admin-product-actions"><button className="edit-button" type="button" onClick={() => startEdit(product)}>Tahrirlash</button><button className="delete-button" type="button" onClick={() => removeProduct(product)}>O'chirish</button></div>
          </div>
        </article>)}</div>}
      </div>
    </section>
  );
}

export default AdminProducts;
