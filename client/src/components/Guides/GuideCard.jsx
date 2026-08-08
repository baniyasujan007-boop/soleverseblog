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

function GuideCard({ guide }) {
  const prefersReduced = useReducedMotion();
  const inner = (
    <Link
      to={`/guide/${guide.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-2"
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded border border-black/10 bg-white shadow-none transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f0ec]">
          {guide.image ? (
            <img
              src={optimizeImage(guide.image, 800)}
              alt={guide.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-black/25">
                {guide.category || "SoleVerse"}
              </span>
            </div>
          )}
          {guide.difficulty && (
            <span className="absolute right-3 top-3 z-10 bg-black px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-white">
              {guide.difficulty}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/50">
            {guide.category || "Guide"}
          </p>
          <h3 className="mt-2 line-clamp-2 text-base font-bold leading-5 tracking-[-0.02em] text-black">
            {guide.name}
          </h3>
          {guide.summary && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/60">
              {guide.summary}
            </p>
          )}
          <div className="mt-auto space-y-1 pt-4">
            {(guide.brand || guide.model) && (
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-black/45">
                {[guide.brand, guide.model].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
              {[formatDate(guide.publishedDate), guide.readingTime]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <span className="mt-3 inline-flex items-center justify-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition group-hover:bg-[#eee0c9] group-hover:text-black">
            Read Guide <FiArrowRight size={13} aria-hidden="true" />
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

export default GuideCard;
