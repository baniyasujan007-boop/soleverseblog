import { Link } from "react-router-dom";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import { optimizeImage } from "../../utils/image";
import { formatDealPrice, getDealUrl } from "../../utils/deal";

const formatLongDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function DealHero({ deal, loading = false }) {
  if (loading) {
    return (
      <section className="bg-[#050505]" aria-label="Loading featured deal">
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

  if (!deal) {
    return (
      <section className="bg-[#050505] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
            SoleVerse deals desk
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl">
            Sneaker Deals
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
            Curated discounts from retailers we trust — vetted by the SoleVerse
            team so you always know you are getting a real deal.
          </p>
        </div>
      </section>
    );
  }

  const url = getDealUrl(deal);
  const salePrice =
    deal.salePrice !== null && deal.salePrice !== undefined
      ? formatDealPrice(deal.salePrice, deal.currency)
      : "";
  const originalPrice =
    deal.originalPrice !== null && deal.originalPrice !== undefined
      ? formatDealPrice(deal.originalPrice, deal.currency)
      : "";
  const showOriginal =
    originalPrice && salePrice && originalPrice !== salePrice;

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,#29201c_0%,#0b0a0a_35%,#050505_72%)]"
        aria-hidden="true"
      />
      <div
        className={`relative mx-auto grid max-w-[1600px] items-center ${
          deal.image ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""
        }`}
      >
        <div className="px-5 py-14 sm:px-10 sm:py-20 lg:py-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
            Featured deal
          </p>
          {(deal.brand || deal.productCategory || deal.retailer) && (
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-white/60">
              {[deal.brand, deal.productCategory, deal.retailer]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
            {deal.name}
          </h1>
          {(deal.model || deal.colorway) && (
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/60">
              {[deal.model, deal.colorway].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {salePrice && !deal.expired && (
              <span className="text-5xl font-black tracking-[-0.04em] text-[#eee0c9]">
                {salePrice}
              </span>
            )}
            {deal.expired && (
              <span className="text-5xl font-black tracking-[-0.04em] text-[#eee0c9]">
                {salePrice || originalPrice}
              </span>
            )}
            {showOriginal && (
              <span className="text-2xl font-semibold text-white/40 line-through">
                {originalPrice}
              </span>
            )}
            {!deal.expired &&
              deal.discountPercentage !== null &&
              deal.discountPercentage > 0 && (
                <span className="bg-[#eee0c9] px-3 py-1.5 text-sm font-black tracking-wide text-black">
                  {deal.discountPercentage}% OFF
                </span>
              )}
            {deal.expired && (
              <span className="bg-white px-3 py-1.5 text-sm font-black uppercase tracking-wide text-black">
                Expired
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!deal.expired && url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
              >
                Get Deal <FiExternalLink size={16} aria-hidden="true" />
              </a>
            ) : deal.expired ? (
              <span className="inline-flex cursor-not-allowed items-center gap-3 bg-white/10 px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white/40">
                Deal Expired
              </span>
            ) : null}
            <Link
              to={`/deal/${deal.id}`}
              className="inline-flex items-center gap-3 border border-white/45 px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
            >
              View Deal <FiArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-[11px] uppercase tracking-wide text-white/50">
            {deal.expiration && (
              <div>
                <dt className="text-white/40">
                  {deal.expired ? "Expired" : "Ends"}
                </dt>
                <dd className="mt-1 font-black text-white">
                  <time dateTime={deal.expiration.toISOString()}>
                    {formatLongDate(deal.expiration)}
                  </time>
                </dd>
              </div>
            )}
            {deal.availability && (
              <div>
                <dt className="text-white/40">Availability</dt>
                <dd className="mt-1 font-black text-white">{deal.availability}</dd>
              </div>
            )}
            {deal.couponCode && !deal.expired && (
              <div>
                <dt className="text-white/40">Coupon</dt>
                <dd className="mt-1 font-black text-[#eee0c9]">{deal.couponCode}</dd>
              </div>
            )}
          </dl>
        </div>
        {deal.image && (
          <div className="flex items-end justify-center px-5 pb-5 sm:px-10 lg:pb-0">
            <img
              src={optimizeImage(deal.image, 900)}
              alt={deal.name}
              fetchPriority="high"
              decoding="async"
              className={`w-full max-w-[360px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)] ${
                deal.expired ? "opacity-60 saturate-50" : ""
              }`}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default DealHero;
