import React, { createContext, useContext, useEffect, useState } from "react";

const LocaleContext = createContext(null);

const DEFAULT = "uz";

const TRANSLATIONS = {
  uz: {
    mobile_store: "Mobile Store",
    login_welcome: "Xush kelibsiz! Davom etish uchun tizimga kiring.",
    username: "Username",
    password: "Password",
    sign_in: "Kirish",
    search_placeholder: "🔍 Telefon yoki brend qidirish...",
    all_brands: "Barcha brendlar",
    products_title: "Mahsulotlar 📱",
    products_sub: "Yoqtirgan telefoningizni tanlang va buyurtma bering.",
    no_products: "😔 Mahsulot topilmadi",
    buy: "🛒 Sotib olish",
    added: "✅ Savatga qo'shildi!",
    admin_confirm_title: "Shaxsni tasdiqlash",
    admin_confirm_sub: "Admin sahifasiga kirish uchun parolni kiriting.",
    admin_confirm_password_placeholder: "Admin parolini kiriting",
    confirm: "Tasdiqlash",
    incorrect_password: "Parol noto'g'ri.",
    management_system: "Boshqaruv tizimi",
    logout: "Chiqish",
    search_menu: "Menyuda qidirish...",
    no_menu_match: "Menyuda mos keladigan element topilmadi",
    good_morning: "Xayrli tong",
    good_afternoon: "Xayrli kun",
    good_evening: "Xayrli kech",
    today_is: "Bugun",
    dark_mode: "Qorong'u rejim",
    light_mode: "Yorug' rejim",
    quick_add: "Tez qo'shish",
    quick_review: "Tez ko'rib chiqish",
    quick_shop: "Tez xarid",
    notifications: "Bildirishnomalar",
    notifications_sub: "Oxirgi vazifalar va tasdiqlarni kuzatib boring.",
    sidebar_label: "Yon panel",
    sidebar_expanded: "Yon panel ochiq",
    sidebar_collapsed: "Yon panel yopiq",
    collapse_sidebar: "Yon panelni yopish",
    expand_sidebar: "Yon panelni ochish",
  },
  ru: {
    mobile_store: "Mobile Store",
    login_welcome: "Добро пожаловать! Войдите, чтобы продолжить.",
    username: "Имя пользователя",
    password: "Пароль",
    sign_in: "Войти",
    search_placeholder: "🔍 Поиск телефона или бренда...",
    all_brands: "Все бренды",
    products_title: "Товары 📱",
    products_sub: "Выберите понравившийся телефон и оформите заказ.",
    no_products: "😔 Товары не найдены",
    buy: "🛒 Купить",
    added: "✅ Добавлено в корзину!",
    admin_confirm_title: "Подтвердите личность",
    admin_confirm_sub: "Введите пароль для доступа на страницу администратора.",
    admin_confirm_password_placeholder: "Введите пароль администратора",
    confirm: "Подтвердить",
    incorrect_password: "Неверный пароль.",
    management_system: "Система управления",
    logout: "Выйти",
    search_menu: "Поиск по меню...",
    no_menu_match: "Ничего не найдено в меню",
    good_morning: "Доброе утро",
    good_afternoon: "Добрый день",
    good_evening: "Добрый вечер",
    today_is: "Сегодня",
    dark_mode: "Тёмная тема",
    light_mode: "Светлая тема",
    quick_add: "Быстро добавить",
    quick_review: "Быстрый просмотр",
    quick_shop: "Быстрая покупка",
    notifications: "Уведомления",
    notifications_sub: "Следите за последними задачами и согласованиями.",
    sidebar_label: "Боковая панель",
    sidebar_expanded: "Панель открыта",
    sidebar_collapsed: "Панель закрыта",
    collapse_sidebar: "Свернуть панель",
    expand_sidebar: "Развернуть панель",
  },
  en: {
    mobile_store: "Mobile Store",
    login_welcome: "Welcome! Sign in to continue.",
    username: "Username",
    password: "Password",
    sign_in: "Sign In",
    search_placeholder: "🔍 Search phone or brand...",
    all_brands: "All brands",
    products_title: "Products 📱",
    products_sub: "Choose your favorite phone and place an order.",
    no_products: "😔 No products found",
    buy: "🛒 Buy",
    added: "✅ Added to cart!",
    admin_confirm_title: "Confirm identity",
    admin_confirm_sub: "Enter the password to access admin pages.",
    admin_confirm_password_placeholder: "Enter admin password",
    confirm: "Confirm",
    incorrect_password: "Incorrect password.",
    management_system: "Management System",
    logout: "Logout",
    search_menu: "Search the menu...",
    no_menu_match: "No matching menu items",
    good_morning: "Good morning",
    good_afternoon: "Good afternoon",
    good_evening: "Good evening",
    today_is: "Today is",
    dark_mode: "Dark mode",
    light_mode: "Light mode",
    quick_add: "Quick add",
    quick_review: "Quick review",
    quick_shop: "Quick shop",
    notifications: "Notifications",
    notifications_sub: "Stay updated with your latest tasks and approvals.",
    sidebar_label: "Sidebar",
    sidebar_expanded: "Sidebar is open",
    sidebar_collapsed: "Sidebar is folded",
    collapse_sidebar: "Collapse sidebar",
    expand_sidebar: "Expand sidebar",
  },
};

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("nova_lang") || DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("nova_lang", lang);
    } catch {}
  }, [lang]);

  const t = (key) => {
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS[DEFAULT][key] || key;
  };

  return <LocaleContext.Provider value={{ lang, setLang, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export default LocaleContext;
