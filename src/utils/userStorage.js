export const ACCOUNTS_KEY = "nova_accounts_v1";
export const SESSION_KEY = "nova_session_user";

function safeParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
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
  return safeParse(localStorage.getItem(SESSION_KEY), null);
}

export function getCurrentRole() {
  const sessionUser = getSessionUser();
  if (sessionUser?.role) {
    return sessionUser.role;
  }

  return localStorage.getItem("nova_role") || null;
}

export function setSessionUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem("nova_role", user?.role || "user");
  localStorage.setItem("nova_display_name", user?.username || user?.displayName || "Foydalanuvchi");
}

export function clearSessionUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("nova_role");
  localStorage.removeItem("nova_display_name");
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

export function registerAccount({ username, email, password }) {
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const reservedNames = ["admin", "manager", "bobomurod"];

  if (reservedNames.includes(trimmedUsername.toLowerCase())) {
    throw new Error("Bu username rezerv qilingan. Boshqa username tanlang!");
  }

  if (!trimmedUsername || !trimmedEmail || !password) {
    throw new Error("Barcha maydonlarni to'ldiring!");
  }

  const accounts = getAccounts();
  const alreadyExists = accounts.some(
    (account) =>
      account.username.toLowerCase() === trimmedUsername.toLowerCase() ||
      account.email.toLowerCase() === trimmedEmail
  );

  if (alreadyExists) {
    throw new Error("Bu username yoki email allaqachon mavjud!");
  }

  const newUser = {
    id: Date.now().toString(),
    username: trimmedUsername,
    email: trimmedEmail,
    password,
    role: "user",
  };

  saveAccounts([...accounts, newUser]);
  setSessionUser(newUser);
  return newUser;
}

export function loginAccount({ username, email, password }) {
  const trimmedUsername = (username || "").trim();
  const trimmedEmail = (email || "").trim().toLowerCase();

  if (trimmedUsername.toLowerCase() === "bobomurod" && password === "jumaboyevAdmin1234") {
    const adminUser = {
      id: "admin",
      username: "bobomurod",
      email: "admin@nova-phone.uz",
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
    const sameEmail = account.email.toLowerCase() === trimmedEmail;
    return (sameUsername || sameEmail) && account.password === password;
  });

  if (!match) {
    throw new Error(accountExists ? "Username yoki parol noto'g'ri!" : "Siz hali ro'yxatdan o'tmagansiz.");
  }

  setSessionUser(match);
  return match;
}

export function resetAccountPassword({ username, email, newPassword }) {
  const account = findAccount({ username });
  if (!account || account.email.toLowerCase() !== email.trim().toLowerCase()) {
    throw new Error("Username yoki email noto'g'ri!");
  }
  if (!newPassword.trim()) {
    throw new Error("Yangi parolni kiriting!");
  }

  const accounts = getAccounts().map((item) => (
    item.id === account.id ? { ...item, password: newPassword.trim() } : item
  ));
  saveAccounts(accounts);
}
