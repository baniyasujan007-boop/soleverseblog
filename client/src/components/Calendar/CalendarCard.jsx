import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
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

function CalendarCard({ release }) {
  const prefersReduced = useReducedMotion();
  const badge = dateBadge(release.releaseDate);

  const inner = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f0ec]">
        <Link
          to={`/calendar/${release.id}`}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#080808]"
        >
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
        </Link>
        {badge && (
          <time
            dateTime={badge.dateTime}
            className="absolute left-3 top-3 z-10 grid h-12 w-12 place-items-center bg-black text-center leading-none text-white"
          >
            <span className="text-[8px] font-bold tracking-wide text-white/70">
              {badge.month}
            </span>
            <span className="text-lg font-black">{badge.day}</span>
          </time>
        )}
        {release.availability && (
          <span className="absolute right-3 top-3 z-10 bg-[#eee0c9] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-black">
            {release.availability}
          </span>
        )}
        {release.today && (
          <span className="absolute bottom-3 left-3 z-10 bg-white px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-black shadow">
            Drops today
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/50">
          {release.brand || "SoleVerse"}
        </p>
        <Link
          to={`/calendar/${release.id}`}
          className="mt-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          <h3 className="line-clamp-2 text-base font-bold leading-5 tracking-[-0.02em] text-black transition group-hover:underline">
            {release.name}
          </h3>
        </Link>
        {(release.model || release.colorway) && (
          <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
            {[release.model, release.colorway].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {release.price && (
            <p className="text-lg font-black tracking-[-0.02em] text-black">
              {release.price}
            </p>
          )}
          {release.releaseType && (
            <span className="border border-black/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-black/60">
              {release.releaseType}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <p className="flex items-center gap-1.5 truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
            <FiCalendar size={11} aria-hidden="true" />
            {release.region || "Worldwide"}
          </p>
          <Link
            to={`/calendar/${release.id}`}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
          >
            View release <FiArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
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

export default CalendarCard;
