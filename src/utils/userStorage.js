export const ACCOUNTS_KEY = "nova_accounts_v1";
export const SESSION_KEY = "nova_session_user";
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000;

export function safeParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function normalizePhone(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("998")) {
    return "+998 " + digits.slice(3, 5) + " " + digits.slice(5, 8) + " " + digits.slice(8, 10) + " " + digits.slice(10, 12);
  }
  return "+998 " + digits.slice(0, 2) + " " + digits.slice(2, 5) + " " + digits.slice(5, 7) + " " + digits.slice(7, 9);
}

export function getUserDisplayName(user = {}) {
  if (!user) return "Foydalanuvchi";
  if (user.role === "admin") {
    const profile = getAdminProfile();
    return profile.name || "Bobomurod jumaboyev";
  }
  if (user.role === "user" && user.username?.trim()) {
    return user.username.trim();
  }

  const raw = user.displayName || user.name;
  if (raw && typeof raw === "string") {
    let words = raw.trim().split(/\s+/);
    const username = (user.username || "").trim().toLowerCase();
    if (
      username &&
      words.length > 2 &&
      words[words.length - 1].toLowerCase() === username &&
      words.slice(0, -1).some((word) => word.toLowerCase() === username)
    ) {
      words = words.slice(0, -1);
    }
    const normalizedRaw = words.join(" ");
    if (words.length === 2 && words[0].toLowerCase() === words[1].toLowerCase()) {
      return words[0];
    }
    if (words.length > 0 && !["men1 men1", "Foydalanuvu"].includes(normalizedRaw)) {
      return normalizedRaw;
    }
  }

  const fn = (user.firstName || "").trim();
  const sn = (user.surname || "").trim();
  if (fn && sn) {
    if (fn.toLowerCase() === sn.toLowerCase()) return fn;
    return `${fn} ${sn}`;
  }
  if (fn) return fn;
  if (sn) return sn;
  return user.username || "Foydalanuvchi";
}

export function getAdminProfile() {
  const settings = safeParse(localStorage.getItem("nova_settings_v1"), null);
  const profile = settings?.profile;
  const isOldDefault = profile?.name === "Bobomurod Egamberdiyev";
  const name = profile?.name && !isOldDefault ? profile.name : "Bobomurod jumaboyev";
  const email = profile?.email && !isOldDefault && !profile.email.includes("novaphone.uz") ? profile.email : "bekmurod2024gl@gmail.com";
  const phone = profile?.phone && !isOldDefault && profile.phone !== "+998 90 000 00 00" ? profile.phone : "+998 33 045 86 85";
  const position = profile?.position || "Bosh administrator";
  return { name, email, phone, position };
}

export function getAccounts() {
  return safeParse(localStorage.getItem(ACCOUNTS_KEY), []);
}

export function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function findAccount({ username, email }) {
  const trimmedUsername = (username || "").trim().toLowerCase();
  const trimmedEmail = (email || "").trim().toLowerCase();
  return getAccounts().find((account) => {
    return (trimmedUsername && account.username.toLowerCase() === trimmedUsername) ||
      (trimmedEmail && account.email.toLowerCase() === trimmedEmail);
  });
}

export function getSessionUser() {
  const sessionUser = safeParse(localStorage.getItem(SESSION_KEY), null);
  const storedRole = localStorage.getItem("nova_role");
  const validRoles = ["admin", "manager", "user"];

  if (!sessionUser?.id || !validRoles.includes(sessionUser.role) || !sessionUser.issuedAt || storedRole !== sessionUser.role) {
    if (sessionUser || storedRole) clearSessionUser();
    return null;
  }

  if (Date.now() - sessionUser.issuedAt > SESSION_MAX_AGE) {
    clearSessionUser();
    return null;
  }

  if (sessionUser.role === "admin") {
    const profile = getAdminProfile();
    sessionUser.displayName = profile.name;
    sessionUser.name = profile.name;
    sessionUser.position = profile.position;
    sessionUser.email = profile.email;
    sessionUser.phone = profile.phone;
  } else if (sessionUser.role === "user" && sessionUser.username) {
    sessionUser.displayName = sessionUser.username;
    sessionUser.name = sessionUser.username;
  }

  return sessionUser;
}

export function getCurrentRole() {
  const sessionUser = getSessionUser();
  return sessionUser?.role || null;
}

export function setSessionUser(user) {
  const displayName = getUserDisplayName(user);
  const sessionUser = {
    ...user,
    displayName,
    issuedAt: Date.now(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  localStorage.setItem("nova_role", user?.role || "user");
  localStorage.setItem("nova_display_name", displayName || "Foydalanuvchi");
  if (user?.position) {
    localStorage.setItem("nova_position", user.position);
  }
  window.dispatchEvent(new Event("nova_profile_updated"));
  window.dispatchEvent(new Event("storage"));
}

export function clearSessionUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("nova_role");
  localStorage.removeItem("nova_display_name");
  localStorage.removeItem("nova_position");
}

export function getScopedStorageKey(prefix) {
  const currentUser = getSessionUser();
  if (!currentUser?.id) return prefix;
  return `${prefix}_${currentUser.id}`;
}

export function readScopedState(prefix, fallback) {
  const key = getScopedStorageKey(prefix);
  return safeParse(localStorage.getItem(key), fallback);
}

export function writeScopedState(prefix, value) {
  const key = getScopedStorageKey(prefix);
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSalesRecords() {
  const records = safeParse(localStorage.getItem("nova_sales_records_v1"), []);
  return Array.isArray(records) ? records : [];
}

export function getCompletedSalesRecords(records = getSalesRecords()) {
  return records.filter((record) => record && (!record.status || record.status === "Yetkazildi"));
}

export function setSalesRecords(records) {
  localStorage.setItem("nova_sales_records_v1", JSON.stringify(records));
  window.dispatchEvent(new Event("nova_sales_updated"));
}

export function updateSalesRecordStatus(id, status) {
  const updateStatus = (records) => Array.isArray(records)
    ? records.map((record) => String(record.id) === String(id) ? { ...record, status } : record)
    : [];

  ["nova_orders_v1", "nova_sales_v1"].forEach((key) => {
    const saved = safeParse(localStorage.getItem(key), []);
    localStorage.setItem(key, JSON.stringify(updateStatus(saved)));
  });
  setSalesRecords(updateStatus(getSalesRecords()));
}

export function deleteSalesRecord(id) {
  ["nova_orders_v1", "nova_sales_v1"].forEach((key) => {
    const saved = safeParse(localStorage.getItem(key), []);
    if (Array.isArray(saved)) {
      localStorage.setItem(key, JSON.stringify(saved.filter((record) => String(record.id) !== String(id))));
    }
  });
  setSalesRecords(getSalesRecords().filter((record) => String(record.id) !== String(id)));
}

export const JOB_APPLICATIONS_KEY = "nova_job_applications_v1";

export const FAKE_NAMES = [
  "Ali Valiyev",
  "Jasur Karimov",
  "Madina Sobirova",
  "Sardor Akmalov",
  "Dilnoza Karimova",
  "Otabek Rustamov",
  "Sherzod Yusupov",
  "Nodira Tosheva",
  "Rustam Qodirov",
  "Zebo Ergasheva",
  "Aziz Nurmatov",
];

export function isFakePerson(name = "") {
  const lower = String(name).trim().toLowerCase();
  return FAKE_NAMES.some((fake) => lower === fake.toLowerCase());
}

export function getJobApplications() {
  return safeParse(localStorage.getItem(JOB_APPLICATIONS_KEY), []);
}

export function saveJobApplications(apps) {
  localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(apps));
  window.dispatchEvent(new Event("nova_applications_updated"));
}

export function submitJobApplication({ applicantId, name, phone, email, position, experience, message }) {
  const apps = getJobApplications();
  const currentUser = getSessionUser();
  const newApp = {
    id: "app-" + Date.now(),
    applicantId: applicantId || currentUser?.id || "guest",
    name: name || getUserDisplayName(currentUser),
    phone: normalizePhone(phone || currentUser?.phone || "+998 90 000 00 00"),
    email: email || currentUser?.email || "",
    position: position || "Sotuvchi",
    experience: experience || "Yangi boshlovchi",
    message: message || "NOVA-PHONE jamoasida ishlash istagidaman.",
    status: "Kutilmoqda",
    appliedAt: new Date().toISOString().slice(0, 10),
  };
  saveJobApplications([newApp, ...apps]);
  return newApp;
}

export function approveJobApplication(appId, salary = 5000000) {
  const apps = getJobApplications();
  const app = apps.find((a) => a.id === appId);
  if (!app) return null;

  const updatedApps = apps.map((a) => (a.id === appId ? { ...a, status: "Qabul qilindi" } : a));
  saveJobApplications(updatedApps);

  const accounts = getAccounts();
  const targetAccount = accounts.find(
    (acc) => acc.id === app.applicantId || (app.email && acc.email?.toLowerCase() === app.email?.toLowerCase())
  );

  if (targetAccount) {
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === targetAccount.id) {
        return {
          ...acc,
          isEmployee: true,
          position: app.position,
          salary: Number(salary),
          hired: new Date().toISOString().slice(0, 10),
          status: "Ishlamoqda",
        };
      }
      return acc;
    });
    saveAccounts(updatedAccounts);

    const currentUser = getSessionUser();
    if (currentUser && currentUser.id === targetAccount.id) {
      setSessionUser({
        ...currentUser,
        isEmployee: true,
        position: app.position,
      });
    }
  }
  window.dispatchEvent(new Event("nova_employees_updated"));
  return app;
}

export function rejectJobApplication(appId) {
  const apps = getJobApplications();
  const updatedApps = apps.map((a) => (a.id === appId ? { ...a, status: "Rad etildi" } : a));
  saveJobApplications(updatedApps);
  return appId;
}

export function hireUserAsEmployee({ accountId, position = "Sotuvchi", salary = 5000000 }) {
  const accounts = getAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === accountId) {
      return {
        ...acc,
        isEmployee: true,
        position,
        salary: Number(salary),
        hired: new Date().toISOString().slice(0, 10),
        status: "Ishlamoqda",
      };
    }
    return acc;
  });
  saveAccounts(updated);
  window.dispatchEvent(new Event("nova_employees_updated"));
}

export function recordUserPurchase({ buyer, product, price, status = "Yetkazildi", comment = "", sourceId }) {
  const currentBuyer = buyer || getSessionUser();
  const productName = product?.name || product || "Mahsulot";
  const totalPrice = Number(price || product?.price || 0);
  const nextRecord = {
    id: sourceId || Date.now(),
    customer: getUserDisplayName(currentBuyer),
    phone: normalizePhone(currentBuyer?.phone || currentBuyer?.phoneNumber || "+998 90 000 00 00"),
    product: productName,
    price: totalPrice,
    date: new Date().toISOString().slice(0, 10),
    status,
    satisfaction: "Mamnun",
    rating: 5,
    comment: comment || "Mijoz buyurtma qildi.",
    customerId: currentBuyer?.id || null,
  };

  const records = getSalesRecords();
  const merged = records.some((record) => record.id === nextRecord.id)
    ? records.map((record) => (record.id === nextRecord.id ? { ...record, ...nextRecord } : record))
    : [nextRecord, ...records];

  setSalesRecords(merged);
  return nextRecord;
}

export function updateSalesReview({ purchaseId, rating, satisfaction }) {
  const records = getSalesRecords();
  const updated = records.map((record) => (
    record.id === purchaseId
      ? {
          ...record,
          rating: Number(rating || 0),
          satisfaction: satisfaction || record.satisfaction || "Mamnun",
        }
      : record
  ));
  setSalesRecords(updated);
  return updated;
}

export function registerAccount({ username, password, email = "", surname = "", phone = "" }) {
  const trimmedUsername = (username || "").trim();
  const cleanPassword = (password || "").trim();

  const reservedNames = ["admin", "manager", "bobomurod"];

  if (reservedNames.includes(trimmedUsername.toLowerCase())) {
    throw new Error("Bu username rezerv qilingan. Boshqa username tanlang!");
  }

  if (!trimmedUsername) {
    throw new Error("Username kiriting!");
  }

  if (!cleanPassword) {
    throw new Error("Parol kiriting!");
  }

  if (cleanPassword.length < 4) {
    throw new Error("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
  }

  const accounts = getAccounts();
  const alreadyExists = accounts.some(
    (account) => account.username.toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (alreadyExists) {
    throw new Error("Bu username allaqachon mavjud! Boshqa nom tanlang.");
  }

  const trimmedEmail = (email || "").trim().toLowerCase();
  const trimmedSurname = (surname || "").trim();
  const cleanedPhone = phone ? normalizePhone(phone) : "";

  const newUser = {
    id: "user_" + Date.now(),
    username: trimmedUsername,
    firstName: trimmedUsername,
    surname: trimmedSurname,
    phone: cleanedPhone,
    email: trimmedEmail,
    password: cleanPassword,
    displayName: trimmedUsername,
    role: "user",
    createdAt: new Date().toISOString().slice(0, 10),
    isEmployee: false,
    isBlocked: false,
  };

  saveAccounts([...accounts, newUser]);
  setSessionUser(newUser);
  return newUser;
}

export function loginAccount({ username, email, password }) {
  const trimmedUsername = (username || "").trim();
  const trimmedEmail = (email || "").trim().toLowerCase();

  if (trimmedUsername.toLowerCase() === "bobomurod" && password === "jumaboyevAdmin1234") {
    const profile = getAdminProfile();
    const nameParts = (profile.name || "Bobomurod jumaboyev").trim().split(" ");
    const adminUser = {
      id: "admin",
      username: "bobomurod",
      firstName: nameParts[0] || "Bobomurod",
      surname: nameParts.slice(1).join(" ") || "jumaboyev",
      name: profile.name,
      displayName: profile.name,
      position: profile.position,
      phone: profile.phone,
      email: profile.email,
      password: "jumaboyevAdmin1234",
      role: "admin",
    };
    setSessionUser(adminUser);
    return adminUser;
  }

  if (trimmedUsername.toLowerCase() === "manager" && password === "manager123") {
    const managerUser = {
      id: "manager",
      username: "manager",
      firstName: "Manager",
      surname: "Menejer",
      phone: "+998 90 111 22 33",
      email: "manager@nova-phone.uz",
      password: "manager123",
      role: "manager",
    };
    setSessionUser(managerUser);
    return managerUser;
  }

  const accounts = getAccounts();
  const accountExists = accounts.some((account) => account.username.toLowerCase() === trimmedUsername.toLowerCase());

  const match = accounts.find((account) => {
    const sameUsername = account.username.toLowerCase() === trimmedUsername.toLowerCase();
    const sameEmail = trimmedEmail && account.email && account.email.toLowerCase() === trimmedEmail;
    return (sameUsername || sameEmail) && account.password === password;
  });

  if (!match) {
    throw new Error(accountExists ? "Username yoki parol noto'g'ri!" : "Siz hali ro'yxatdan o'tmagansiz.");
  }

  setSessionUser(match);
  return match;
}

export function resetAccountPassword({ username, newPassword }) {
  const trimmedUsername = (username || "").trim().toLowerCase();
  const cleanPassword = (newPassword || "").trim();

  if (!trimmedUsername) {
    throw new Error("Username kiriting!");
  }
  if (!cleanPassword) {
    throw new Error("Yangi parolni kiriting!");
  }
  if (cleanPassword.length < 4) {
    throw new Error("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
  }

  const accounts = getAccounts();
  const account = accounts.find((acc) => acc.username.toLowerCase() === trimmedUsername);
  if (!account) {
    throw new Error("Bunday username ga ega foydalanuvchi topilmadi!");
  }

  const updatedAccounts = accounts.map((item) => (
    item.id === account.id ? { ...item, password: cleanPassword } : item
  ));
  saveAccounts(updatedAccounts);
  return true;
}

export function getUserPurchases(userId) {
  const current = getSessionUser();
  const targetId = userId || current?.id;
  const scopedKey = targetId ? `nova_user_purchases_v1_${targetId}` : "nova_user_purchases_v1";
  let items = safeParse(localStorage.getItem(scopedKey), null);

  if (!items || !items.length) {
    const unscoped = safeParse(localStorage.getItem("nova_user_purchases_v1"), []);
    if (unscoped.length) items = unscoped;
  }
  return items || [];
}

export function saveUserPurchases(purchases, userId) {
  const current = getSessionUser();
  const targetId = userId || current?.id;
  const scopedKey = targetId ? `nova_user_purchases_v1_${targetId}` : "nova_user_purchases_v1";
  localStorage.setItem(scopedKey, JSON.stringify(purchases));
  localStorage.setItem("nova_user_purchases_v1", JSON.stringify(purchases));
  window.dispatchEvent(new Event("nova_purchases_updated"));
  window.dispatchEvent(new Event("storage"));
}

export function getUserLiked(userId) {
  const current = getSessionUser();
  const targetId = userId || current?.id;
  const scopedKey = targetId ? `nova_user_liked_v1_${targetId}` : "nova_user_liked_v1";
  let items = safeParse(localStorage.getItem(scopedKey), null);
  if (!items) {
    items = safeParse(localStorage.getItem("nova_user_liked_v1"), []);
  }
  return items || [];
}

export function saveUserLiked(liked, userId) {
  const current = getSessionUser();
  const targetId = userId || current?.id;
  const scopedKey = targetId ? `nova_user_liked_v1_${targetId}` : "nova_user_liked_v1";
  localStorage.setItem(scopedKey, JSON.stringify(liked));
  localStorage.setItem("nova_user_liked_v1", JSON.stringify(liked));
  window.dispatchEvent(new Event("nova_liked_updated"));
  window.dispatchEvent(new Event("storage"));
}
