import { useEffect, useState } from "react";

const TABS = [
  { id: "profile", label: "Profil", icon: "👤" },
  { id: "store", label: "Do'kon", icon: "🏬" },
  { id: "security", label: "Xavfsizlik", icon: "🔒" },
  { id: "notifications", label: "Bildirishnomalar", icon: "🔔" },
  { id: "appearance", label: "Ko'rinish", icon: "🎨" },
];

const defaultSettings = {
  profile: {
    name: "Bobomurod Egamberdiyev",
    email: "bobomurod@novaphone.uz",
    phone: "+998 90 000 00 00",
    position: "Bosh administrator",
  },
  store: {
    storeName: "NOVA-PHONE",
    address: "Andijon viloyati, Asaka tumani",
    phone: "+998 71 200 00 00",
    workingHours: "09:00 - 20:00",
    currency: "UZS",
  },
  security: {
    twoFactor: true,
    loginAlerts: true,
  },
  notifications: {
    newOrder: true,
    lowStock: true,
    newUser: false,
    emailReports: true,
    smsAlerts: false,
  },
  appearance: {
    accent: "#6366f1",
    compactMode: false,
  },
};

const ACCENT_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Binafsha", value: "#8b5cf6" },
  { name: "Pushti", value: "#ec4899" },
  { name: "Ko'k", value: "#0ea5e9" },
  { name: "Yashil", value: "#22c55e" },
  { name: "Zarg'aldoq", value: "#f97316" },
];

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? "toggle-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob"></span>
    </button>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("nova_settings_v1");
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    localStorage.setItem("nova_settings_v1", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    try {
      const accent = settings?.appearance?.accent;
      if (accent) document.documentElement.style.setProperty("--accent", accent);
    } catch {}
  }, [settings?.appearance?.accent]);

  const updateField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="settings-page">
      <div className="products-header">
        <div>
          <h1>Sozlamalar ⚙️</h1>
          <p>Tizim, do'kon va profil sozlamalarini shu yerdan boshqaring.</p>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          <form onSubmit={handleSave}>
            {activeTab === "profile" && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-avatar">👤</div>
                  <div>
                    <h3>{settings.profile.name}</h3>
                    <p>{settings.profile.position}</p>
                  </div>
                </div>

                <div className="settings-grid">
                  <div className="settings-field">
                    <label>To'liq ism</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateField("profile", "name", e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Lavozim</label>
                    <input
                      type="text"
                      value={settings.profile.position}
                      onChange={(e) => updateField("profile", "position", e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateField("profile", "email", e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Telefon</label>
                    <input
                      type="text"
                      value={settings.profile.phone}
                      onChange={(e) => updateField("profile", "phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "store" && (
              <div className="settings-card">
                <h3 className="settings-card-title">🏬 Do'kon ma'lumotlari</h3>

                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Do'kon nomi</label>
                    <input
                      type="text"
                      value={settings.store.storeName}
                      onChange={(e) => updateField("store", "storeName", e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Ish vaqti</label>
                    <input
                      type="text"
                      value={settings.store.workingHours}
                      onChange={(e) => updateField("store", "workingHours", e.target.value)}
                    />
                  </div>

                  <div className="settings-field settings-field-wide">
                    <label>Manzil</label>
                    <input
                      type="text"
                      value={settings.store.address}
                      onChange={(e) => updateField("store", "address", e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Aloqa telefoni</label>
                    <input
                      type="text"
                      value={settings.store.phone}
                      onChange={(e) => updateField("store", "phone", e.target.value)}
                    />
                  </div>

                  <div className="settings-field">
                    <label>Valyuta</label>
                    <select
                      value={settings.store.currency}
                      onChange={(e) => updateField("store", "currency", e.target.value)}
                    >
                      <option value="UZS">UZS — O'zbek so'mi</option>
                      <option value="USD">USD — AQSH dollari</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-card">
                <h3 className="settings-card-title">🔒 Xavfsizlik</h3>

                <div className="settings-grid">
                  <div className="settings-field">
                    <label>Joriy parol</label>
                    <input type="password" placeholder="••••••••" />
                  </div>

                  <div className="settings-field">
                    <label>Yangi parol</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Ikki bosqichli autentifikatsiya</h4>
                    <p>Kirishda qo'shimcha SMS-kod talab qilinadi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.security.twoFactor}
                    onChange={(val) => updateField("security", "twoFactor", val)}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Kirish haqida ogohlantirish</h4>
                    <p>Yangi qurilmadan kirilganda xabar yuboriladi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.security.loginAlerts}
                    onChange={(val) => updateField("security", "loginAlerts", val)}
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-card">
                <h3 className="settings-card-title">🔔 Bildirishnomalar</h3>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Yangi buyurtma</h4>
                    <p>Yangi buyurtma tushganda bildirishnoma yuboriladi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications.newOrder}
                    onChange={(val) => updateField("notifications", "newOrder", val)}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Mahsulot kam qolganda</h4>
                    <p>Omborda mahsulot tugab qolganda ogohlantiradi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications.lowStock}
                    onChange={(val) => updateField("notifications", "lowStock", val)}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Yangi foydalanuvchi</h4>
                    <p>Yangi ro'yxatdan o'tganlar haqida xabar beradi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications.newUser}
                    onChange={(val) => updateField("notifications", "newUser", val)}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Email hisobotlar</h4>
                    <p>Haftalik statistika emailga yuboriladi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications.emailReports}
                    onChange={(val) => updateField("notifications", "emailReports", val)}
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>SMS ogohlantirishlar</h4>
                    <p>Muhim voqealar bo'yicha SMS yuboriladi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications.smsAlerts}
                    onChange={(val) => updateField("notifications", "smsAlerts", val)}
                  />
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="settings-card">
                <h3 className="settings-card-title">🎨 Ko'rinish</h3>

                <div className="settings-field settings-field-wide">
                  <label>Asosiy rang</label>
                  <div className="accent-color-list">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`accent-swatch ${
                          settings.appearance.accent === color.value ? "selected" : ""
                        }`}
                        style={{ background: color.value }}
                        title={color.name}
                        onClick={() => updateField("appearance", "accent", color.value)}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <h4>Ixcham rejim</h4>
                    <p>Panellar va bo'shliqlar zichroq ko'rsatiladi.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings.appearance.compactMode}
                    onChange={(val) => updateField("appearance", "compactMode", val)}
                  />
                </div>
              </div>
            )}

            <div className="settings-save-row">
              <button type="submit" className="settings-save-button">
                💾 Saqlash
              </button>
              {savedMessage && <span className="settings-saved-msg">✅ Saqlandi!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;