import "./TopBar.css";
import { useHomepage } from "../../../context/HomepageContext";

export default function TopBar() {
  const { data } = useHomepage();
  const settings = data?.settings?.homepage?.breakingNews;
  const headline = settings?.headline || settings?.text;
  if (!settings?.enabled || !headline) return null;
  const isTicker = settings.animation !== "static";
  return (
    <div
      style={{
        backgroundColor: settings.backgroundColor || "#050505",
        color: settings.textColor || "#ffffff",
      }}
      className="overflow-hidden border-b border-white/10"
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2 text-xs sm:px-10">
        <span className="shrink-0 rounded-full bg-[#eee0c9] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-black">
          {settings.badge || "NEW"}
        </span>
        <a
          href={settings.link || "#"}
          className="topbar-link min-w-0 flex-1 overflow-hidden whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current"
        >
          <span
            style={{ animationDuration: `${Math.max(settings.speed || 28, 8)}s` }}
            className={`topbar-track ${isTicker ? "topbar-track-animate" : ""}`}
          >
            {headline}&nbsp;&nbsp;→
          </span>
        </a>
      </div>
    </div>
  );
}
