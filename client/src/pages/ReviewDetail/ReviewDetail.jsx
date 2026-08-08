import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiMinus } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import ReviewCard from "../../components/Reviews/ReviewCard";
import ReviewScoreBars from "../../components/Reviews/ReviewScoreBars";
import Newsletter from "../../components/Newsletter/Newsletter";
import { ReviewGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { normalizeReview, splitLines } from "../../utils/review";
import { optimizeImage } from "../../utils/image";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/content/public/review/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data?.data) {
          setError("Review not found");
          return;
        }
        setError("");
        setLoadError("");
        setReview(normalizeReview(data.data));
      })
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        if (requestError.response?.status === 404) {
          setError("Review not found");
          return;
        }
        setLoadError("Unable to load this review right now.");
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!review) return;
    document.title = `${review.model || review.name} — SoleVerse Review`;
    return () => {
      document.title = "SoleVerse";
    };
  }, [review]);

  useEffect(() => {
    if (!review) return;
    const controller = new AbortController();
    api
      .get("/content/public/review", {
        params: { limit: 20 },
        signal: controller.signal,
      })
      .then(({ data }) => {
        const others = data.data
          .filter((item) => item._id !== id)
          .map(normalizeReview);
        const sameBrand = others.filter((item) => item.brand === review.brand);
        setRelated([...sameBrand, ...others.filter((item) => item.brand !== review.brand)].slice(0, 3));
      })
      .catch(() => setRelated([]))
      .finally(() => {
        if (!controller.signal.aborted) setRelatedLoading(false);
      });
    return () => controller.abort();
  }, [id, review]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/reviews"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} /> Back to reviews
          </Link>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{loadError}</h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              Try again
            </button>
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              <FiArrowLeft size={14} /> Back to reviews
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 sm:px-10">
        <Link
          to="/reviews"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/55 transition hover:text-black"
        >
          <FiArrowLeft size={14} /> Reviews
        </Link>
        <div className="mt-10">
          <ReviewGridSkeleton count={2} />
        </div>
      </main>
    );
  }

  const pros = splitLines(review.pros);
  const cons = splitLines(review.cons);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <article>
        <header className="relative overflow-hidden bg-[#050505] text-white">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,#29201c_0%,#0b0a0a_35%,#050505_72%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1600px] px-5 py-14 sm:px-10 sm:py-20 lg:py-24">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> All reviews
            </Link>
            {review.brand && (
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
                {review.brand} review
              </p>
            )}
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
              {review.model || review.name}
            </h1>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-[11px] uppercase tracking-wide text-white/50">
              {review.reviewer && (
                <div>
                  <dt className="text-white/40">Reviewer</dt>
                  <dd className="mt-1 font-black text-white">{review.reviewer}</dd>
                </div>
              )}
              {review.reviewDate && (
                <div>
                  <dt className="text-white/40">Published</dt>
                  <dd className="mt-1 font-black text-white">
                    <time
                      dateTime={
                        !Number.isNaN(new Date(review.reviewDate).getTime())
                          ? new Date(review.reviewDate).toISOString()
                          : undefined
                      }
                    >
                      {formatDate(review.reviewDate)}
                    </time>
                  </dd>
                </div>
              )}
              {review.retailPrice && (
                <div>
                  <dt className="text-white/40">Retail</dt>
                  <dd className="mt-1 font-black text-white">{review.retailPrice}</dd>
                </div>
              )}
              {review.overall !== null && (
                <div>
                  <dt className="text-white/40">Overall rating</dt>
                  <dd className="mt-1 font-black text-[#eee0c9]">
                    {review.overall.toFixed(1)} / 10
                  </dd>
                </div>
              )}
            </dl>
            {review.image && (
              <div className="mt-12 flex justify-center lg:justify-end">
                <img
                  src={optimizeImage(review.image, 900)}
                  alt={review.name}
                  decoding="async"
                  className="w-full max-w-[420px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
                />
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-12">
              {review.quickSummary && (
                <section aria-label="Quick summary">
                  <p className="border-l-2 border-black pl-5 text-xl font-bold leading-7 tracking-[-0.02em] sm:text-2xl sm:leading-8">
                    {review.quickSummary}
                  </p>
                </section>
              )}

              {(pros.length > 0 || cons.length > 0) && (
                <section className="grid gap-6 sm:grid-cols-2" aria-label="Pros and cons">
                  {pros.length > 0 && (
                    <div className="border border-black/10 bg-white p-6">
                      <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                        Pros
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {pros.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm leading-6 text-black/80">
                            <FiCheck
                              className="mt-1 shrink-0 text-black"
                              size={15}
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cons.length > 0 && (
                    <div className="border border-black/10 bg-white p-6">
                      <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                        Cons
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {cons.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm leading-6 text-black/80">
                            <FiMinus
                              className="mt-1 shrink-0 text-black/60"
                              size={15}
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {review.verdict && (
                <section aria-label="Verdict">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">Verdict</h2>
                  <div className="mt-5 whitespace-pre-line text-lg leading-8 text-black/80">
                    {review.verdict}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              {review.overall !== null && (
                <section aria-label="Overall rating" className="border border-black/10 bg-white p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-wide text-black/60">
                        Overall
                      </p>
                      <p className="mt-1 text-6xl font-black tracking-[-0.05em]">
                        {review.overall.toFixed(1)}
                        <span className="text-lg font-black text-black/40">/10</span>
                      </p>
                    </div>
                  </div>
                  <ReviewScoreBars ratings={review.ratings} className="mt-6" />
                </section>
              )}

              <section aria-label="Specifications" className="border border-black/10 bg-white p-6">
                <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                  Specifications
                </h2>
                <dl className="mt-4 divide-y divide-black/10 text-sm">
                  {[
                    ["Brand", review.brand],
                    ["Model", review.model],
                    ["Colorway", review.colorway],
                    ["Reviewer", review.reviewer],
                    ["Retail price", review.retailPrice],
                    ["Weight", review.weight],
                    ["Best for", review.bestFor],
                  ]
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                          {label}
                        </dt>
                        <dd className="text-right font-semibold text-black">{value}</dd>
                      </div>
                    ))}
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <h2 className="text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              More Reviews
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ReviewCard key={item.id} review={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedLoading && related.length === 0 && !error && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <h2 className="text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              More Reviews
            </h2>
            <div className="mt-8">
              <ReviewGridSkeleton count={3} />
            </div>
          </div>
        </section>
      )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default ReviewDetail;
