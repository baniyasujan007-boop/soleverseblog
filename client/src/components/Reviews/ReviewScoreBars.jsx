import { motion, useReducedMotion } from "framer-motion";
import { RATING_FIELDS } from "../../utils/review";

function ReviewScoreBars({ ratings = {}, className = "" }) {
  const prefersReduced = useReducedMotion();
  const rated = RATING_FIELDS.filter(
    (field) => ratings[field.name] !== null && ratings[field.name] !== undefined,
  );
  if (!rated.length) return null;

  return (
    <div className={className}>
      <ul className="space-y-4">
        {rated.map((field) => {
          const score = ratings[field.name];
          const width = `${Math.min(Math.max(score, 0), 10) * 10}%`;
          return (
            <li key={field.name}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[11px] font-black uppercase tracking-wide text-black/60">
                  {field.label}
                </span>
                <span className="text-sm font-black text-black">{score.toFixed(1)}</span>
              </div>
              <div className="mt-2 h-2 bg-black/10">
                {prefersReduced ? (
                  <div className="h-full bg-black" style={{ width }} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    whileInView={{ opacity: 1, width }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-black"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ReviewScoreBars;
