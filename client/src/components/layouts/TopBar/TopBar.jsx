import "./TopBar.css";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function TopBar() {
  const [settings, setSettings] = useState(null);
  useEffect(() => { api.get("/cms/public/homepage").then(({ data }) => setSettings(data.data.settings.homepage.breakingNews)).catch(() => setSettings(null)); }, []);
  if (!settings?.enabled || !settings.text) return null;
  return <div style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }} className="overflow-hidden"><div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-xs font-semibold sm:px-6"><span className="shrink-0 rounded bg-red-600 px-2 py-1 text-[10px] font-black text-white">BREAKING</span><div className="min-w-0 overflow-hidden whitespace-nowrap"><p style={{ animationDuration: `${Math.max(settings.speed || 28, 8)}s` }} className="inline-block animate-[ticker_28s_linear_infinite]">{settings.text}</p></div></div></div>;
}
