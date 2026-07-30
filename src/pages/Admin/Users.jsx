import { useEffect, useState } from "react";

const ROLES = ["User", "Manager", "Admin"];

const defaultUsers = [
  {
    id: 1,
    name: "Ali Valiyev",
    email: "ali.valiyev@gmail.com",
    phone: "+998 90 123 45 67",
    role: "User",
    status: "Faol",
    joined: "2026-05-12",
  },
  {
    id: 2,
    name: "Jasur Karimov",
    email: "jasur.karimov@gmail.com",
    phone: "+998 91 234 56 78",
    role: "Manager",
    status: "Faol",
    joined: "2026-04-03",
  },
  {
    id: 3,
    name: "Madina Sobirova",
    email: "madina.sobirova@gmail.com",
    phone: "+998 93 345 67 89",
    role: "User",
    status: "Faol",
    joined: "2026-06-18",
  },
  {
    id: 4,
    name: "Sardor Akmalov",
    email: "sardor.akmalov@gmail.com",
    phone: "+998 94 456 78 90",
    role: "User",
    status: "Bloklangan",
    joined: "2026-03-22",
  },
  {
    id: 5,
    name: "Dilnoza Karimova",
    email: "dilnoza.karimova@gmail.com",
    phone: "+998 95 567 89 01",
    role: "User",
    status: "Faol",
    joined: "2026-07-01",
  },
  {
    id: 6,
    name: "Bobomurod Egamberdiyev",
    email: "bobomurod@novaphone.uz",
    phone: "+998 90 000 00 00",
    role: "Admin",
    status: "Faol",
    joined: "2026-01-10",
  },
];

function Users() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("nova_users_v1");
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("nova_users_v1", JSON.stringify(users));
  }, [users]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Faol" ? "Bloklangan" : "Faol" }
          : user
      )
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu foydalanuvchini o'chirmoqchimisiz?")) return;
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.phone.includes(searchText);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Faol").length;
  const blockedUsers = users.filter((u) => u.status === "Bloklangan").length;
  const adminCount = users.filter((u) => u.role === "Admin").length;

  return (
    <div className="users-page">
      <div className="products-header">
        <div>
          <h1>Foydalanuvchilar 👥</h1>
          <p>Tizimdagi barcha foydalanuvchilarni shu yerda boshqarasiz.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <div>
            <p>Jami foydalanuvchilar</p>
            <h2>{totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div>
            <p>Faol</p>
            <h2>{activeUsers}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🚫</div>
          <div>
            <p>Bloklangan</p>
            <h2>{blockedUsers}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">👑</div>
          <div>
            <p>Adminlar</p>
            <h2>{adminCount}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Ism, email yoki telefon bo'yicha qidirish..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option value="all">Barcha rollar</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row user-row order-row-head">
          <span>Foydalanuvchi</span>
          <span>Telefon</span>
          <span>Qo'shilgan sana</span>
          <span>Rol</span>
          <span>Holati</span>
          <span>Amallar</span>
        </div>

        {filteredUsers.map((user) => (
          <div className="order-row user-row" key={user.id}>
            <div className="order-customer">
              <div className="order-avatar">👤</div>
              <div>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="order-date-cell">{user.phone}</div>

            <div className="order-date-cell">{formatDate(user.joined)}</div>

            <div className="order-status-cell">
              <select
                className="status-select"
                value={user.role}
                onChange={(event) => handleRoleChange(user.id, event.target.value)}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="order-status-cell">
              <span
                className={`status-badge ${
                  user.status === "Faol" ? "satisfaction-happy" : "satisfaction-sad"
                }`}
              >
                {user.status === "Faol" ? "✅ Faol" : "🚫 Bloklangan"}
              </span>
            </div>

            <div className="order-actions-cell user-actions-cell">
              <button
                className={user.status === "Faol" ? "delete-button" : "edit-button"}
                onClick={() => toggleStatus(user.id)}
              >
                {user.status === "Faol" ? "🚫 Blok" : "✅ Aktiv qilish"}
              </button>
              <button className="delete-button" onClick={() => handleDelete(user.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="no-products">
            <h2>😔 Foydalanuvchi topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;