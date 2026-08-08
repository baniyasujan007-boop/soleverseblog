import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import ReviewCard from "../../components/Reviews/ReviewCard";
import ReviewHero from "../../components/Reviews/ReviewHero";
import ReviewFilters from "../../components/Reviews/ReviewFilters";
import Newsletter from "../../components/Newsletter/Newsletter";
import { ReviewGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { extractBrands, normalizeReview } from "../../utils/review";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "rating", label: "Top rated" },
  { value: "az", label: "Model A–Z" },
];

const GRID_CLASSES = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
const PAGE_SIZE = 12;

function Reviews() {
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};
  const [heroReview, setHeroReview] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/content/public/review", {
        params: { featured: true, limit: 1 },
        signal: controller.signal,
      })
      .then(({ data }) =>
        setHeroReview(data.data[0] ? normalizeReview(data.data[0]) : null),
      )
      .catch(() => setHeroReview(null))
      .finally(() => setHeroLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/content/public/review", {
          params: { limit: 100 },
          signal: controller.signal,
        });
        setAllReviews(data.data.map(normalizeReview));
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load reviews right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [reloadKey]);

  const brands = useMemo(() => extractBrands(allReviews), [allReviews]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const minRating = rating ? Number(rating) : null;
    return allReviews.filter((review) => {
      if (
        term &&
        ![review.brand, review.model, review.name, review.summary, review.reviewer]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      ) {
        return false;
      }
      if (brand && review.brand !== brand) return false;
      if (minRating !== null && review.overall !== null && review.overall < minRating)
        return false;
      return true;
    });
  }, [allReviews, search, brand, rating]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "oldest") {
      list.sort(
        (a, b) => new Date(a.reviewDate || 0) - new Date(b.reviewDate || 0),
      );
    } else if (sort === "rating") {
      list.sort(
        (a, b) => (b.overall ?? -1) - (a.overall ?? -1),
      );
    } else if (sort === "az") {
      list.sort((a, b) => (a.model || "").localeCompare(b.model || ""));
    } else {
      list.sort(
        (a, b) => new Date(b.reviewDate || 0) - new Date(a.reviewDate || 0),
      );
    }
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageReviews = useMemo(
    () => sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [sorted, currentPage],
  );

  const topRated = useMemo(() => {
    const list = [...allReviews]
      .filter((review) => review.overall !== null)
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 6);
    return heroReview ? list.filter((review) => review.id !== heroReview.id) : list;
  }, [allReviews, heroReview]);

  const editorChoice = useMemo(() => {
    const featured = allReviews.filter((review) => review.featured);
    return heroReview ? featured.filter((review) => review.id !== heroReview.id) : featured;
  }, [allReviews, heroReview]);

  const hasFilters = search.trim() || brand || rating;

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeBrand = (value) => {
    setBrand(value);
    setPage(1);
  };

  const changeRating = (value) => {
    setRating(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setBrand("");
    setRating("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <ReviewHero review={heroReview} loading={heroLoading} />

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Review desk
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Latest Reviews
            </h2>
            <p className="mt-2 text-sm text-black/55">
              {sorted.length} reviews across the SoleVerse desk.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wide text-black/55">
              <span>Sort</span>
              <select
                value={sort}
                onChange={(event) => changeSort(event.target.value)}
                aria-label="Sort reviews"
                className="border-b border-black/15 bg-transparent py-3 text-xs font-bold uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 rounded border border-black/10 bg-white p-5 sm:p-6">
          <ReviewFilters
            brands={brands}
            search={search}
            brand={brand}
            rating={rating}
            onSearch={changeSearch}
            onBrand={changeBrand}
            onRating={changeRating}
            onClear={clearFilters}
          />
        </div>

        <div aria-busy={loading} className="mt-8">
          <p className="sr-only" role="status">
            {loading
              ? "Loading reviews"
              : error
                ? "Unable to load reviews"
                : `${pageReviews.length} of ${sorted.length} reviews shown`}
          </p>
          {error ? (
            <div
              role="alert"
              className="mt-8 border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-2 text-xs font-black uppercase tracking-wide text-red-900 underline underline-offset-2 transition hover:opacity-55"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <ReviewGridSkeleton count={6} />
          ) : !pageReviews.length ? (
            <div className="py-20 text-center">
              <p className="text-lg font-black">
                {hasFilters ? "No reviews match your filters." : "No reviews yet."}
              </p>
              <p className="mt-2 text-sm text-black/55">
                {hasFilters
                  ? "Try different keywords or clear the filters to browse the archive."
                  : "Reviews will appear here as they are published."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
                >
                  <FiX size={14} /> Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={GRID_CLASSES}>
                {pageReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-between border-t border-black/15 pt-5"
                  aria-label="Reviews pagination"
                >
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <FiArrowLeft aria-hidden="true" /> Previous
                  </button>
                  <span
                    className="text-xs font-semibold text-black/55"
                    aria-live="polite"
                  >
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next <FiArrowRight aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {topRated.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="flex items-end justify-between border-t border-black/15 pt-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                Scoreboard
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                Top Rated Reviews
              </h2>
            </div>
          </div>
          <div className={`${GRID_CLASSES} mt-8`}>
            {topRated.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {editorChoice.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="flex items-end justify-between border-t border-black/15 pt-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                Editorial
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                Editor&apos;s Choice
              </h2>
            </div>
          </div>
          <div className={`${GRID_CLASSES} mt-8`}>
            {editorChoice.map((review, index) => (
              <div key={review.id} className="relative">
                <span className="pointer-events-none absolute -left-1 -top-6 z-10 text-5xl font-black text-black/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </section>
      )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default Reviews;
