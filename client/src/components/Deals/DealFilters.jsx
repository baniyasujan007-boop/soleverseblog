const DISCOUNT_OPTIONS = [
  { value: "", label: "Any discount" },
  { value: "10", label: "10%+ off" },
  { value: "20", label: "20%+ off" },
  { value: "30", label: "30%+ off" },
  { value: "40", label: "40%+ off" },
  { value: "50", label: "50%+ off" },
];

const MAX_PRICE_OPTIONS = [
  { value: "", label: "Any price" },
  { value: "100", label: "Under $100" },
  { value: "200", label: "Under $200" },
  { value: "300", label: "Under $300" },
  { value: "500", label: "Under $500" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Biggest discount" },
  { value: "priceLow", label: "Lowest price" },
  { value: "priceHigh", label: "Highest price" },
  { value: "endingSoon", label: "Ending soon" },
];

function DealFilters({
  filters,
  onChange,
  brands = [],
  categories = [],
  retailers = [],
  availabilities = [],
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
      <label
        className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55"
        aria-label="Search deals"
      >
        Search
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search deals, brands, models…"
          className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808]"
        />
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
        Brand
        <select
          value={filters.brand}
          onChange={(event) => onChange("brand", event.target.value)}
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
        Category
        <select
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
          className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          <option value="">All categories</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
        Retailer
        <select
          value={filters.retailer}
          onChange={(event) => onChange("retailer", event.target.value)}
          className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          <option value="">All retailers</option>
          {retailers.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
        Discount
        <select
          value={filters.discount}
          onChange={(event) => onChange("discount", event.target.value)}
          className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          {DISCOUNT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
        Max price
        <select
          value={filters.maxPrice}
          onChange={(event) => onChange("maxPrice", event.target.value)}
          className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          {MAX_PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
        Availability
        <select
          value={filters.availability}
          onChange={(event) => onChange("availability", event.target.value)}
          className="border-b border-black/15 bg-transparent py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          <option value="">Any</option>
          {availabilities.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
        Sort
        <select
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
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
  );
}

export default DealFilters;
