import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import GuideCard from "./GuideCard";
import { GuideGridSkeleton } from "../common/Skeleton/Skeleton";
import {
  DIFFICULTY_LEVELS,
  extractGuideBrands,
  extractGuideCategories,
} from "../../utils/guide";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Title A–Z" },
];

const PAGE_SIZE = 12;

function GuideIndex({ guides = [], loading = false, error = "", onRetry }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => extractGuideCategories(guides), [guides]);
  const brands = useMemo(() => extractGuideBrands(guides), [guides]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return guides.filter((guide) => {
      if (category && guide.category !== category) return false;
      if (brand && guide.brand !== brand) return false;
      if (difficulty && guide.difficulty !== difficulty) return false;
      if (
        term &&
        ![guide.name, guide.category, guide.brand, guide.model, guide.guideType, guide.summary]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      ) {
        return false;
      }
      return true;
    });
  }, [guides, search, category, brand, difficulty]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "oldest") {
      list.sort(
        (a, b) => new Date(a.publishedDate || 0) - new Date(b.publishedDate || 0),
      );
    } else if (sort === "az") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      list.sort(
        (a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0),
      );
    }
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [sorted, currentPage],
  );

  const hasFilters = search.trim() || category || brand || difficulty;
  const change = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setDifficulty("");
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => change(setSearch)(event.target.value)}
            placeholder="Search guides, brands, models…"
            className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808]"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Brand
          <select
            value={brand}
            onChange={(event) => change(setBrand)(event.target.value)}
            className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
          >
            <option value="">All brands</option>
            {brands.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Difficulty
          <select
            value={difficulty}
            onChange={(event) => change(setDifficulty)(event.target.value)}
            className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
          >
            <option value="">All levels</option>
            {DIFFICULTY_LEVELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Sort
          <select
            value={sort}
            onChange={(event) => change(setSort)(event.target.value)}
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

      <div
        className="mt-6 flex flex-wrap items-center gap-2"
        aria-label="Guide categories"
      >
        <button
          type="button"
          onClick={() => change(setCategory)("")}
          aria-pressed={category === ""}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wide transition ${
            category === ""
              ? "bg-black text-white"
              : "border border-black/15 text-black/70 hover:bg-black hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => change(setCategory)(option)}
            aria-pressed={category === option}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-wide transition ${
              category === option
                ? "bg-black text-white"
                : "border border-black/15 text-black/70 hover:bg-black hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-black/55">
          {sorted.length} {sorted.length === 1 ? "guide" : "guides"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/50 transition hover:text-black"
          >
            <FiX size={13} aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      <div aria-busy={loading} className="mt-6">
        <p className="sr-only" role="status">
          {loading
            ? "Loading guides"
            : error
              ? "Unable to load guides"
              : `${pageItems.length} of ${sorted.length} guides shown`}
        </p>
        {error ? (
          <div
            role="alert"
            className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-black uppercase tracking-wide text-red-900 underline underline-offset-2 transition hover:opacity-55"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <GuideGridSkeleton count={8} />
        ) : !pageItems.length ? (
          <div className="py-20 text-center">
            <p className="text-lg font-black">
              {hasFilters
                ? "No guides match your filters."
                : "No guides published yet."}
            </p>
            <p className="mt-2 text-sm text-black/55">
              {hasFilters
                ? "Try a different search term or clear the filters."
                : "Guides will appear here as they are published."}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-12 flex items-center justify-between border-t border-black/15 pt-5"
                aria-label="Guides pagination"
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
    </div>
  );
}

export default GuideIndex;
