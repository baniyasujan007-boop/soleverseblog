import Card from "../common/Card/Card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { optimizeImage } from "../../utils/image";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

function NewsCard({ article }) {
  const prefersReduced = usePrefersReducedMotion();
  const publishedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const inner = (
    <Link
      to={`/article/${article._id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2"
    >
      <Card className="relative h-full rounded border border-black/10 bg-black text-white shadow-none">
        <img
          src={optimizeImage(article.image, 900)}
          alt={article.title}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-14">
          <span className="rounded bg-[#eee0c9] px-2 py-1 text-[9px] font-black uppercase text-black">
            {article.category || "Sneaker news"}
          </span>

          <h3 className="mt-2 text-base font-bold leading-5">{article.title}</h3>

          <p className="mt-3 text-[11px] text-white/60">
            {publishedDate} &nbsp;•&nbsp; {article.readTime || "4 min read"}
          </p>
        </div>
      </Card>
    </Link>
  );

  if (prefersReduced) return inner;
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
    >
      {inner}
    </motion.div>
  );
}

export default NewsCard;
