import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import Card from "../common/Card/Card";
import { optimizeImage } from "../../utils/image";

function BrandCard({ brand, stats = {} }) {
  const prefersReduced = useReducedMotion();
  const inner = (
    <Link
      to={`/brand/${brand.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative grid aspect-[4/3] place-items-center bg-[#f1f0ec] p-6">
          {brand.image ? (
            <img
              src={optimizeImage(brand.image, 800)}
              alt={`${brand.name} logo`}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-2xl font-black tracking-[-0.04em] text-black/25">
              {brand.name}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-bold leading-5 tracking-[-0.02em] text-black">
              {brand.name}
            </h3>
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor: brand.primaryColor || "#080808",
              }}
              aria-hidden="true"
            />
          </div>
          {(brand.country || brand.founded) && (
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-black/45">
              {[brand.country, brand.founded ? `Est. ${brand.founded}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {brand.shortDescription && (
            <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-black/60">
              {brand.shortDescription}
            </p>
          )}
          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-black/50">
              {stats.reviews || 0} reviews · {stats.releases || 0} releases
            </p>
            <span className="inline-flex items-center gap-2 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white transition group-hover:bg-[#eee0c9] group-hover:text-black">
              Explore <FiArrowRight size={12} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
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

export default BrandCard;
