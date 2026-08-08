import { useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import BrandCard from "./BrandCard";

const LETTERS = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const firstLetter = (name = "") => {
  const letter = (name.trim().charAt(0) || "").toUpperCase();
  return /[A-Z]/.test(letter) ? letter : "#";
};

function BrandIndex({ brands = [], stats = {} }) {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return brands.filter((brand) => {
      if (letter && firstLetter(brand.name) !== letter) return false;
      if (
        term &&
        ![brand.name, brand.country, brand.headquarters, brand.founder]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      ) {
        return false;
      }
      return true;
    });
  }, [brands, search, letter]);

  const hasFilters = search.trim() || letter;
  const availableLetters = useMemo(
    () => new Set(brands.map((brand) => firstLetter(brand.name))),
    [brands],
  );

  const clearFilters = () => {
    setSearch("");
    setLetter("");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex flex-1 flex-col gap-1.5 text-[11px] font-black uppercase tracking-wide text-black/55">
          Search brands
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-lg text-black/40"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setLetter("");
              }}
              placeholder="Search by name, country, founder…"
              className="w-full border-b border-black/15 bg-transparent py-3 pl-8 pr-8 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-black/50 transition hover:text-black"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </label>
      </div>

      <nav
        className="mt-6 flex flex-wrap gap-1"
        aria-label="Alphabetical brand index"
      >
        {LETTERS.map((item) => {
          const disabled = !availableLetters.has(item);
          const active = letter === item;
          return (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => setLetter(active ? "" : item)}
              className={`h-8 min-w-8 px-2 text-xs font-black tracking-wide transition ${
                active
                  ? "bg-black text-white"
                  : disabled
                    ? "cursor-not-allowed text-black/20"
                    : "text-black/55 hover:bg-[#eee0c9] hover:text-black"
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-black/55">
          {filtered.length} {filtered.length === 1 ? "brand" : "brands"}
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

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              stats={stats[brand.name] || {}}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-black">
            {hasFilters ? "No brands match your filters." : "No brands yet."}
          </p>
          <p className="mt-2 text-sm text-black/55">
            {hasFilters
              ? "Try a different letter or search term."
              : "Brands will appear here as they are published."}
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
      )}
    </div>
  );
}

export default BrandIndex;
