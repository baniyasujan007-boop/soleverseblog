import { FiX } from "react-icons/fi";

const RATING_OPTIONS = [
  { value: "", label: "All ratings" },
  { value: "7", label: "7.0+" },
  { value: "8", label: "8.0+" },
  { value: "9", label: "9.0+" },
];

function ReviewFilters({
  brands = [],
  search = "",
  brand = "",
  rating = "",
  onSearch,
  onBrand,
  onRating,
  onClear,
}) {
  const hasFilters = search.trim().length > 0 || brand || rating;
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search reviews, models, brands…"
            className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808]"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Brand
          <select
            value={brand}
            onChange={(event) => onBrand(event.target.value)}
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
          Rating
          <select
            value={rating}
            onChange={(event) => onRating(event.target.value)}
            className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
          >
            {RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2" aria-label="Brand chips">
        <button
          type="button"
          onClick={() => onBrand("")}
          className={`px-3.5 py-2 text-xs font-black uppercase tracking-wide transition ${
            brand === ""
              ? "bg-black text-white"
              : "border border-black/15 text-black/70 hover:bg-black hover:text-white"
          }`}
        >
          All
        </button>
        {brands.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onBrand(option)}
            className={`px-3.5 py-2 text-xs font-black uppercase tracking-wide transition ${
              brand === option
                ? "bg-black text-white"
                : "border border-black/15 text-black/70 hover:bg-black hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-black uppercase tracking-wide text-black/50 transition hover:text-black"
          >
            <FiX size={13} aria-hidden="true" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewFilters;
