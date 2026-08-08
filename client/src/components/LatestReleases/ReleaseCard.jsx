import Card from "../common/Card/Card";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { optimizeImage } from "../../utils/image";

const dateBadge = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
    dateTime: date.toISOString(),
  };
};

function ReleaseCard({ release, variant = "compact" }) {
  const prefersReduced = useReducedMotion();

  if (variant === "grid") {
    const badge = dateBadge(release.releaseDate);
    const inner = (
      <Link
        to={`/release/${release.id}`}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
      >
        <Card className="relative flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f0ec]">
            {release.image ? (
              <img
                src={optimizeImage(release.image, 800)}
                alt={release.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-black/25">
                  {release.brand || "SoleVerse"}
                </span>
              </div>
            )}
            {badge && (
              <time
                dateTime={badge.dateTime}
                className="absolute right-3 top-3 z-10 grid h-12 w-12 place-items-center rounded bg-black text-center leading-none text-white"
              >
                <span className="text-[8px] font-bold tracking-wide text-white/70">
                  {badge.month}
                </span>
                <span className="text-lg font-black">{badge.day}</span>
              </time>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/50">
              {release.brand || "SoleVerse"}
            </p>
            <h3 className="mt-2 line-clamp-2 text-base font-bold leading-5 tracking-[-0.02em] text-black">
              {release.name}
            </h3>
            <div className="mt-auto space-y-1 pt-4">
              {(release.colorway || release.region) && (
                <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
                  {[release.colorway, release.region].filter(Boolean).join(" · ")}
                </p>
              )}
              {release.price && (
                <p className="text-sm font-black text-black">{release.price}</p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
    if (prefersReduced) return inner;
    return (
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <Link
      to={`/release/${release.id}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
    >
      <Card className="h-full overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex flex-col h-full">
          <img
            src={optimizeImage(release.image, 500)}
            alt={release.name}
            loading="lazy"
            decoding="async"
            className="h-28 w-full object-contain p-2 sm:h-36"
          />

          <div className="flex flex-col flex-1 p-3 pt-1 sm:p-4 sm:pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/50">
              {release.brand}
            </p>

            <h3 className="mt-1 text-sm font-bold leading-5 line-clamp-2">
              {release.name}
            </h3>

            {release.price && <p className="mt-2 text-xs font-semibold text-black">{release.price}</p>}
            <p className="mt-3 text-[10px] text-black/50">{release.releaseDate ? new Date(release.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Coming soon"}</p>
            <span className="mt-3 bg-black py-2 text-center text-[9px] font-bold uppercase text-white">View details</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ReleaseCard;
