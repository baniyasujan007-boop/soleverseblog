import { Link } from "react-router-dom";

function SectionTitle({
  title,
  action,
  to = "#",
  kicker,
  variant = "default",
  tone = "light",
  rule = false,
  className = "",
}) {
  if (variant === "editorial") {
    const isDark = tone === "dark";
    return (
      <div
        className={`flex items-end justify-between ${
          rule
            ? `border-t pt-10 ${isDark ? "border-white/10" : "border-black/15"}`
            : ""
        } ${className}`}
      >
        <div>
          {kicker && (
            <p
              className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                isDark ? "text-white/50" : "text-black/50"
              }`}
            >
              {kicker}
            </p>
          )}
          <h2
            className={`mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {title}
          </h2>
        </div>

        {action && (
          <Link
            to={to}
            className={`shrink-0 text-xs font-black uppercase tracking-wide transition hover:opacity-55 ${
              isDark ? "text-white/85" : "text-black/80"
            }`}
          >
            {action}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mb-5 flex items-center justify-between border-b border-black/15 pb-4">
      <h2 className="text-lg font-black uppercase tracking-[-.035em]">{title}</h2>

      {action && (
        <Link
          to={to}
          className="text-xs font-semibold text-black transition hover:opacity-55"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export default SectionTitle;
