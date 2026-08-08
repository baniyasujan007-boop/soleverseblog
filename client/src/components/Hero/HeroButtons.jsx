import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const isExternal = (href) => /^https?:\/\//i.test(href);

function HeroButtons({ hero, settings = {} }) {
  const details = hero?.metadata || {};
  const primaryHref =
    (details.primaryCtaLink || "").trim() ||
    (hero?.slug ? `/release/${hero.slug}` : "");
  const primaryLabel = (details.primaryCtaText || "").trim() || "Explore now";
  const secondaryHref = (details.secondaryCtaLink || "").trim() || "";
  const secondaryLabel =
    (details.secondaryCtaText || "").trim() || "View release info";

  const renderCta = ({ href, label, variant }) => {
    if (!href || !label) return null;
    const base =
      "inline-flex items-center gap-2 px-5 py-3.5 text-xs font-black uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]";
    const isPrimary = variant === "primary";
    const className = isPrimary
      ? `${base} bg-[#eee0c9] text-black hover:brightness-110`
      : `${base} border border-white/45 text-white hover:bg-white/10`;
    const style = isPrimary
      ? { backgroundColor: settings.primaryCtaColor || "#eee0c9" }
      : {
          color: settings.secondaryCtaColor || "#ffffff",
          borderColor: settings.secondaryCtaColor || "#ffffff",
        };
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" style={style} className={className}>
          {label}
          {isPrimary && <FiArrowRight aria-hidden="true" />}
        </a>
      );
    }
    return (
      <Link to={href} style={style} className={className}>
        {label}
        {isPrimary && <FiArrowRight aria-hidden="true" />}
      </Link>
    );
  };

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      {renderCta({ href: primaryHref, label: primaryLabel, variant: "primary" })}
      {renderCta({
        href: secondaryHref,
        label: secondaryLabel,
        variant: "secondary",
      })}
    </div>
  );
}

export default HeroButtons;
