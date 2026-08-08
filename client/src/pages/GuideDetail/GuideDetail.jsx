import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import GuideCard from "../../components/Guides/GuideCard";
import GuideContent from "../../components/Guides/GuideContent";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReviewCard from "../../components/Reviews/ReviewCard";
import NewsCard from "../../components/LatestNews/NewsCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import {
  GuideGridSkeleton,
} from "../../components/common/Skeleton/Skeleton";
import { findReleaseForModel, normalizeGuide, sameBrand } from "../../utils/guide";
import { normalizeRelease } from "../../utils/release";
import { normalizeReview } from "../../utils/review";
import { normalizeBrand } from "../../utils/brand";
import { optimizeImage } from "../../utils/image";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function GuideDetail() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [releases, setReleases] = useState([]);
  const [allBrandReleases, setAllBrandReleases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [relatedBrand, setRelatedBrand] = useState(null);
  const [articles, setArticles] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/content/public/guide/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data?.data) {
          setError("Guide not found");
          return;
        }
        setError("");
        setLoadError("");
        setGuide(normalizeGuide(data.data));
      })
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        if (requestError.response?.status === 404) {
          setError("Guide not found");
          return;
        }
        setLoadError("Unable to load this guide right now.");
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!guide) return;
    document.title = guide.metaTitle || `${guide.name} — SoleVerse Guide`;
    return () => {
      document.title = "SoleVerse";
    };
  }, [guide]);

  useEffect(() => {
    if (!guide) return;
    const controller = new AbortController();
    Promise.all([
      api.get("/content/public/release", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
      api.get("/content/public/review", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
      api.get("/content/public/guide", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
      api.get("/content/public/brand", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
      api.get("/articles", {
        params: { search: guide.brand, limit: 4 },
        signal: controller.signal,
      }),
    ])
      .then(([releaseRes, reviewRes, guideRes, brandRes, articleRes]) => {
        const brandReleases = releaseRes.data.data
          .map(normalizeRelease)
          .filter((item) => sameBrand(item.brand, guide.brand));
        setAllBrandReleases(brandReleases);
        setReleases(brandReleases.slice(0, 3));
        setReviews(
          reviewRes.data.data
            .map(normalizeReview)
            .filter((item) => sameBrand(item.brand, guide.brand))
            .slice(0, 3),
        );
        setRelatedGuides(
          guideRes.data.data
            .map(normalizeGuide)
            .filter(
              (item) =>
                item.id !== guide.id &&
                (sameBrand(item.brand, guide.brand) ||
                  item.category === guide.category),
            )
            .slice(0, 3),
        );
        setRelatedBrand(
          brandRes.data.data
            .map(normalizeBrand)
            .find((item) => sameBrand(item.name, guide.brand)) || null,
        );
        setArticles(articleRes.data.data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setRelatedLoading(false);
      });
    return () => controller.abort();
  }, [guide]);

  const releaseMatches = useMemo(() => {
    const map = {};
    guide?.recommendedModels?.forEach((model) => {
      const match = findReleaseForModel(model, allBrandReleases);
      if (match) map[model] = match;
    });
    return map;
  }, [guide, allBrandReleases]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/guides"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} /> Back to guides
          </Link>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{loadError}</h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              Try again
            </button>
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              <FiArrowLeft size={14} /> Back to guides
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!guide) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 sm:px-10">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/55 transition hover:text-black"
        >
          <FiArrowLeft size={14} /> Guides
        </Link>
        <div className="mt-10">
          <GuideGridSkeleton count={2} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <article>
        <header className="relative overflow-hidden bg-[#050505] text-white">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,#29201c_0%,#0b0a0a_35%,#050505_72%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1600px] px-5 py-14 sm:px-10 sm:py-20 lg:py-24">
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} /> All guides
            </Link>
            {guide.category && (
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
                {guide.category}
                {guide.difficulty ? ` · ${guide.difficulty}` : ""}
              </p>
            )}
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
              {guide.name}
            </h1>
            {guide.summary && (
              <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
                {guide.summary}
              </p>
            )}
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-[11px] uppercase tracking-wide text-white/50">
              {guide.author && (
                <div>
                  <dt className="text-white/40">Author</dt>
                  <dd className="mt-1 font-black text-white">{guide.author}</dd>
                </div>
              )}
              {guide.publishedDate && (
                <div>
                  <dt className="text-white/40">Published</dt>
                  <dd className="mt-1 font-black text-white">
                    <time dateTime={new Date(guide.publishedDate).toISOString()}>
                      {formatDate(guide.publishedDate)}
                    </time>
                  </dd>
                </div>
              )}
              {guide.readingTime && (
                <div>
                  <dt className="text-white/40">Reading time</dt>
                  <dd className="mt-1 font-black text-white">
                    {guide.readingTime}
                  </dd>
                </div>
              )}
              {(guide.brand || guide.model) && (
                <div>
                  <dt className="text-white/40">Covers</dt>
                  <dd className="mt-1 font-black text-white">
                    {[guide.brand, guide.model].filter(Boolean).join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
            {guide.image && (
              <div className="mt-12 flex justify-center lg:justify-end">
                <img
                  src={optimizeImage(guide.image, 900)}
                  alt={guide.name}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full max-w-[420px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
                />
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <GuideContent guide={guide} releaseMatches={releaseMatches} />

            <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              <section
                aria-label="Guide at a glance"
                className="border border-black/10 bg-white p-6"
              >
                <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                  At a Glance
                </h2>
                <dl className="mt-4 divide-y divide-black/10 text-sm">
                  {[
                    ["Category", guide.category],
                    ["Type", guide.guideType],
                    ["Difficulty", guide.difficulty],
                    ["Brand", guide.brand],
                    ["Model", guide.model],
                    ["Colorway", guide.colorway],
                    ["Product category", guide.productCategory],
                    ["Best for", guide.bestFor],
                    ["Reading time", guide.readingTime],
                    ["Author", guide.author],
                  ]
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                          {label}
                        </dt>
                        <dd className="text-right font-semibold text-black">
                          {value}
                        </dd>
                      </div>
                    ))}
                </dl>
              </section>

              {guide.relatedTopics.length > 0 && (
                <section
                  aria-label="Related topics"
                  className="border border-black/10 bg-white p-6"
                >
                  <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                    Related Topics
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {guide.relatedTopics.map((topic) => (
                      <li
                        key={topic}
                        className="border border-black/15 px-3 py-1.5 text-xs font-bold text-black/75"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {relatedBrand && (
                <section
                  aria-label="Related brand"
                  className="border border-black/10 bg-white p-6"
                >
                  <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                    Explore
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-black/75">
                    {relatedBrand.summary || relatedBrand.shortDescription}
                  </p>
                  <Link
                    to={`/brand/${relatedBrand.id}`}
                    className="mt-4 inline-flex items-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
                  >
                    Visit {relatedBrand.name} hub
                  </Link>
                </section>
              )}
            </aside>
          </div>
        </div>
      </article>

      {releases.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Related drops
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Releases
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {releases.map((release) => (
                <ReleaseCard key={release.id} release={release} variant="grid" />
              ))}
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Related verdicts
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Reviews
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              News desk
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Articles
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((article) => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Keep reading
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              More Guides
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((item) => (
                <GuideCard key={item.id} guide={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedLoading && relatedGuides.length === 0 && !error && !loadError && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <h2 className="text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              More Guides
            </h2>
            <div className="mt-8">
              <GuideGridSkeleton count={3} />
            </div>
          </div>
        </section>
      )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default GuideDetail;
