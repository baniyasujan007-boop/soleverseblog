import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Hero({ slides = [], releases = [], settings = {} }) {
  const [current, setCurrent] = useState(0);
  const hero = slides[current];
  useEffect(() => {
    if (slides.length < 2 || settings.autoPlay === false) return undefined;
    const timer = setInterval(
      () => setCurrent((value) => (value + 1) % slides.length),
      Math.max(settings.sliderSpeed || 6000, 1000),
    );
    return () => clearInterval(timer);
  }, [settings.autoPlay, settings.sliderSpeed, slides.length]);
  if (!hero) return null;
  const details = hero.metadata || {};
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="grid gap-8 xl:gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article
          className="
         relativemin-h-[720px]lg:min-h-[760px]overflow-hiddenrounded-[32pxborderborder-slate-200bg-gradient-to-brfrom-whitevia-slate-50to-slate-100p-10g:p-16shadow-2xl
"
        >
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-slate-200 blur-3xl" />
          <div className="absolute right-10 top-6 text-[180px] font-black text-slate-200/30 select-none">
            AIR
          </div>{" "}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(239,68,68,.08),transparent_30%)]" />
          <span
            className="relative text-sm
tracking-[0.35em]
font-black
uppercase font-black uppercase tracking-[.2em] text-red-600"
          >
            {hero.category || "Featured release"}
          </span>
          <div className="relative z-10 max-w-[560px] pt-5 sm:max-w-[560px]">
            <h1
              className="text-5xl
md:text-6xl
xl:text-7xl
leading-[0.9]
tracking-[-0.06em] font-black text-slate-950 "
            >
              {hero.title}
            </h1>
            <p className="mt-5 text-base font-medium leading-7 text-slate-600">
              {hero.summary}
            </p>
            <p className="mt-4 hidden text-sm leading-6 text-slate-500 sm:block">
              {hero.content}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={details.primaryCtaLink || `/release/${hero.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                {details.primaryCtaText || "Explore release"}
                <FiArrowRight />
              </Link>
              <Link
                to={details.secondaryCtaLink || `/release/${hero.slug}`}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900"
              >
                {details.secondaryCtaText || "View details"}
              </Link>
            </div>
          </div>
          <img
            src={hero.image}
            alt={hero.title}
            fetchPriority="high"
            className="absolute bottom-4 right-[-8%] z-[1] w-[66%] max-w-[620px] rotate-[-8deg] object-contain drop-shadow-2xl sm:right-[0]"
          />
          {slides.length > 1 && (
            <>
              <div className="absolute bottom-6 left-10 z-20 flex gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide._id}
                    onClick={() => setCurrent(index)}
                    aria-label={`Show slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${index === current ? "w-7 bg-red-600" : "w-2.5 bg-slate-300"}`}
                  />
                ))}
              </div>
              <div className="absolute right-6 top-6 z-20 flex gap-2">
                <button
                  onClick={() =>
                    setCurrent((current + slides.length - 1) % slides.length)
                  }
                  className="rounded-full bg-white/80 p-2"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => setCurrent((current + 1) % slides.length)}
                  className="rounded-full bg-white/80 p-2"
                >
                  <FiChevronRight />
                </button>
              </div>
            </>
          )}
        </article>
        <aside className="rounded-3xl bg-white p-5 shadow-[0_12px_45px_rgba(15,23,42,.08)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-black">Upcoming Releases</h2>
            <Link
              to="/releases"
              className="text-sm
tracking-[0.35em]
font-black
uppercase font-bold text-red-600"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {releases.slice(0, 5).map((release) => (
              <Link
                key={release._id}
                to={`/release/${release.slug || release._id}`}
                className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50"
              >
                <img
                  src={release.image}
                  alt=""
                  loading="lazy"
                  className="h-14 w-16 rounded-xl object-cover"
                />
                <span className="min-w-0">
                  <b
                    className="block truncate text-sm
tracking-[0.35em]
font-black
uppercase"
                  >
                    {release.title}
                  </b>
                  <small
                    className="mt-1 block text-sm
tracking-[0.35em]
font-black
uppercase font-bold text-red-600"
                  >
                    {release.metadata?.releaseDate
                      ? new Date(
                          release.metadata.releaseDate,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Coming soon"}
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Hero;
