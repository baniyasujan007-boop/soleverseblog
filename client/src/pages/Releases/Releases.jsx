import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import api from "../../api/axios";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReleaseHero from "../../components/Releases/ReleaseHero";
import Newsletter from "../../components/Newsletter/Newsletter";
import { ReleaseGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { normalizeRelease } from "../../utils/release";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Title A–Z" },
  { value: "za", label: "Title Z–A" },
];

const GRID_CLASSES = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

function Releases() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroRelease, setHeroRelease] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [newsletterSettings, setNewsletterSettings] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/content/public/release", {
        params: { featured: true, limit: 1 },
        signal: controller.signal,
      })
      .then(({ data }) =>
        setHeroRelease(data.data[0] ? normalizeRelease(data.data[0]) : null),
      )
      .catch(() => setHeroRelease(null))
      .finally(() => setHeroLoading(false));
    api
      .get("/cms/public/homepage")
      .then(({ data }) =>
        setNewsletterSettings(data.data.settings?.homepage?.newsletter || {}),
      )
      .catch(() => setNewsletterSettings({}));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/content/public/release", {
          params: { search, sort, page, limit: 12 },
          signal: controller.signal,
        });
        setItems(data.data);
        setMeta({
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
        });
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load releases right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, sort, page, reloadKey]);

  const releases = useMemo(() => items.map(normalizeRelease), [items]);
  const hasSearch = search.trim().length > 0;

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <ReleaseHero release={heroRelease} loading={heroLoading} />

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Release watch
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Latest Releases
            </h2>
            <p className="mt-2 text-sm text-black/55">
              {meta.total} releases across the SoleVerse calendar.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div role="search" className="relative sm:w-72">
              <label htmlFor="release-search" className="sr-only">
                Search releases
              </label>
              <FiSearch
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-lg text-black/40"
                aria-hidden="true"
              />
              <input
                id="release-search"
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search releases"
                className="w-full border-b border-black/15 bg-transparent py-3 pl-8 pr-8 text-sm font-medium outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#080808] [&::-webkit-search-cancel-button]:hidden"
              />
              {hasSearch && (
                <button
                  type="button"
                  onClick={() => changeSearch("")}
                  aria-label="Clear search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-black/50 transition hover:text-black"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wide text-black/55">
              <span>Sort</span>
              <select
                value={sort}
                onChange={(event) => changeSort(event.target.value)}
                aria-label="Sort releases"
                className="border-b border-black/15 bg-transparent py-3 text-xs font-bold uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div aria-busy={loading}>
          <p className="sr-only" role="status">
            {loading
              ? "Loading releases"
              : error
                ? "Unable to load releases"
                : `${releases.length} of ${meta.total} releases shown`}
          </p>
          {error ? (
            <div
              role="alert"
              className="mt-8 border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-2 text-xs font-black uppercase tracking-wide text-red-900 underline underline-offset-2 transition hover:opacity-55"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="mt-8">
              <ReleaseGridSkeleton count={6} />
            </div>
          ) : !releases.length ? (
            <div className="py-20 text-center">
              <p className="text-lg font-black">
                {hasSearch ? "No releases match your search." : "No releases yet."}
              </p>
              <p className="mt-2 text-sm text-black/55">
                {hasSearch
                  ? "Try a different term to discover more from SoleVerse."
                  : "New releases will appear here as they are published."}
              </p>
              {hasSearch && (
                <button
                  type="button"
                  onClick={() => changeSearch("")}
                  className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
                >
                  <FiX size={14} /> Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={GRID_CLASSES + " mt-8"}>
                {releases.map((release) => (
                  <ReleaseCard
                    key={release.id}
                    release={release}
                    variant="grid"
                  />
                ))}
              </div>

              {meta.totalPages > 1 && (
                <nav
                  className="mt-12 flex items-center justify-between border-t border-black/15 pt-5"
                  aria-label="Releases pagination"
                >
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <FiArrowLeft aria-hidden="true" /> Previous
                  </button>
                  <span
                    className="text-xs font-semibold text-black/55"
                    aria-live="polite"
                  >
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next <FiArrowRight aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default Releases;
