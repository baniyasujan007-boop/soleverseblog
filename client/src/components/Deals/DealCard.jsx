import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import { optimizeImage } from "../../utils/image";
import { formatDealPrice, getDealUrl } from "../../utils/deal";

const formatShortDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function DealCard({ deal }) {
  const prefersReduced = useReducedMotion();
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

  const inner = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f0ec]">
        <Link
          to={`/deal/${deal.id}`}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#080808]"
          aria-label={`View deal details for ${deal.name}`}
        >
          {deal.image ? (
            <img
              src={optimizeImage(deal.image, 800)}
              alt={deal.name}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105 ${
                deal.expired ? "opacity-60 saturate-50" : ""
              }`}
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-black/25">
                {deal.brand || "SoleVerse"}
              </span>
            </div>
          )}
        </Link>
        {!deal.expired &&
          deal.discountPercentage !== null &&
          deal.discountPercentage > 0 && (
            <span className="absolute left-3 top-3 z-10 bg-[#eee0c9] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-black">
              {deal.discountPercentage}% OFF
            </span>
          )}
        {deal.expired && (
          <span className="absolute left-3 top-3 z-10 bg-black px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
            Expired
          </span>
        )}
        {deal.availability && !deal.expired && (
          <span className="absolute right-3 top-3 z-10 bg-black px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-white">
            {deal.availability}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/50">
          {deal.brand || deal.productCategory || "Deal"}
        </p>
        <Link
          to={`/deal/${deal.id}`}
          className="mt-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
        >
          <h3 className="line-clamp-2 text-base font-bold leading-5 tracking-[-0.02em] text-black transition group-hover:underline">
            {deal.name}
          </h3>
        </Link>
        {(deal.model || deal.colorway) && (
          <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
            {[deal.model, deal.colorway].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {salePrice && (
            <p className="text-xl font-black tracking-[-0.03em] text-black">
              {salePrice}
            </p>
          )}
          {showOriginal && (
            <p className="text-sm font-semibold text-black/40 line-through">
              {originalPrice}
            </p>
          )}
          {!salePrice && originalPrice && (
            <p className="text-xl font-black tracking-[-0.03em] text-black">
              {originalPrice}
            </p>
          )}
        </div>

        {(deal.retailer || deal.expiration) && (
          <p className="mt-3 truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
            {deal.retailer}
            {deal.retailer && deal.expiration ? " · " : ""}
            {deal.expiration
              ? `${deal.expired ? "Expired" : "Ends"} ${formatShortDate(deal.expiration)}`
              : ""}
          </p>
        )}

        <div className="mt-auto pt-4">
          {deal.expired ? (
            <span className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 bg-black/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-black/40">
              Deal Expired
            </span>
          ) : url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
            >
              Get Deal <FiExternalLink size={13} aria-hidden="true" />
            </a>
          ) : (
            <Link
              to={`/deal/${deal.id}`}
              className="inline-flex w-full items-center justify-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
            >
              View Deal
            </Link>
          )}
        </div>
      </div>
    </article>
  );

  if (prefersReduced) return inner;
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
    >
      {inner}
    </motion.div>
  );
}

export default DealCard;
