import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";
import DealCard from "./DealCard";
import DealFilters from "./DealFilters";
import { DealGridSkeleton } from "../common/Skeleton/Skeleton";
import {
  DEAL_AVAILABILITY,
  extractDealBrands,
  extractDealRetailers,
} from "../../utils/deal";

const PAGE_SIZE = 12;

function DealIndex({ deals = [], loading = false, error = "", onRetry }) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [retailer, setRetailer] = useState("");
  const [discount, setDiscount] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("newest");
  const [showExpired, setShowExpired] = useState(false);
  const [page, setPage] = useState(1);

  const brands = useMemo(() => extractDealBrands(deals), [deals]);
  const retailers = useMemo(() => extractDealRetailers(deals), [deals]);
  const categories = useMemo(
    () =>
      [...new Set(deals.map((deal) => deal.productCategory).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [deals],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const discountThreshold = discount ? Number(discount) : null;
    const priceCap = maxPrice ? Number(maxPrice) : null;
    return deals.filter((deal) => {
      if (!showExpired && deal.expired) return false;
      if (brand && deal.brand !== brand) return false;
      if (category && deal.productCategory !== category) return false;
      if (retailer && deal.retailer !== retailer) return false;
      if (availability && deal.availability !== availability) return false;
      if (
        discountThreshold !== null &&
        (deal.discountPercentage === null ||
          deal.discountPercentage < discountThreshold)
      ) {
        return false;
      }
      if (
        priceCap !== null &&
        (deal.salePrice === null ||
          deal.salePrice === undefined ||
          deal.salePrice > priceCap)
      ) {
        return false;
      }
      if (
        term &&
        ![
          deal.name,
          deal.brand,
          deal.model,
          deal.colorway,
          deal.retailer,
          deal.productCategory,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      ) {
        return false;
      }
      return true;
    });
  }, [deals, search, brand, category, retailer, discount, maxPrice, availability, showExpired]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "discount") {
      list.sort(
        (a, b) =>
          (b.discountPercentage ?? -1) - (a.discountPercentage ?? -1),
      );
    } else if (sort === "priceLow") {
      list.sort(
        (a, b) =>
          (a.salePrice ?? a.originalPrice ?? Number.POSITIVE_INFINITY) -
          (b.salePrice ?? b.originalPrice ?? Number.POSITIVE_INFINITY),
      );
    } else if (sort === "priceHigh") {
      list.sort(
        (a, b) =>
          (b.salePrice ?? b.originalPrice ?? -1) -
          (a.salePrice ?? a.originalPrice ?? -1),
      );
    } else if (sort === "endingSoon") {
      list.sort((a, b) => {
        const aTime = a.expiration ? a.expiration.getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.expiration ? b.expiration.getTime() : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      });
    } else {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
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

  const hasFilters =
    search.trim() ||
    brand ||
    category ||
    retailer ||
    discount ||
    maxPrice ||
    availability;

  const filters = { search, brand, category, retailer, discount, maxPrice, availability, sort };
  const change = (key, value) => {
    if (key === "search") setSearch(value);
    if (key === "brand") setBrand(value);
    if (key === "category") setCategory(value);
    if (key === "retailer") setRetailer(value);
    if (key === "discount") setDiscount(value);
    if (key === "maxPrice") setMaxPrice(value);
    if (key === "availability") setAvailability(value);
    if (key === "sort") setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setBrand("");
    setCategory("");
    setRetailer("");
    setDiscount("");
    setMaxPrice("");
    setAvailability("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div>
      <DealFilters
        filters={filters}
        onChange={change}
        brands={brands}
        categories={categories}
        retailers={retailers}
        availabilities={DEAL_AVAILABILITY}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-black uppercase tracking-wide text-black/60">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={(event) => {
              setShowExpired(event.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 accent-[#080808]"
          />
          Include expired
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-black/55">
          {sorted.length} {sorted.length === 1 ? "deal" : "deals"}
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
            ? "Loading deals"
            : error
              ? "Unable to load deals"
              : `${pageItems.length} of ${sorted.length} deals shown`}
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
          <DealGridSkeleton count={8} />
        ) : !pageItems.length ? (
          <div className="py-20 text-center">
            <p className="text-lg font-black">
              {hasFilters || showExpired
                ? "No deals match your filters."
                : "No deals published yet."}
            </p>
            <p className="mt-2 text-sm text-black/55">
              {hasFilters
                ? "Try a different search term or clear the filters."
                : "Deals will appear here as they are published."}
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
              {pageItems.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-12 flex items-center justify-between border-t border-black/15 pt-5"
                aria-label="Deals pagination"
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

export default DealIndex;
