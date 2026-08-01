import "./TopBar.css";
import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function TopBar() {
  const [settings, setSettings] = useState(null);
  useEffect(() => { api.get("/cms/public/homepage").then(({ data }) => setSettings(data.data.settings.homepage.breakingNews)).catch(() => setSettings(null)); }, []);
  const headline = settings?.headline || settings?.text;
  if (!settings?.enabled || !headline) return null;
  return <div style={{ backgroundColor: settings.backgroundColor || "#f4f0e8", color: settings.textColor || "#111" }} className="overflow-hidden"><div className="mx-auto flex max-w-[1600px] items-center justify-center gap-3 px-4 py-2 text-xs sm:px-10"><span className="shrink-0 rounded-full bg-black px-2 py-0.5 text-[9px] font-black text-white">{settings.badge || "NEW"}</span><a href={settings.link || "#"} className="min-w-0 overflow-hidden whitespace-nowrap"><span style={{ animationDuration: `${Math.max(settings.speed || 28, 8)}s` }} className={`inline-block ${settings.animation === "static" ? "" : "animate-[ticker_28s_linear_infinite]"}`}>{headline}&nbsp;&nbsp; →</span></a></div></div>;
}
