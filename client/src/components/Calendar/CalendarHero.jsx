import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { optimizeImage } from "../../utils/image";

function CalendarHero({ spotlight, loading = false }) {
  if (loading) {
    return (
      <section className="bg-[#050505]" aria-label="Loading release calendar">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <div className="h-3 w-44 animate-pulse rounded bg-white/15" />
          <div className="mt-6 h-14 w-1/2 max-w-md animate-pulse rounded bg-white/15" />
          <div className="mt-6 h-3 w-1/3 max-w-sm animate-pulse rounded bg-white/15" />
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="h-5 w-2/3 animate-pulse rounded bg-white/15" />
            <div className="aspect-[4/3] animate-pulse bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,#29201c_0%,#0b0a0a_35%,#050505_72%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1600px] px-5 py-14 sm:px-10 sm:py-20 lg:py-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
          SoleVerse release calendar
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
          Release Calendar
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
          {spotlight
            ? "Every drop on the horizon, curated by the SoleVerse team. Track release dates, pricing and availability so you never miss the sneakers you want."
            : "Every drop on the horizon, curated by the SoleVerse team. Release dates, pricing and availability for the sneakers you care about — all in one place."}
        </p>

        {spotlight && (
          <div className="mt-12 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="border-t border-white/15 pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50">
                Upcoming spotlight
              </p>
              {spotlight.releaseDate && (
                <p className="mt-4 inline-flex items-center gap-2 bg-[#eee0c9] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-black">
                  <FiCalendar size={13} aria-hidden="true" />
                  {spotlight.releaseDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                {spotlight.name}
              </h2>
              {(spotlight.brand || spotlight.model || spotlight.colorway) && (
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {[spotlight.brand, spotlight.model, spotlight.colorway]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {spotlight.price && (
                  <span className="text-3xl font-black tracking-[-0.03em] text-[#eee0c9]">
                    {spotlight.price}
                  </span>
                )}
                {spotlight.region && (
                  <span className="text-sm font-semibold uppercase tracking-wide text-white/50">
                    {spotlight.region}
                  </span>
                )}
                {spotlight.availability && (
                  <span className="border border-white/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white/70">
                    {spotlight.availability}
                  </span>
                )}
              </div>
              <Link
                to={`/calendar/${spotlight.id}`}
                className="mt-8 inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
              >
                View release <FiArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            {spotlight.image && (
              <div className="flex items-end justify-center">
                <img
                  src={optimizeImage(spotlight.image, 900)}
                  alt={spotlight.name}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full max-w-[340px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default CalendarHero;
