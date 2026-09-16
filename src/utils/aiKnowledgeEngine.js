// NOVA-PHONE AI Knowledge & Reasoning Engine
// Foydalanuvchi, menejer va adminlar uchun sayt boyicha to'liq intellektual yordamchi

export const NOVA_KNOWLEDGE = {
  storeName: "NOVA-PHONE",
  slogan: "Eng so'nggi va ishonchli smartfonlar do'koni",
  contacts: {
    phone: "+998 90 000 00 00",
    supportTelegram: "@novaphone_support",
    workingHours: "Har kuni 09:00 dan 21:00 gacha",
    address: "Toshkent shahri, Chilonzor tumani, Bunyodkor ko'chasi 15-uy",
  },
  delivery: {
    tashkent: "Toshkent shahri bo'ylab: 24 soat ichida bepul yetkazib beriladi.",
    regions: "Viloyatlar bo'ylab: 1-3 ish kunida kuryerlik xizmati orqali yetkaziladi.",
    cost: "Buyurtma summasi 3,000,000 so'mdan oshsa bepul yetkaziladi.",
  },
  warranty: "Barcha smartfonlarga 1 yillik rasmiy servis kafolati va 14 kunlik almashtirish kafolati beriladi.",
  payments: "Naqd pul, Uzcard, Humo, Payme, Click va bank kartalari orqali to'lovlar qabul qilinadi.",
};

// Rolga asoslangan boshlang'ich tezkor savollar (Suggestions / Chips)
export function getRoleSuggestions(role, pathname = "") {
  if (role === "admin") {
    return [
      "Yangi mahsulot qanday qo'shiladi?",
      "Xodimlarni qanday boshqaraman?",
      "Mijozlarni bloklash yoki o'chirish",
      "Kunlik va oylik savdo hisobotlari",
      "Ombor qoldiqlarini tekshirish",
      "Chegirma va aksiyalar yaratish",
    ];
  }

  if (role === "manager") {
    return [
      "Mijozlar buyurtmalarini tekshirish",
      "Menejer savdolar tarixi",
      "Ombordan tovar holatini ko'rish",
      "Mijozlar sharhlari va baholari",
      "Nuqsonli tovarlarni qayd qilish",
      "Xodimlar davomati",
    ];
  }

  if (role === "user") {
    return [
      "Qanday qilib telefon sotib olaman?",
      "Mening buyurtmam qayerda va holati qanday?",
      "Yetkazib berish qancha vaqt oladi?",
      "Xaridimga baho va fikr bildirish",
      "Kafolat va servis xizmati",
      "Parolimni qanday o'zgartiraman?",
    ];
  }

  // Mehmon / Login sahifasida
  return [
    "Saytda qanday ro'yxatdan o'taman?",
    "Admin yoki menejer profiliga kirish",
    "Eng ommabop smartfonlar qaysilar?",
    "Do'kon manzili va telefon raqami",
    "Yetkazib berish va to'lov shartlari",
  ];
}

// Semantik javoblar lug'ati va tahlil qoidalari
const TOPICS = [
  // --- USER MAVZULARI ---
  {
    keywords: ["sotib olish", "qanday sotib", "xarid", "zakaz", "buyurtma qilish", "sotib olaman", "olmoqchiman"],
    roles: ["user", "any"],
    title: "🛍️ Mahsulot sotib olish tartibi",
    action: { label: "Mahsulotlar katalogiga o'tish", path: "/user/products" },
    answer: `Smartfon sotib olish juda oson:
1. **"Mahsulotlar"** bo'limiga o'ting.
2. O'zingizga ma'qul bo'lgan telefon modelini tanlang (masalan, iPhone, Samsung, Xiaomi).
3. Mahsulot kartasidagi **"Sotib olish"** tugmasini bosing.
4. Buyurtmangiz darhol rasmiylashtiriladi va kuryer orqali yetkazib berish ro'yxatiga tushadi.
5. Xaridlaringizni istalgan payt **"Xaridlar"** bo'limida kuzatib borishingiz mumkin.`,
  },
  {
    keywords: ["buyurtmam", "holat", "yetkazilmoqda", "qayerda", "buyurtma holati", "buyurtmalarim", "qachon keladi"],
    roles: ["user", "any"],
    title: "📦 Buyurtmalar holatini kuzatish",
    action: { label: "Xaridlarim bo'limiga o'tish", path: "/user/buy" },
    answer: `Buyurtmalaringiz holatini bilish uchun:
- Chap menyudan **"Xaridlar"** (yoki "Buyurtmalar") bo'limiga kiring.
- U yerda buyurtma sanasi, yetkazib berish taxminiy muddati va holati ko'rinadi:
  • 🚚 **"Yetkazilmoqda"** — kuryer yo'lda yoki ombordan jo'natilgan.
  • ✅ **"Yetkazildi"** — mahsulot sizga topshirilgan.
- Mahsulot yetkazilgandan so'ng, unga 1 dan 5 gacha yulduzcha qo'yib baho berishingiz mumkin!`,
  },
  {
    keywords: ["baho", "fikr", "sharh", "yulduzcha", "rating", "izoh", "mamnun"],
    roles: ["user", "manager", "any"],
    title: "⭐ Fikr va baho qoldirish",
    action: { label: "Buyurtmalar ro'yxati", path: "/user/buy" },
    answer: `Mahsulot sifatiga baho berish:
- **"Xaridlar"** sahifasiga kiring.
- Siz xarid qilgan telefon kartasida **yulduzchalar (1-5)** mavjud.
- Tegishli yulduzchani tanlang. Sizning fikringiz do'kon ma'muriyati va menejerlariga sifatni yaxshilash uchun ko'rinadi.`,
  },
  {
    keywords: ["yetkazib berish", "dostavka", "kuryer", "viloyat", "shahar", "bepul"],
    roles: ["any"],
    title: "🚚 Yetkazib berish xizmati",
    answer: `Yetkazib berish shartlari:
• **Toshkent shahri:** 24 soat ichida to'g'ridan-to'g'ri eshigingizgacha yetkaziladi (bepul).
• **Viloyatlar:** 1 dan 3 ish kunigacha tezkor pochta yoki kuryerlik orqali.
• Barcha jo'natmalar maxsus zarbaga chidamli qutilarda xavfsiz yetkaziladi.`,
  },
  {
    keywords: ["tolov", "to'lov", "payme", "click", "naqd", "uzcard", "humo", "karta", "pul"],
    roles: ["any"],
    title: "💳 To'lov usullari",
    answer: `NOVA-PHONE da quyidagi qulay to'lov turlari mavjud:
1. **Onlayn to'lov:** Click, Payme, Uzum Bank ilovalari orqali.
2. **Karta orqali:** Yetkazib berilganda terminal orqali (Uzcard / Humo / Visa).
3. **Naqd pul:** Kuryer mahsulotni topshirganda naqd to'lashingiz mumkin.`,
  },
  {
    keywords: ["kafolat", "garantiya", "remont", "servis", "buzilsa", "almashtirish"],
    roles: ["any"],
    title: "🛡️ Kafolat va Servis",
    answer: `Barcha smartfonlarimiz rasmiy va yangi:
• **1 yil rasmiy kafolat** taqdim etiladi.
• Mahsulotda ishlab chiqarish nuqsoni aniqlansa, **14 kun ichida bepul almashtirib berish** huquqi kafolatlanadi.
• Servis markazlarimiz Toshkent va barcha viloyat markazlarida faoliyat yuritadi.`,
  },

  // --- ADMIN MAVZULARI ---
  {
    keywords: ["mahsulot qo'shish", "mahsulot qoshish", "yangi telefon", "tovar qoshish", "narx ozgartirish", "rasm qoyish", "tahrirlash"],
    roles: ["admin", "any"],
    title: "📱 Yangi mahsulot qo'shish va tahrirlash",
    action: { label: "Admin: Mahsulotlar bo'limiga o'tish", path: "/admin/products" },
    answer: `Admin panelda mahsulot qo'shish tartibi:
1. **"Mahsulotlar"** bo'limiga kiring (\`/admin/products\`).
2. Sahifaning yuqori qismidagi formani to'ldiring:
   - **Nomi:** (masalan: Samsung Galaxy S24 Ultra)
   - **Brendi:** Apple, Samsung, Xiaomi, Google Pixel va h.k.
   - **Kategoriyasi:** Smartphone
   - **Narxi:** so'mda (masalan: 14500000)
   - **Qoldiq (stock):** dona soni
   - **Rasm yo'li:** Masalan: \`/images/samsung.jpeg\`
   - **Tavsif:** Smartfon haqida qisqacha ma'lumot
3. **"Saqlash"** yoki **"Qo'shish"** tugmasini bosing.
4. Mavjud mahsulotni o'zgartirish uchun jadvaldagi qalamcha (tahrirlash) tugmasini bosing.`,
  },
  {
    keywords: ["xodim", "xodimlar", "ishchi", "menejer qoshish", "employee", "ishga olish"],
    roles: ["admin", "any"],
    title: "👥 Xodimlarni boshqarish",
    action: { label: "Admin: Xodimlar bo'limiga o'tish", path: "/admin/employees" },
    answer: `Do'kon xodimlarini boshqarish:
- **"Xodimlar"** sahifasiga o'ting (\`/admin/employees\`).
- Bu yerda barcha faol menejer va xodimlar ro'yxati chiqadi.
- Yangi xodim qo'shish uchun ism-familiya, lavozim (Menejer, Sotuvchi, Kuryer), telefon va kirish huquqlarini kiritishingiz mumkin.
- Xodim faoliyatini vaqtincha to'xtatish yoki tizimdan o'chirish imkoniyati mavjud.`,
  },
  {
    keywords: ["mijozlar", "foydalanuvchilar", "userlar", "bloklash", "users", "mijoz royxati"],
    roles: ["admin", "any"],
    title: "👤 Foydalanuvchilar (Mijozlar) nazorati",
    action: { label: "Admin: Foydalanuvchilar", path: "/admin/users" },
    answer: `Mijozlarni nazorat qilish:
- **"Foydalanuvchilar"** menyusiga kiring (\`/admin/users\`).
- Ro'yxatdan o'tgan barcha mijozlarning ism, familiya, telefon raqami va elektron pochtasi ko'rinadi.
- Qoidabuzarlik holatlarida foydalanuvchini bloklash yoki ma'lumotlarini tahrirlash mumkin.`,
  },
  {
    keywords: ["savdo hisobot", "tushum", "daromad", "statistika", "sales", "analytics", "analitika"],
    roles: ["admin", "manager", "any"],
    title: "📊 Savdolar va Analitika",
    action: { label: "Admin: Savdolar hisoboti", path: "/admin/sales" },
    answer: `Savdo ko'rsatkichlari:
• **"Savdolar"** sahifasida: Barcha amalga oshirilgan savdolar, buyurtmachi ismi, telefon raqami, mahsulot va umumiy summa aks etadi.
• **"Analitika"** sahifasida (\`/admin/analytics\`): Kunlik, haftalik va oylik tushumlar grafik ko'rinishida taqdim etiladi.
• Eng ko'p sotilayotgan top brendlar va modellar monitoring qilinadi.`,
  },
  {
    keywords: ["chegirma", "aksiya", "promokod", "promotions", "bonus"],
    roles: ["admin", "any"],
    title: "🎁 Chegirma va Aksiyalar",
    action: { label: "Admin: Aksiyalar", path: "/admin/promotions" },
    answer: `Aksiyalar boshqaruvi:
- **"Aksiyalar"** bo'limiga kiring (\`/admin/promotions\`).
- Yangi banner, chegirma foizi (masalan 10% yoki 20%) va amal qilish muddatini belgilang.
- Bu ma'lumotlar foydalanuvchilar bosh sahifasida avtomatik ravishda e'lon qilinadi.`,
  },

  // --- MANAGER MAVZULARI ---
  {
    keywords: ["ombor", "qoldiq", "sklad", "warehouse", "yetishmayapti", "tovar soni"],
    roles: ["manager", "admin", "any"],
    title: "🏢 Ombor va Tovar qoldiqlari",
    action: { label: "Ombor bo'limiga o'tish", path: "/manager/warehouse" },
    answer: `Omborni tekshirish:
- **"Ombor"** menyusiga kiring.
- Har bir telefon modelining ombordagi aniq qoldig'i (soni) ko'rsatiladi.
- Agar mahsulot soni kam qolsa (5 donadan kam), tizim ogohlantirish beradi va yangi partiyaga buyurtma berishni tavsiya qiladi.`,
  },
  {
    keywords: ["sharhlar", "mijoz fikri", "reviews", "baho berganlar", "otziv"],
    roles: ["manager", "admin", "any"],
    title: "⭐ Mijozlar sharhlari va baholari",
    action: { label: "Sharhlar bo'limiga o'tish", path: "/manager/reviews" },
    answer: `Menejer sifatida sharhlar bilan ishlash:
- **"Sharhlar"** sahifasida mijozlar qoldirgan barcha baholar (1-5 yulduz) va izohlarni ko'rishingiz mumkin.
- Norozi mijozlar bo'lsa, ularning telefon raqami orqali bog'lanib, masalani ijobiy hal etish menejerning asosiy vazifalaridan biridir.`,
  },
  {
    keywords: ["nuqsonli", "brak", "buzilgan", "damaged", "almashtirilgan", "brak tovar"],
    roles: ["manager", "admin", "any"],
    title: "⚠️ Nuqsonli (Brak) tovarlar hisobi",
    action: { label: "Nuqsonli tovarlar bo'limi", path: "/manager/damaged" },
    answer: `Nuqsonli mahsulotlarni qayd etish:
- Agar mijozdan shikoyat tushsa yoki omborda nosoz telefon aniqlansa, **"Nuqsonli tovarlar"** bo'limiga kiritiladi.
- Nosozlik sababi (ekran, korpus, plata) yozilib, servis markaziga yuboriladi.`,
  },
  {
    keywords: ["davomat", "attendance", "ishga kelish", "smena"],
    roles: ["manager", "admin", "any"],
    title: "⏱️ Xodimlar davomati",
    action: { label: "Davomat bo'limi", path: "/manager/attendance" },
    answer: `Davomat monitoringi:
- **"Davomat"** bo'limida do'kon xodimlari va kuryerlarning ishga kelgan va ketgan vaqti qayd etib boriladi.`,
  },

  // --- HISOB VA PAROL ---
  {
    keywords: ["parol", "login", "parolni unutdim", "profil", "kirish", "akkount", "telefon raqam"],
    roles: ["any"],
    title: "🔑 Profil va Parol boshqaruvi",
    action: { label: "Kirish sahifasi", path: "/" },
    answer: `Hisob bilan ishlash:
• **Ro'yxatdan o'tish:** Login sahifasida "Ro'yxatdan o'tish" tabiga o'ting, ism, familiya, \`+998 XX XXX XX XX\` telefon raqami, username va parol kiriting.
• **Parolni tiklash:** Agar parolingizni esdan chiqargan bo'lsangiz, kirish oynasidagi "Parolni unutdingizmi?" tugmasi orqali yangi parol o'rnatishingiz mumkin.
• **Admin hisobi:** Username: \`bobomurod\`, standart xavfsiz tizim orqali kiriladi.
• **Menejer hisobi:** Username: \`manager\`.`,
  },

  // --- MODELLAR VA NARXLAR ---
  {
    keywords: ["iphone", "apple", "15 pro", "14 pro", "ayfon"],
    roles: ["any"],
    title: "🍎 Apple iPhone modellari",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Do'konimizda mavjud mashhur iPhone modellari:
• **iPhone 15 Pro** — 12,500,000 so'm (Titan korpus, A17 Pro chip).
• **iPhone 15** — 9,800,000 so'm (Dynamic Island, 48MP kamera).
• **iPhone 14 Pro Max** — 11,900,000 so'm (Katta 6.7" ekran, uzoq batareya).
• **iPhone 13** — 7,500,000 so'm (Narx va sifat uyg'unligi).
Barchasi yangi, qutida va 1 yillik rasmiy kafolat bilan taqdim etiladi!`,
  },
  {
    keywords: ["samsung", "galaxy", "s24", "ultra", "a55", "flip"],
    roles: ["any"],
    title: "📱 Samsung Galaxy smartfonlari",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Eng so'nggi Samsung modellari:
• **Samsung Galaxy S24 Ultra** — 14,500,000 so'm (Galaxy AI, 200MP kamera).
• **Samsung Galaxy S24+** — 11,200,000 so'm (Katta AMOLED ekran).
• **Samsung Z Flip5** — 9,500,000 so'm (Bukiluvchi innovatsion dizayn).
• **Samsung Galaxy A55** — 4,600,000 so'm (Eng ommabop o'rta segment).`,
  },
  {
    keywords: ["xiaomi", "redmi", "poco", "14 ultra", "note 13"],
    roles: ["any"],
    title: "⚡ Xiaomi, Redmi va POCO",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Xiaomi modellar qatori:
• **Xiaomi 14 Ultra** — 10,500,000 so'm (Leica professional optika).
• **Redmi Note 13 Pro+** — 4,400,000 so'm (200MP kamera, 120W quvvatlash).
• **Poco F6 Pro** — 5,800,000 so'm (Kuchli o'yin smartfoni).
• **Redmi 13C** — 1,600,000 so'm (Hamyonbop va ishonchli).`,
  },
  {
    keywords: ["google", "pixel", "pixel 8", "fold"],
    roles: ["any"],
    title: "🌐 Google Pixel smartfonlari",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Google Pixel toza Android smartfonlari:
• **Google Pixel 8 Pro** — 10,200,000 so'm (Google AI va eng yaxshi suratlar).
• **Google Pixel 8** — 7,800,000 so'm (Ixcham va juda tezkor).
• **Google Pixel Fold** — 15,500,000 so'm (Google ning bukiluvchi flagmani).
• **Google Pixel 7a** — 4,900,000 so'm (Ajoyib kamera va hamyonbop narx).`,
  },

  // --- ALOQA VA MANZIL ---
  {
    keywords: ["manzil", "telefon", "kontakt", "qayerda joylashgan", "lokatsiya", "telegram", "aloqa", "nomer"],
    roles: ["any"],
    title: "📞 Biz bilan bog'lanish",
    answer: `NOVA-PHONE bilan aloqa:
• **Telefon:** ${NOVA_KNOWLEDGE.contacts.phone}
• **Telegram yordam:** ${NOVA_KNOWLEDGE.contacts.supportTelegram}
• **Ish vaqti:** ${NOVA_KNOWLEDGE.contacts.workingHours}
• **Manzil:** ${NOVA_KNOWLEDGE.contacts.address}
Do'konimizga kelib, modellarni jonli sinab ko'rishingiz ham mumkin!`,
  },

  // --- SALOMLASHISH VA SHAXS ---
  {
    keywords: ["salom", "assalomu alaykum", "qalesiz", "qalaysiz", "hayrli kun", "privet", "hello"],
    roles: ["any"],
    title: "👋 Assalomu alaykum!",
    answer: `Assalomu alaykum! Men **NOVA-PHONE** sun'iy intellekt yordamchisiman 🤖✨.

Men sizga:
- Mahsulotlar katalogi, narxlar va xususiyatlar;
- Buyurtma berish va yetkazib berish holati;
- Xaridlar va sharhlar qoldirish;
- Admin va Menejer panelidagi barcha imkoniyatlar bo'yicha darhol yordam bera olaman.

Qanday savolingiz bor? Quyidagi tayyor savollardan birini tanlashingiz yoki o'z savolingizni yozishingiz mumkin!`,
  },
  {
    keywords: ["rahmat", "tashakkur", "spasibo", "boldi", "tushundim", "raxmat"],
    roles: ["any"],
    title: "😊 Doim xizmatingizdamiz!",
    answer: `Arzimaydi! Sizga yordam berganimdan juda xursandman 🌟. Agar yana biror narsani tushunmasangiz yoki savol tug'ilsa, bemalol murojaat qiling. NOVA-PHONE bilan xaridlaringiz barakali bo'lsin!`,
  },
  {
    keywords: ["sen kimsan", "kim bu", "ai", "suniy intellekt", "vazifang nima"],
    roles: ["any"],
    title: "🤖 Men haqimda",
    answer: `Men **NOVA AI Yordamchi**man. Men maxsus NOVA-PHONE elektron tijorat va do'kon boshqaruv tizimi uchun yaratilgan aqlli maslahatchiman.
Foydalanuvchilar (User), Menejerlar (Manager) va Adminlarning har biriga o'z huquqlari doirasida saytdan qulay va to'g'ri foydalanishga ko'maklashaman.`,
  },
];

// Asosiy javob qaytarish funksiyasi
export function askNovaAI({ query, role = "user", userName = "", currentPath = "" }) {
  const normalizedQuery = (query || "").trim().toLowerCase();

  if (!normalizedQuery) {
    return {
      title: "Iltimos, savolingizni kiriting",
      answer: "Savolingizni yozing yoki quyidagi taklif qilingan tugmalardan birini bosing.",
      action: null,
    };
  }

  // 1. Eng mos mavzuni topish (Match scoring)
  let bestMatch = null;
  let highestScore = 0;

  for (const topic of TOPICS) {
    let score = 0;

    // Rol mosligi
    const roleMatches = topic.roles.includes("any") || topic.roles.includes(role);
    if (!roleMatches) continue;

    for (const kw of topic.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += kw.length; // Uzunroq kalit so'z ko'proq vaznga ega
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && highestScore > 0) {
    let personalizedGreeting = "";
    if (userName && Math.random() > 0.6) {
      personalizedGreeting = `Hurmatli ${userName}! `;
    }

    return {
      title: bestMatch.title,
      answer: personalizedGreeting + bestMatch.answer,
      action: bestMatch.action || null,
    };
  }

  // 2. Agar aniq kalit so'z topilmasa, aqlli umumiy yo'l ko'rsatish
  if (role === "admin") {
    return {
      title: "🛡️ Admin Boshqaruv Maslahati",
      answer: `Savolingiz bo'yicha aniq ma'lumot topilmadi, biroq Admin sifatida siz quyidagi bo'limlardan foydalanishingiz mumkin:
- **Mahsulotlar:** Yangi telefonlar qo'shish, narxlarni belgilash (\`/admin/products\`).
- **Xodimlar:** Menejer va xodimlar ro'yxati (\`/admin/employees\`).
- **Mijozlar:** Foydalanuvchilar hisoblarini nazorat qilish (\`/admin/users\`).
- **Savdolar & Analitika:** Tushum va grafiklar (\`/admin/sales\`).

Iltimos, qaysi bo'lim haqida bilmoqchi ekanligingizni aniqroq yozing.`,
      action: { label: "Admin panelga o'tish", path: "/admin/dashboard" },
    };
  }

  if (role === "manager") {
    return {
      title: "💼 Menejer Yordam Maslahati",
      answer: `Menejer sifatida saytda siz quyidagi vazifalarni bajarasiz:
- **Buyurtmalar & Savdolar:** Mijozlar sotib olgan tovarlar ro'yxati (\`/manager/orders\`, \`/manager/sales\`).
- **Ombor:** Qaysi modellar kam qolganini nazorat qilish (\`/manager/warehouse\`).
- **Sharhlar:** Mijozlar qoldirgan baho va fikrlarni o'rganish (\`/manager/reviews\`).

Aniqroq yordam kerak bo'lsa, mavzuni ko'rsating (masalan: "ombor holati" yoki "sharhlar").`,
      action: { label: "Menejer paneliga o'tish", path: "/manager" },
    };
  }

  // Oddiy foydalanuvchi yoki mehmon
  return {
    title: "💡 Sizga qanday yordam bera olaman?",
    answer: `Kechirasiz, savolingizni to'liq tushunolmadim. Men sizga quyidagilar bo'yicha yordam bera olaman:
1. **Smartfon sotib olish** (iPhone, Samsung, Xiaomi, Google Pixel narxlari).
2. **Buyurtmangiz holatini bilish** (Yetkazilmoqda / Yetkazildi).
3. **Yetkazib berish va to'lov usullari**.
4. **Kafolat va servis xizmatlari**.

Quyidagi tugmalardan birini tanlab ko'ring yoki savolingizni boshqacha shaklda yozing!`,
    action: { label: "Katalogni ko'rish", path: "/user/products" },
  };
}
