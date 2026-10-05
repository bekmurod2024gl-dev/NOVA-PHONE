import { useLocale } from "../context/LocaleContext";
import "./LanguageSwitcher.css";

const LANGUAGES = [
  { code: "uz", label: "UZ", name: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "RU", name: "Русский", flag: "🇷🇺" },
  { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
];

export default function LanguageSwitcher({ className = "", compact = false }) {
  const { lang, setLang } = useLocale();

  return (
    <div className={`nova-lang-switcher ${compact ? "compact" : ""} ${className}`.trim()} role="group" aria-label="Til tanlash">
      {LANGUAGES.map((item) => {
        const isActive = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            className={`nova-lang-btn ${isActive ? "active" : ""}`}
            onClick={() => setLang(item.code)}
            title={item.name}
            aria-pressed={isActive}
          >
            <span className="nova-lang-flag">{item.flag}</span>
            <span className="nova-lang-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
