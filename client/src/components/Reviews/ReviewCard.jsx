import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import Card from "../common/Card/Card";
import { optimizeImage } from "../../utils/image";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function ReviewCard({ review }) {
  const prefersReduced = useReducedMotion();
  const inner = (
    <Link
      to={`/review/${review.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f0ec]">
          {review.image ? (
            <img
              src={optimizeImage(review.image, 800)}
              alt={review.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-black/25">
                {review.brand || "SoleVerse"}
              </span>
            </div>
          )}
          {review.overall !== null && (
            <div className="absolute right-3 top-3 z-10 grid h-12 w-12 place-items-center rounded-full bg-black text-center leading-none text-white">
              <span className="text-lg font-black">{review.overall.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/50">
            {review.brand || "SoleVerse"}
          </p>
          <h3 className="mt-2 line-clamp-2 text-base font-bold leading-5 tracking-[-0.02em] text-black">
            {review.model || review.name}
          </h3>
          <div className="mt-auto space-y-1 pt-4">
            {(review.reviewer || review.reviewDate) && (
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
                {[review.reviewer, formatDate(review.reviewDate)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            {review.retailPrice && (
              <p className="text-sm font-black text-black">{review.retailPrice}</p>
            )}
          </div>
          <span className="mt-3 inline-flex items-center justify-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition group-hover:bg-[#eee0c9] group-hover:text-black">
            Read Review <FiArrowRight size={13} aria-hidden="true" />
          </span>
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

export default ReviewCard;
