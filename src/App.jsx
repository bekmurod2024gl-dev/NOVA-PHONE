import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { LocaleProvider } from "./context/LocaleContext";
import { useEffect } from "react";

function AppInner() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nova_settings_v1");
      if (saved) {
        const settings = JSON.parse(saved);
        const accent = settings?.appearance?.accent;
        if (accent) document.documentElement.style.setProperty("--accent", accent);
      }
    } catch {}
  }, []);

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

function App() {
  return (
    <LocaleProvider>
      <AppInner />
    </LocaleProvider>
  );
}

export default App;