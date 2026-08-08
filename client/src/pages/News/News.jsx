import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import NewsCard from "../../components/LatestNews/NewsCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import Card from "../../components/common/Card/Card";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const excerpt = (content = "") =>
  content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

function NewsSkeleton() {
  return (
    <div className="mt-8 animate-pulse" aria-label="Loading news">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,1fr)]">
        <div className="h-[26rem] bg-black/10 sm:h-[34rem]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="h-48 bg-black/10" />
          <div className="h-48 bg-black/10" />
        </div>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-64 bg-black/10" />
        ))}
      </div>
    </div>
  );
}

function SecondaryStory({ article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link to={`/article/${article._id}`} className="group block h-full">
        <Card className="h-full rounded border border-black/10 bg-white shadow-none">
          {article.image ? (
            <div className="overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-40 bg-black/10" />
          )}
          <div className="p-4">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-black/55">
              {article.category || "News"}
            </span>
            <h3 className="mt-2 text-lg font-black leading-5 tracking-[-0.035em] transition group-hover:text-black/60">
              {article.title}
            </h3>
            <p className="mt-3 text-xs text-black/55">{formatDate(article.createdAt)}</p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function SidebarStory({ article, index }) {
  return (
    <Link
      to={`/article/${article._id}`}
      className="group grid grid-cols-[1.75rem_1fr] gap-3 border-b border-black/10 py-4 last:border-0"
    >
      <span className="pt-0.5 text-xs font-black text-black/35">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/50">
          {article.category || "News"}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-5 transition group-hover:translate-x-1 group-hover:text-black/55">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

export default function News() {
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/articles", {
          params: { search, page, limit: 12, sort: "newest", status: "published" },
          signal: controller.signal,
        });
        setArticles(data.data);
        setMeta(data);
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setArticles([]);
        setMeta({ totalPages: 1 });
        setError("Unable to load news right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, page]);

  const { primaryArticle, secondaryArticles, gridArticles, sidebarArticles } =
    useMemo(() => {
      const primary = articles.find((article) => article.featured) || articles[0];
      const remaining = articles.filter((article) => article._id !== primary?._id);
      const secondary = remaining.slice(0, 2);
      const grid = remaining.slice(2);
      return {
        primaryArticle: primary,
        secondaryArticles: secondary,
        gridArticles: grid,
        sidebarArticles: remaining.slice(2, 6),
      };
    }, [articles]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <header className="border-b border-white/10 bg-[#050505] text-white">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#e8d8bd]">
            SoleVerse editorial
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl">
            Latest Sneaker News
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
            Discover release announcements, collaborations, and the stories shaping sneaker culture.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
        <label className="relative block border-b border-black/15">
          <FiSearch className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-lg text-black/50" aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search stories"
            aria-label="Search news stories"
            className="w-full bg-transparent py-4 pl-8 pr-4 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808]"
          />
        </label>

        {error && <p className="mt-8 border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}

        {loading ? (
          <NewsSkeleton />
        ) : error ? null : !articles.length ? (
          <div className="py-20 text-center">
            <p className="text-lg font-black">No stories found.</p>
            <p className="mt-2 text-sm text-black/55">Try a different search term to discover more from SoleVerse.</p>
          </div>
        ) : (
          <>
            <section className="mt-8">
              <SectionTitle title="Featured stories" />
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,1fr)]">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <Link to={`/article/${primaryArticle._id}`} className="group relative block min-h-[26rem] overflow-hidden bg-black text-white sm:min-h-[34rem]">
                    {primaryArticle.image ? <img src={primaryArticle.image} alt={primaryArticle.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-85" /> : <div className="absolute inset-0 bg-[#151515]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <span className="bg-[#eee0c9] px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-black">{primaryArticle.category || "News"}</span>
                      <h2 className="mt-4 max-w-3xl text-3xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">{primaryArticle.title}</h2>
                      <p className="mt-4 max-w-2xl line-clamp-2 text-sm leading-6 text-white/70">{excerpt(primaryArticle.content)}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] transition group-hover:gap-3">Read story <FiArrowUpRight aria-hidden="true" /></span>
                    </div>
                  </Link>
                </motion.div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {secondaryArticles.map((article) => <SecondaryStory key={article._id} article={article} />)}
                </div>
              </div>
            </section>

            <div className="mt-14 grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <section>
                <SectionTitle title="More stories" />
                {gridArticles.length ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gridArticles.map((article) => <NewsCard key={article._id} article={article} />)}
                  </div>
                ) : (
                  <p className="py-8 text-sm text-black/55">More stories will appear here as they are published.</p>
                )}
              </section>
              <aside className="border-t border-black/15 pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">From the desk</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em]">Keep reading</h2>
                <div className="mt-3">
                  {sidebarArticles.map((article, index) => <SidebarStory key={article._id} article={article} index={index} />)}
                </div>
                <Card className="mt-6 rounded border border-black/10 bg-black p-5 text-white shadow-none">
                  <FiClock className="text-[#eee0c9]" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold leading-5">New stories are published as sneaker culture moves.</p>
                  <p className="mt-2 text-xs leading-5 text-white/60">Browse the latest reports, release updates, and collaboration coverage.</p>
                </Card>
              </aside>
            </div>
          </>
        )}

        {meta.totalPages > 1 && !loading && !error && (
          <nav className="mt-12 flex items-center justify-between border-t border-black/15 pt-5" aria-label="News pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30">
              <FiArrowLeft aria-hidden="true" /> Previous
            </button>
            <span className="text-xs font-semibold text-black/55" aria-live="polite">Page {page} of {meta.totalPages}</span>
            <button type="button" disabled={page === meta.totalPages} onClick={() => setPage(page + 1)} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30">
              Next <FiArrowRight aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}
