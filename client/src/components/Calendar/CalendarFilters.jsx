import { FiSearch, FiX } from "react-icons/fi";

const EMPTY = "";

function CalendarFilters({
  filters,
  onChange,
  onClear,
  brands = [],
  categories = [],
  types = [],
  regions = [],
  resultCount,
  view,
  onViewChange,
  hasFilters,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 border border-black/15 bg-white p-1" role="group" aria-label="Calendar view">
          {[
            { value: "collection", label: "Collection" },
            { value: "grid", label: "Calendar" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onViewChange(option.value)}
              aria-pressed={view === option.value}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] ${
                view === option.value
                  ? "bg-black text-white"
                  : "text-black/55 hover:text-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-black/55">
            {resultCount} {resultCount === 1 ? "release" : "releases"}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/50 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
            >
              <FiX size={13} aria-hidden="true" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <FiSearch
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
          size={16}
          aria-hidden="true"
        />
        <label className="sr-only" htmlFor="calendar-search">
          Search releases
        </label>
        <input
          id="calendar-search"
          type="search"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search brand, model, colorway, region…"
          className="w-full border border-black/15 bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808]"
        />
      </div>

      <div
        className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0"
        role="group"
        aria-label="Filter by brand"
      >
        <div className="flex w-max items-center gap-2">
          <button
            type="button"
            onClick={() => onChange("brand", EMPTY)}
            aria-pressed={filters.brand === EMPTY}
            className={`shrink-0 border px-4 py-2 text-[10px] font-black uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] ${
              filters.brand === EMPTY
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white text-black/55 hover:border-black hover:text-black"
            }`}
          >
            All
          </button>
          {brands.map((brand) => {
            const active = filters.brand === brand;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => onChange("brand", active ? EMPTY : brand)}
                aria-pressed={active}
                className={`shrink-0 border px-4 py-2 text-[10px] font-black uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-white text-black/55 hover:border-black hover:text-black"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {[
          {
            key: "category",
            label: "Category",
            options: categories,
            value: filters.category,
          },
          {
            key: "type",
            label: "Release type",
            options: types,
            value: filters.type,
          },
          {
            key: "region",
            label: "Region",
            options: regions,
            value: filters.region,
          },
          {
            key: "availability",
            label: "Availability",
            options: ["Upcoming", "Available"],
            value: filters.availability,
          },
          {
            key: "sort",
            label: "Sort",
            options: [
              "Soonest release",
              "Latest release",
              "Price: low to high",
              "Price: high to low",
            ],
            value: filters.sort,
          },
        ].map((field) => (
          <label
            key={field.key}
            className="flex flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55"
          >
            {field.label}
            <select
              value={field.value}
              onChange={(event) => onChange(field.key, event.target.value)}
              className="border-b border-black/15 bg-transparent py-3 text-sm font-medium text-black outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
            >
              <option value={EMPTY}>
                {field.key === "sort" ? "Featured order" : "Any"}
              </option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}

export default CalendarFilters;
