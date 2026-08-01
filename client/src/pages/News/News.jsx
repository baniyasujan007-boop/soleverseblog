import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import NewsCard from "../../components/LatestNews/NewsCard";
import SectionTitle from "../../components/common/SectionTitle/SectionTitle";
import api from "../../api/axios";

export default function News() {
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
          params: { search, page, limit: 9, sort: "newest", status: "published" },
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
        <SectionTitle title="All Stories" />

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
          <p className="py-20 text-center text-sm text-black/55" aria-live="polite">Loading news…</p>
        ) : error ? null : !articles.length ? (
          <p className="py-20 text-center text-sm text-black/55">No published articles found.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => <NewsCard key={article._id} article={article} />)}
          </div>
        )}

        {meta.totalPages > 1 && !error && (
          <nav className="mt-12 flex items-center justify-between border-t border-black/15 pt-5" aria-label="News pagination">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiArrowLeft aria-hidden="true" />
              Previous
            </button>
            <span className="text-xs font-semibold text-black/55" aria-live="polite">
              Page {page} of {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={page === meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
              <FiArrowRight aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
