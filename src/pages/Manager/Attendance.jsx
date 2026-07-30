import { useEffect, useState } from "react";

const defaultAttendance = [
  {
    id: 1,
    name: "Nodira Tosheva",
    position: "Sotuvchi",
    initial: "N",
    present: true,
    checkIn: "08:52",
    checkOut: "18:10",
    activity: "Faol",
    tasksToday: 14,
  },
  {
    id: 2,
    name: "Rustam Qodirov",
    position: "Kassir",
    initial: "R",
    present: true,
    checkIn: "09:05",
    checkOut: "18:00",
    activity: "Faol",
    tasksToday: 21,
  },
  {
    id: 3,
    name: "Zebo Ergasheva",
    position: "Ombor xodimi",
    initial: "Z",
    present: true,
    checkIn: "08:40",
    checkOut: "—",
    activity: "Past faollik",
    tasksToday: 3,
  },
  {
    id: 4,
    name: "Aziz Nurmatov",
    position: "Yetkazib beruvchi",
    initial: "A",
    present: false,
    checkIn: "—",
    checkOut: "—",
    activity: "Kelmadi",
    tasksToday: 0,
  },
  {
    id: 5,
    name: "Sherzod Yusupov",
    position: "Menejer",
    initial: "S",
    present: true,
    checkIn: "08:30",
    checkOut: "—",
    activity: "Faol",
    tasksToday: 9,
  },
];

function Attendance() {
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem("nova_attendance_v1");
    return saved ? JSON.parse(saved) : defaultAttendance;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("nova_attendance_v1", JSON.stringify(attendance));
  }, [attendance]);

  const togglePresent = (id) => {
    setAttendance((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              present: !p.present,
              checkIn: !p.present ? new Date().toTimeString().slice(0, 5) : "—",
              activity: !p.present ? "Faol" : "Kelmadi",
            }
          : p
      )
    );
  };

  const filtered = attendance.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "present" && p.present) ||
      (filter === "absent" && !p.present);
    return matchesSearch && matchesFilter;
  });

  const presentCount = attendance.filter((p) => p.present).length;
  const absentCount = attendance.filter((p) => !p.present).length;
  const activeCount = attendance.filter((p) => p.activity === "Faol").length;

  return (
    <div className="orders-page">
      <div className="products-header">
        <div>
          <h1>Xodimlar davomati 🧑‍💼</h1>
          <p>Bugungi kelish-ketish va faollikni shu yerdan kuzating.</p>
        </div>
      </div>

      <div className="stats-grid orders-stats">
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div>
            <p>Keldi</p>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🚫</div>
          <div>
            <p>Kelmadi</p>
            <h2>{absentCount}</h2>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">🔥</div>
          <div>
            <p>Faol xodimlar</p>
            <h2>{activeCount}</h2>
          </div>
        </div>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Xodim ismi bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Barchasi</option>
          <option value="present">Keldi</option>
          <option value="absent">Kelmadi</option>
        </select>
      </div>

      <div className="orders-list">
        <div className="order-row employee-row order-row-head">
          <span>Xodim</span>
          <span>Kelgan vaqti</span>
          <span>Ketgan vaqti</span>
          <span>Vazifalar</span>
          <span>Holati</span>
          <span>Amallar</span>
        </div>

        {filtered.map((person) => (
          <div className="order-row employee-row" key={person.id}>
            <div className="order-customer">
              <div className="order-avatar">{person.initial}</div>
              <div>
                <h4>{person.name}</h4>
                <p>{person.position}</p>
              </div>
            </div>

            <div className="order-date-cell">{person.checkIn}</div>
            <div className="order-date-cell">{person.checkOut}</div>
            <div className="order-date-cell">{person.tasksToday} ta</div>

            <div>
              <span
                className={`status-badge ${
                  person.present
                    ? person.activity === "Faol"
                      ? "satisfaction-happy"
                      : "satisfaction-neutral"
                    : "satisfaction-sad"
                }`}
              >
                {person.present ? `● ${person.activity}` : "✕ Kelmadi"}
              </span>
            </div>

            <div className="order-actions-cell">
              <button
                className={person.present ? "delete-button" : "edit-button"}
                onClick={() => togglePresent(person.id)}
              >
                {person.present ? "Kelmadi deb belgilash" : "Keldi deb belgilash"}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-products">
            <h2>😔 Xodim topilmadi</h2>
            <p>Qidiruv yoki filterni o'zgartirib ko'ring.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;