import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { optimizeImage } from "../../utils/image";

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatLongDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function ReviewHero({ review, loading = false }) {
  if (loading) {
    return (
      <section className="bg-[#050505]" aria-label="Loading featured review">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <div className="h-3 w-40 animate-pulse rounded bg-white/15" />
          <div className="mt-6 h-14 w-2/3 max-w-xl animate-pulse rounded bg-white/15" />
          <div className="mt-8 h-3 w-1/2 max-w-sm animate-pulse rounded bg-white/15" />
          <div className="mt-10 flex flex-wrap gap-3">
            <div className="h-12 w-40 animate-pulse bg-[#eee0c9]/30" />
            <div className="h-12 w-32 animate-pulse border border-white/20" />
          </div>
        </div>
      </section>
    );
  }

  if (!review) {
    return (
      <section className="bg-[#050505] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#e8d8bd]">
            SoleVerse editorial
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl">
            Sneaker Reviews
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
            Honest, performance-driven reviews of the shoes worth your money — written by the
            SoleVerse editorial desk.
          </p>
        </div>
      </section>
    );
  }

  const date = parseDate(review.reviewDate);

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,#29201c_0%,#0b0a0a_35%,#050505_72%)]"
        aria-hidden="true"
      />
      <div
        className={`relative mx-auto grid max-w-[1600px] items-center ${
          review.image ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""
        }`}
      >
        <div className="px-5 py-14 sm:px-10 sm:py-20 lg:py-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
            Featured review
          </p>
          {review.brand && (
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-white/60">
              {review.brand}
            </p>
          )}
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
            {review.model || review.name}
          </h1>
          {review.summary && (
            <p className="mt-6 max-w-xl text-[15px] leading-6 text-white/70">
              {review.summary}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={`/review/${review.id}`}
              className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
            >
              Read the review <FiArrowRight size={17} />
            </Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-[11px] uppercase tracking-wide text-white/50">
            {review.overall !== null && (
              <div>
                <dt className="text-white/40">Overall rating</dt>
                <dd className="mt-1 font-black text-white">{review.overall.toFixed(1)} / 10</dd>
              </div>
            )}
            {review.reviewer && (
              <div>
                <dt className="text-white/40">Reviewer</dt>
                <dd className="mt-1 font-black text-white">{review.reviewer}</dd>
              </div>
            )}
            {date && (
              <div>
                <dt className="text-white/40">Published</dt>
                <dd className="mt-1 font-black text-white">
                  <time dateTime={date.toISOString()}>{formatLongDate(date)}</time>
                </dd>
              </div>
            )}
            {review.retailPrice && (
              <div>
                <dt className="text-white/40">Retail</dt>
                <dd className="mt-1 font-black text-white">{review.retailPrice}</dd>
              </div>
            )}
          </dl>
        </div>
        {review.image && (
          <div className="flex items-end justify-center px-5 pb-5 sm:px-10 lg:pb-0">
            <img
              src={optimizeImage(review.image, 900)}
              alt={review.name}
              fetchPriority="high"
              decoding="async"
              className="w-full max-w-[360px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewHero;
