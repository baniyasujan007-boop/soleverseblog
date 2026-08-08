import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { optimizeImage } from "../../utils/image";

const dateParts = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
    dateTime: date.toISOString(),
  };
};

function UpcomingReleaseSidebar({ releases = [] }) {
  const upcoming = releases.slice(0, 5);
  if (!upcoming.length) return null;

  return (
    <aside className="bg-[#0a0b0b] px-5 py-7 sm:px-7 lg:border-l lg:border-white/10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em]">
          Upcoming releases
        </h2>
        <Link
          to="/releases"
          className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9]"
        >
          View calendar <FiArrowRight className="ml-1 inline" aria-hidden="true" />
        </Link>
      </div>

      <div>
        {upcoming.map((release) => {
          const parts = dateParts(release.metadata?.releaseDate);
          return (
            <Link
              key={release._id}
              to={`/release/${release.slug || release._id}`}
              className="group flex items-center gap-3 border-t border-white/10 py-3 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              {parts ? (
                <time
                  dateTime={parts.dateTime}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded border border-white/20 text-center leading-none"
                >
                  <span className="text-[9px] font-bold">{parts.month}</span>
                  <strong className="text-lg">{parts.day}</strong>
                </time>
              ) : (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded border border-white/20 text-[9px] font-black uppercase tracking-widest text-white/40">
                  Soon
                </span>
              )}
              <span className="min-w-0 flex-1">
                <b className="block truncate text-xs leading-5">{release.title}</b>
                <small className="mt-1 block text-[10px] text-white/55">
                  {release.metadata?.brand || release.category || "SoleVerse"}
                </small>
              </span>
              {release.image && (
                <img
                  src={optimizeImage(release.image, 120)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-14 shrink-0 object-contain opacity-80 transition-opacity group-hover:opacity-100"
                />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default UpcomingReleaseSidebar;
