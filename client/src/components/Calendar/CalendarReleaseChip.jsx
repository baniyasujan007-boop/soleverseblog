import { Link } from "react-router-dom";
import { optimizeImage } from "../../utils/image";

function CalendarReleaseChip({ release }) {
  return (
    <Link
      to={`/calendar/${release.id}`}
      className="group mt-1 flex items-center gap-1.5 bg-[#f1f0ec] px-1.5 py-1 text-left transition hover:bg-[#080808] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
      title={`${release.name} — view release`}
    >
      {release.image ? (
        <img
          src={optimizeImage(release.image, 200)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-5 w-5 shrink-0 rounded-sm bg-white object-contain p-0.5"
        />
      ) : (
        <span className="h-5 w-5 shrink-0 rounded-sm bg-white/60" aria-hidden="true" />
      )}
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-bold leading-tight">
          {release.name}
        </span>
        {release.brand && release.brand !== "SoleVerse" && (
          <span className="block truncate text-[8px] font-semibold uppercase leading-tight tracking-wide opacity-60">
            {release.brand}
          </span>
        )}
      </span>
    </Link>
  );
}

export default CalendarReleaseChip;
