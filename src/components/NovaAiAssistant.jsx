import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionUser, getCurrentRole, getUserDisplayName } from "../utils/userStorage";
import { askNovaAI, getRoleSuggestions } from "../utils/aiKnowledgeEngine";
import "./NovaAiAssistant.css";

export default function NovaAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [profile, setProfile] = useState(() => {
    const user = getSessionUser();
    const currentRole = getCurrentRole() || "guest";
    const name = user ? getUserDisplayName(user) : "Mehmon";
    return { name, role: currentRole };
  });

  useEffect(() => {
    const syncProfile = () => {
      const user = getSessionUser();
      const currentRole = getCurrentRole() || "guest";
      const name = user ? getUserDisplayName(user) : "Mehmon";
      setProfile({ name, role: currentRole });
    };
    window.addEventListener("nova_profile_updated", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("nova_profile_updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const role = profile.role;
  const displayName = profile.name;

  // Boshlang'ich tabrik xabari
  useEffect(() => {
    let initialGreeting = "";
    if (role === "admin") {
      initialGreeting = `Assalomu alaykum, hurmatli Admin (${displayName})! 🛡️\nMen sizning NOVA-PHONE tizim bo'yicha shaxsiy AI maslahatchingizman. Yangi mahsulotlar qo'shish, xodimlar, mijozlar va savdolar boshqaruvi bo'yicha savollaringiz bo'lsa, bemalol so'rang!`;
    } else if (role === "manager") {
      initialGreeting = `Assalomu alaykum, Menejer (${displayName})! 💼\nMen sizga buyurtmalar nazorati, ombor qoldiqlari, savdolar va mijozlar sharhlari bilan ishlashda yordam beraman.`;
    } else if (role === "user") {
      initialGreeting = `Assalomu alaykum, ${displayName}! 🛍️\nNOVA-PHONE smartfonlar do'koniga xush kelibsiz! Qaysi telefon modelini qidiryapsiz yoki qanday yordam kerak?`;
    } else {
      initialGreeting = `Assalomu alaykum! NOVA-PHONE onlayn do'koniga xush kelibsiz 🤖✨.\nSaytdan ro'yxatdan o'tish, telefonlar narxi yoki yetkazib berish bo'yicha savollaringiz bo'lsa, xizmatingizdaman.`;
    }

    setMessages([
      {
        id: "init-1",
        sender: "assistant",
        title: "🤖 NOVA AI Maslahatchi",
        text: initialGreeting,
        action: null,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [role, displayName]);

  // Avtomatik pastga aylantirish (Scroll to bottom)
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Chat ochilganda inputga fokus berish
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // AI o'ylash va javob berish simulyatsiyasi (350-500ms)
    setTimeout(() => {
      const response = askNovaAI({
        query,
        role,
        userName: displayName,
        currentPath: location.pathname,
      });

      const aiMsg = {
        id: "ai-" + Date.now(),
        sender: "assistant",
        title: response.title,
        text: response.answer,
        action: response.action,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "clear-" + Date.now(),
        sender: "assistant",
        title: "✨ Suhbat yangilandi",
        text: "Suhbat tarixi tozalandi. Sizga qanday yordam bera olaman?",
        action: null,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleActionClick = (path) => {
    if (path) {
      navigate(path);
      // Agar mobil qurilma bo'lsa, chatni minimallashtirish
      if (window.innerWidth < 640) {
        setIsMinimized(true);
      }
    }
  };

  const suggestions = getRoleSuggestions(role, location.pathname);

  // Rolga qarab etiketka (Badge)
  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return <span className="nova-ai-role-badge admin">Admin AI</span>;
      case "manager":
        return <span className="nova-ai-role-badge manager">Menejer AI</span>;
      case "user":
        return <span className="nova-ai-role-badge user">Mijoz AI</span>;
      default:
        return <span className="nova-ai-role-badge guest">Mehmon</span>;
    }
  };

  return (
    <div className="nova-ai-wrapper">
      {/* Chat Dialog oynasi */}
      {isOpen && !isMinimized && (
        <div className="nova-ai-window" role="dialog" aria-label="NOVA AI Chat">
          {/* Header */}
          <div className="nova-ai-header">
            <div className="nova-ai-header-info">
              <div className="nova-ai-avatar">🤖</div>
              <div className="nova-ai-title-wrap">
                <div className="nova-ai-title-row">
                  <span className="nova-ai-title">NOVA AI Yordamchi</span>
                  {getRoleBadge()}
                </div>
                <div className="nova-ai-status">
                  <span className="nova-ai-status-indicator"></span>
                  <span>Har doim onlayn</span>
                </div>
              </div>
            </div>

            <div className="nova-ai-header-actions">
              <button
                type="button"
                className="nova-ai-action-btn"
                title="Suhbatni tozalash"
                onClick={handleClearChat}
              >
                🔄
              </button>
              <button
                type="button"
                className="nova-ai-action-btn"
                title="Kichraytirish"
                onClick={() => setIsMinimized(true)}
              >
                ➖
              </button>
              <button
                type="button"
                className="nova-ai-action-btn"
                title="Yopish"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Xabarlar qismi */}
          <div className="nova-ai-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`nova-msg-row ${msg.sender}`}>
                <div className="nova-msg-avatar">
                  {msg.sender === "assistant" ? "✨" : "👤"}
                </div>
                <div className="nova-msg-bubble">
                  {msg.title && <div className="nova-msg-title">{msg.title}</div>}
                  <div className="nova-msg-text">{msg.text}</div>

                  {msg.action && (
                    <button
                      type="button"
                      className="nova-msg-action-btn"
                      onClick={() => handleActionClick(msg.action.path)}
                    >
                      <span>👉</span> {msg.action.label}
                    </button>
                  )}

                  <div className="nova-msg-time">{msg.time}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="nova-msg-row assistant">
                <div className="nova-msg-avatar">✨</div>
                <div className="nova-msg-bubble">
                  <div className="nova-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Tezkor takliflar (Suggestions) */}
          <div className="nova-ai-chips-container">
            <div className="nova-ai-chips-title">
              <span>💡</span> Tezkor savollar:
            </div>
            <div className="nova-ai-chips-list">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="nova-chip-btn"
                  onClick={() => handleSendMessage(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input va Yuborish Formasi */}
          <div className="nova-ai-footer">
            <form className="nova-ai-form" onSubmit={handleFormSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="nova-ai-input"
                placeholder="Savolingizni bu yerga yozing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="nova-ai-send-btn"
                title="Yuborish"
                disabled={!input.trim() || isTyping}
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Suzuvchi Pastki Tugma (Floating Button) */}
      <button
        type="button"
        className="nova-ai-trigger"
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false);
            setIsOpen(true);
          } else {
            setIsOpen((prev) => !prev);
          }
        }}
        aria-label="NOVA AI yordamchini ochish"
      >
        <div className="nova-ai-icon-pulse">
          <span>✨</span>
          <span className="nova-ai-pulse-dot"></span>
        </div>
        <div className="nova-ai-label">
          <span className="nova-ai-label-title">NOVA AI</span>
          <span className="nova-ai-label-subtitle">
            {role === "admin"
              ? "Admin yordamchi"
              : role === "manager"
              ? "Menejer yordamchi"
              : "Savol bering"}
          </span>
        </div>
      </button>
    </div>
  );
}
