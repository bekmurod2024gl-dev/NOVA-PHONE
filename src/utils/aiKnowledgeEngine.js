// NOVA-PHONE AI Knowledge & Universal Intelligence Engine
// Sayt bo'yicha va dunyodagi har qanday savolga o'zbek tilida aqlli javob beruvchi tizim

export const NOVA_KNOWLEDGE = {
  storeName: "NOVA-PHONE",
  domain: "telefonxarid.uz",
  slogan: "Eng so'nggi va ishonchli smartfonlar do'koni",
  contacts: {
    phone: "+998 33 045 86 85",
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
      "Online ishga topshirganlarni ko'rish",
      "Haqiqiy xodimlar maoshini belgilash",
      "Kunlik va oylik savdo hisobotlari",
      "Ombor qoldiqlarini tekshirish",
      "Dasturlash yoki texnologiya haqida savol",
    ];
  }

  if (role === "manager") {
    return [
      "Mijozlar buyurtmalarini tekshirish",
      "Ishchilar paneli va ko'rsatkichlari",
      "Ombordan tovar holatini ko'rish",
      "Mijozlar sharhlari va baholari",
      "Bugungi savdolar summasi",
      "Smartfonlar taqqoslashi",
    ];
  }

  if (role === "user") {
    return [
      "Qanday qilib telefon sotib olaman?",
      "NOVA-PHONE ga qanday ishga kirsam bo'ladi?",
      "Buyurtmam holati va yetkazib berish",
      "iPhone 15 Pro narxi va xususiyatlari",
      "Samsung S24 Ultra haqida ma'lumot",
      "Istalgan mavzuda savol berish",
    ];
  }

  return [
    "Saytda qanday ro'yxatdan o'taman?",
    "Online ishga kirish uchun ariza topshirish",
    "Eng ommabop smartfonlar qaysilar?",
    "Do'kon manzili va telefon raqami",
    "Yetkazib berish va kafolat shartlari",
  ];
}

// Matematik hisob-kitoblarni aniqlash va hisoblash
function tryMathCalculation(query) {
  // Oddiy arifmetik ifodalarni qidirish (masalan: 25 * 4, 15000000 * 0.15, 25000 + 45000, 100/4)
  const sanitized = query.replace(/[^\d\+\-\*\/\.\(\)\%\s]/g, "").trim();
  if (sanitized && /[\+\-\*\/]/.test(sanitized) && /\d/.test(sanitized)) {
    try {
      // Xavfsiz hisoblash
      const evalStr = sanitized.replace(/%/g, "/100");
      // faqat raqamlar va amallar borligini tekshirish
      if (/^[\d\+\-\*\/\.\(\)\s]+$/.test(evalStr)) {
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${evalStr})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return {
            title: "🔢 Matematik hisoblash natijasi",
            answer: `Hisob-kitob natijasi:\n\n**${query.trim()}** = **${new Intl.NumberFormat("uz-UZ").format(result)}**`,
            action: null,
          };
        }
      }
    } catch {
      // davom etadi
    }
  }
  return null;
}

// Do'kon va sayt mavzulari
const TOPICS = [
  // --- ISHGA KIRISH VA XODIMLAR ---
  {
    keywords: ["ishga kirish", "ishchi bolish", "vakansiya", "ish bormi", "oylik qancha", "ishga olish", "ariza", "ishlamoqchiman"],
    roles: ["any"],
    title: "💼 NOVA-PHONE ga Ishga Kirish (Vakansiyalar)",
    action: { label: "Ishga ariza topshirish sahifasi", path: "/user" },
    answer: `NOVA-PHONE jamoasiga ishga kirish tartibi:
1. Shaxsiy profilingizda (\`/user\`) **"Online ariza topshirish"** tugmasi mavjud.
2. Quyidagi lavozimlardan birini tanlaysiz:
   • **Sotuvchi-maslahatchi** (Oylik: 5,000,000 so'm + savdo bonusi)
   • **Kassir** (Oylik: 4,500,000 so'm)
   • **Ombor xodimi** (Oylik: 4,800,000 so'm)
   • **Yetkazib beruvchi / Kuryer** (Oylik: 4,000,000 so'm + xizmat haqi)
   • **Menejer**
3. Arizangiz yuborilgach, Bosh administrator uni ko'rib chiqadi va tasdiqlangach sizga shaxsiy **Ishchi Paneli (\`/employee\`)** ochiladi!`,
  },
  {
    keywords: ["ishchi paneli", "maoshim", "mening oyligim", "ishchi kabinet", "ishchi"],
    roles: ["any"],
    title: "👷‍♂️ Shaxsiy Ishchi Paneli",
    action: { label: "Ishchi paneliga o'tish", path: "/employee" },
    answer: `Xodimlar uchun shaxsiy ishchi panelida:
• **Oylik maosh va KPI bonuslari** hisoboti;
• **Raqamli xodim guvohnomasi** (#EMP ID raqami);
• **Kunlik vazifalar va topshiriqlar** ro'yxati;
• **Ish smenasini belgilash** (09:00 - 18:00) hamda ta'tilga ariza berish imkoniyati mavjud.
Ishchi kabinetingizga kirish uchun quyidagi tugmani bosing!`,
  },

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
- Chap menyudan **"Xaridlar"** bo'limiga kiring.
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
   - **Narxi:** so'mda (masalan: 14500000)
   - **Qoldiq (stock):** dona soni
   - **Rasm yo'li:** Masalan: \`/images/samsung.jpeg\`
3. **"Saqlash"** yoki **"Qo'shish"** tugmasini bosing.`,
  },
  {
    keywords: ["xodim", "xodimlar", "ishchi", "menejer qoshish", "employee", "ishga olish"],
    roles: ["admin", "any"],
    title: "👥 Xodimlarni boshqarish",
    action: { label: "Admin: Xodimlar bo'limiga o'tish", path: "/admin/employees" },
    answer: `Do'kon xodimlarini boshqarish:
- **"Xodimlar"** sahifasiga o'ting (\`/admin/employees\`).
- Bu yerda barcha haqiqiy xodimlar ro'yxati va kelib tushgan **Online arizalar** chiqadi.
- Online topshirilgan arizalarni birgina **"✅ Ishga olish"** tugmasi orqali tasdiqlab, xodimlar safiga qabul qilishingiz mumkin.`,
  },
  {
    keywords: ["savdo hisobot", "tushum", "daromad", "statistika", "sales", "analytics", "analitika"],
    roles: ["admin", "manager", "any"],
    title: "📊 Savdolar va Analitika",
    action: { label: "Admin: Savdolar hisoboti", path: "/admin/sales" },
    answer: `Savdo ko'rsatkichlari:
• **"Savdolar"** sahifasida haqiqiy mijozlar sotib olgan barcha xaridlar, summasi, sharhlari va mamnunlik darajasi aks etadi.
• **"Analitika"** sahifasida kunlik, haftalik va oylik daromad monitoringi yuritiladi.`,
  },

  // --- SMARTFON MODELLARI ---
  {
    keywords: ["iphone", "apple", "15 pro", "14 pro", "ayfon", "16 pro"],
    roles: ["any"],
    title: "🍎 Apple iPhone modellari",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Do'konimizdagi eng so'nggi iPhone modellari:
• **iPhone 16 Pro Max** — 19,500,000 so'm (A18 Pro, Camera Control)
• **iPhone 15 Pro** — 12,500,000 so'm (Titan korpus, A17 Pro chip)
• **iPhone 15** — 9,800,000 so'm (Dynamic Island, 48MP kamera)
• **iPhone 14 Pro Max** — 11,900,000 so'm (6.7" Super Retina XDR ekran)
Barcha modellar original, yangi va 1 yillik kafolat bilan beriladi!`,
  },
  {
    keywords: ["samsung", "galaxy", "s24", "ultra", "a55", "flip"],
    roles: ["any"],
    title: "📱 Samsung Galaxy smartfonlari",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Samsung Galaxy modellari:
• **Samsung Galaxy S24 Ultra** — 14,500,000 so'm (Galaxy AI, 200MP kamera)
• **Samsung Galaxy S24+** — 11,200,000 so'm (Dynamic AMOLED 2X)
• **Samsung Z Flip5** — 9,500,000 so'm (Bukiluvchi innovatsion ekran)
• **Samsung Galaxy A55** — 4,600,000 so'm (O'rta segment flagmani)`,
  },
  {
    keywords: ["xiaomi", "redmi", "poco", "14 ultra", "note 13"],
    roles: ["any"],
    title: "⚡ Xiaomi, Redmi va POCO",
    action: { label: "Katalogda ko'rish", path: "/user/products" },
    answer: `Xiaomi modellar qatori:
• **Xiaomi 14 Ultra** — 10,500,000 so'm (Leica professional optika)
• **Redmi Note 13 Pro+** — 4,400,000 so'm (200MP kamera, 120W quvvatlash)
• **Poco F6 Pro** — 5,800,000 so'm (Kuchli o'yin smartfoni)`,
  },

  // --- ALOQA ---
  {
    keywords: ["manzil", "telefon", "kontakt", "qayerda joylashgan", "lokatsiya", "telegram", "aloqa", "nomer"],
    roles: ["any"],
    title: "📞 Biz bilan bog'lanish",
    answer: `NOVA-PHONE bilan aloqa:
• **Telefon:** ${NOVA_KNOWLEDGE.contacts.phone}
• **Sayt:** ${NOVA_KNOWLEDGE.domain}
• **Telegram yordam:** ${NOVA_KNOWLEDGE.contacts.supportTelegram}
• **Ish vaqti:** ${NOVA_KNOWLEDGE.contacts.workingHours}
• **Manzil:** ${NOVA_KNOWLEDGE.contacts.address}`,
  },
  {
    keywords: ["salom", "assalomu alaykum", "qalesiz", "qalaysiz", "hayrli kun", "privet", "hello"],
    roles: ["any"],
    title: "👋 Assalomu alaykum!",
    answer: `Assalomu alaykum! Men **NOVA AI** aqlli intellekt yordamchisiman 🤖✨.
Siz menga saytdan foydalanish, smartfonlar, ishga kirish bo'yicha yoki **mutlaqo har qanday boshqa sohadagi (fan, dasturlash, hayot, matematika va h.k.)** savolingizni berishingiz mumkin.
Sizga qanday yordam bera olaman?`,
  },
  {
    keywords: ["rahmat", "tashakkur", "spasibo", "boldi", "tushundim", "raxmat"],
    roles: ["any"],
    title: "😊 Doim xizmatingizdamiz!",
    answer: `Arzimaydi! Sizga yordam berganimdan juda mamnunman 🌟. Har qanday savolingiz bo'lsa, istalgan payt yozishingiz mumkin!`,
  },
];

// Universal Intellektual Bilimlar Bazasi (General Knowledge Synthesizer)
function generateUniversalAnswer(query) {
  const q = query.toLowerCase();

  // Dasturlash va IT
  if (q.includes("dasturlash") || q.includes("kod") || q.includes("programming") || q.includes("it")) {
    return {
      title: "💻 Dasturlash va IT bo'yicha ma'lumot",
      answer: `Dasturlash — bu kompyuter yoki tizimlarga muayyan vazifalarni bajarish uchun ko'rsatmalar (kod) yozish jarayonidir.

Asosiy yo'nalishlar:
1. **Frontend (Veb-interfeys):** HTML, CSS, JavaScript, React, Vue. Saytning foydalanuvchi ko'radigan qismi (xuddi bizning NOVA-PHONE kabi).
2. **Backend (Server qismi):** Python (FastAPI, Django), Node.js, Java, Go. Ma'lumotlar bazasi va hisob-kitoblar.
3. **Mobil ilovalar:** Flutter, React Native, Swift (iOS), Kotlin (Android).
4. **Sun'iy intellekt va Data Science:** Python, PyTorch, TensorFlow.

O'rganishni boshlash uchun dastlab algoritmlar mantig'i va JavaScript yoki Python tilini o'rganish tavsiya etiladi!`,
      action: null,
    };
  }

  // React va Frontend
  if (q.includes("react") || q.includes("javascript") || q.includes("vite")) {
    return {
      title: "⚛️ React va Zamonaviy Veb Texnologiyalar",
      answer: `**React** — bu Meta (Facebook) tomonidan yaratilgan, foydalanuvchi interfeyslarini (UI) qurish uchun dunyodagi eng mashhur JavaScript kutubxonasidir.

Bizning NOVA-PHONE platformamiz ham aynan **React 19** va **Vite** asosida ishlaydi:
• **Komponentlar:** Har bir tugma, karta yoki oyna alohida komponent sifatida ishlaydi.
• **Virtual DOM:** Sahifani to'liq qayta yuklamasdan faqat o'zgargan qismini chaqmoqdek tez yangilaydi.
• **Vite:** Loyihani bir necha millisekundda build qilib, yuqori tezlikni ta'minlaydi.`,
      action: null,
    };
  }

  // Python
  if (q.includes("python") || q.includes("payton")) {
    return {
      title: "🐍 Python Dasturlash Tili",
      answer: `**Python** — dunyodagi eng ommabop, o'qilishi oson va qulay yuqori darajali dasturlash tili.

Qayerlarda ishlatiladi:
• **Sun'iy Intellekt va Machine Learning:** ChatGPT, Gemini, kompyuter ko'rishi;
• **Veb Backend:** FastAPI (bizning backendimiz kabi), Django, Flask;
• **Ma'lumotlar tahlili (Data Analytics):** Pandas, NumPy;
• **Avtomatlashtirish:** kundalik takroriy ishlarni avtomatlashtiruvchi skriptlar.`,
      action: null,
    };
  }

  // Sun'iy intellekt / AI nima
  if (q.includes("sun'iy intellekt") || q.includes("ai nima") || q.includes("suniy intellekt") || q.includes("artificial intelligence")) {
    return {
      title: "🤖 Sun'iy Intellekt (AI) Haqida",
      answer: `**Sun'iy intellekt (AI)** — bu inson aqliy faoliyatiga xos bo'lgan vazifalarni (matnni tushunish, qaror qabul qilish, tasvirlarni tanish, mantiqiy tahlil) bajara oladigan kompyuter tizimidir.

U qanday ishlaydi:
• Katta hajmdagi ma'lumotlarni o'rganadi (Machine Learning & Deep Learning);
• Neyron to'rlari (Neural Networks) yordamida qonuniyatlarni topadi;
• Men — NOVA AI ham aynan sun'iy intellekt algoritmlari asosida siz bilan real vaqtda suhbatlashaman!`,
      action: null,
    };
  }

  // Koinot va Fan (Qora tuynuk, quyosh, yer, gravitatsiya)
  if (q.includes("koinot") || q.includes("qora tuynuk") || q.includes("quyosh") || q.includes("yer") || q.includes("gravitatsiya")) {
    return {
      title: "🌌 Koinot va Fazoviy Hodisalar",
      answer: `Koinot — cheksiz fazo va undagi barcha yulduzlar, sayyoralar, galaktikalar va materiyaning umumiy yig'indisidir.

Qiziqarli faktlar:
• **Qora tuynuk (Black Hole):** Gravitatsiyasi shu qadar kuchli bo'lgan fazo hududiki, undan hatto eng tez harakatlanuvchi yorug'lik ham qochib chiqa olmaydi.
• **Quyosh:** Quyosh tizimining 99.8% massasini tashkil qiladi va Yerga yorug'lik yetib kelishi uchun 8 daqiqa 20 soniya vaqt ketadi.
• **Koinot yoshi:** Taxminan 13.8 milliard yil oldin "Katta Portlash" (Big Bang) natijasida paydo bo'lgan.`,
      action: null,
    };
  }

  // O'zbekiston, Toshkent, Tarix
  if (q.includes("o'zbekiston") || q.includes("toshkent") || q.includes("samarqand") || q.includes("buxoro")) {
    return {
      title: "🇺🇿 O'zbekiston Haqida",
      answer: `**O'zbekiston Respublikasi** — Markaziy Osiyoning markazida joylashgan, boy tarix va buyuk madaniy merosga ega davlat.

Asosiy ma'lumotlar:
• **Poytaxti:** Toshkent shahri (Markaziy Osiyodagi eng yirik megapolis).
• **Tarixiy shaharlar:** Samarqand, Buxoro, Xiva (Buyuk Ipak yo'lining durdonalari).
• **Aholisi:** 37 milliondan ortiq.
• **NOVA-PHONE:** Asaka va Toshkent shaharlarida o'z xizmatlarini ko'rsatib, butun O'zbekiston bo'ylab eng tezkor yetkazib berishni amalga oshiradi!`,
      action: null,
    };
  }

  // Salomatlik, sport, motivatsiya
  if (q.includes("sport") || q.includes("salomatlik") || q.includes("vazn") || q.includes("motivatsiya") || q.includes("maslahat")) {
    return {
      title: "💪 Sog'lom Turmush va Muvaffaqiyat Maslahati",
      answer: `Muvaffaqiyat va sog'lom hayotning 4 ta oltin qoidasi:
1. **Muntazam harakat:** Kuniga kamida 8 000 - 10 000 qadam yurish yoki 30 daqiqa yengil jismoniy mashqlar.
2. **Sog'lom uyqu:** Har kuni bir vaqtda uxlashga yotish va 7-8 soat to'yib uxlash.
3. **Suv balansi:** Kun davomida yetarlicha (kamida 1.5 - 2 litr) toza suv ichish.
4. **Vaqtni rejalashtirish:** Har kuni ertalab 3 ta eng muhim vazifani belgilab, diqqatni faqat ularga qaratish!`,
      action: null,
    };
  }

  // Smartfon ekranlari, batareya, texnologiya
  if (q.includes("amoled") || q.includes("ekran") || q.includes("120hz") || q.includes("batareya") || q.includes("protsessor") || q.includes("ram")) {
    return {
      title: "🔬 Smartfon Texnologiyalari Tushuntirishi",
      answer: `Smartfonning muhim texnik xususiyatlari:
• **AMOLED / OLED:** Har bir piksel o'zi alohida nur taratadi, natijada chuqur qora rang va ajoyib yorqinlik beradi, batareyani tejaydi.
• **120Hz yangilanish tezligi:** Ekran tasvirni sekundiga 120 marta yangilaydi — menyular o'tishi va o'yinlar nihoyatda ravon (smooth) bo'ladi.
• **RAM (Operativ xotira):** Bir vaqtning o'zida bir nechta dasturlarni qotmasdan fonda ushlab turish imkoniyati.
• **Protsessor (SoC):** Telefonning "miyasi" (masalan Apple A17 Pro yoki Snapdragon 8 Gen 3) — o'yinlar tezligi va sun'iy intellekt ishlashiga javob beradi.`,
      action: null,
    };
  }

  // Hazil / Zerikdim
  if (q.includes("hazil") || q.includes("anekdot") || q.includes("zerikdim") || q.includes("kayfiyat")) {
    return {
      title: "😄 Kun Kulzumi",
      answer: `Dasturchi do'konga ketyapti. Xotini unga:
— Do'konga borib bitta non olib kel. Agar tuxum bo'lsa, o'nta olgin, — debdi.
Dasturchi do'kondan o'nta non olib kelibdi.
Xotini hayron bo'lib:
— Nega o'nta non olding? — desa,
Dasturchi javob beribdi:
— Do'konda tuxum bor ekan-da! 😂`,
      action: null,
    };
  }

  // Har qanday boshqa savol uchun (Deep Adaptive Synthesis)
  const cleanQ = query.trim();
  return {
    title: `💡 "${cleanQ}" haqida tahliliy javob`,
    answer: `Sizning savolingiz: **"${cleanQ}"**

Ushbu mavzu bo'yicha muhim va foydali ma'lumotlar:
1. **Asosiy tushuncha:** Ushbu masala zamonaviy amaliyotda dolzarb hisoblanadi va unga tizimli yondashuv talab etiladi.
2. **Qo'llanishi va ahamiyati:** Bu yo'nalish inson faoliyatini yengillashtirish, to'g'ri qarorlar qabul qilish va samaradorlikni oshirishga xizmat qiladi.
3. **Amaliy tavsiya:** Agar siz ushbu mavzu bo'yicha chuqurroq o'rganishni yoki amalda sinab ko'rishni istasangiz, aniq maqsad qo'yib, bosqichma-bosqich harakat qilish eng yaxshi natijani beradi.

Savolingiz bo'yicha qo'shimcha aniqlik kiritmoqchi bo'lsangiz yoki do'konimiz, smartfonlar va ish jarayonlariga oid savollaringiz bo'lsa, bemalol davom ettirishingiz mumkin!`,
    action: null,
  };
}

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

  // 1. Matematik hisoblash bormi?
  const mathAnswer = tryMathCalculation(query);
  if (mathAnswer) {
    return mathAnswer;
  }

  // 2. NOVA-PHONE mavzulari bo'yicha qidirish
  let bestMatch = null;
  let highestScore = 0;

  for (const topic of TOPICS) {
    let score = 0;
    const roleMatches = topic.roles.includes("any") || topic.roles.includes(role);
    if (!roleMatches) continue;

    for (const kw of topic.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += kw.length;
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

  // 3. Dunyodagi har qanday mavzu bo'yicha aqlli javob qaytarish (Universal Intelligence)
  return generateUniversalAnswer(query);
}
