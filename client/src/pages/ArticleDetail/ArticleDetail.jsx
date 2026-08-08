import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiShare2,
  FiTag,
} from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import NewsCard from "../../components/LatestNews/NewsCard";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReviewCard from "../../components/Reviews/ReviewCard";
import GuideCard from "../../components/Guides/GuideCard";
import DealCard from "../../components/Deals/DealCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/layouts/Footer/Footer";
import { ReleaseGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { normalizeRelease } from "../../utils/release";
import { normalizeReview } from "../../utils/review";
import { normalizeGuide, sameBrand } from "../../utils/guide";
import { normalizeDeal } from "../../utils/deal";
import { optimizeImage } from "../../utils/image";

const formatDate = (value, withYear = true) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
};

const estimateReadTime = (content = "") => {
  const words = String(content)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (!words) return "";
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const plainText = (content = "") =>
  String(content)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const deck = (content = "") => {
  const text = plainText(content);
  if (!text) return "";
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(" ");
};

function ArticleSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]" aria-hidden="true">
      <div className="bg-[#050505]">
        <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-10 sm:py-20">
          <div className="h-3 w-36 animate-pulse rounded bg-white/15 motion-reduce:animate-none" />
          <div className="mt-8 h-14 w-full max-w-3xl animate-pulse rounded bg-white/15 motion-reduce:animate-none" />
          <div className="mt-4 h-14 w-4/5 max-w-2xl animate-pulse rounded bg-white/15 motion-reduce:animate-none" />
          <div className="mt-8 h-4 w-2/3 max-w-xl animate-pulse rounded bg-white/15 motion-reduce:animate-none" />
          <div className="mt-6 h-3 w-64 animate-pulse rounded bg-white/15 motion-reduce:animate-none" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10">
        <div className="aspect-[16/9] animate-pulse rounded bg-black/10 motion-reduce:animate-none" />
        <div className="mt-12 space-y-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className={`h-4 animate-pulse rounded bg-black/10 motion-reduce:animate-none ${
                index === 4 ? "w-3/4" : index === 5 ? "w-5/6" : "w-full"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch (error) {
        if (error?.name === "AbortError") return;
        fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : `Share ${title}`}
      className="inline-flex items-center gap-2 border border-white/25 px-4 py-3.5 text-xs font-black uppercase tracking-wide text-white transition hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
    >
      {copied ? (
        <FiCheck size={15} aria-hidden="true" />
      ) : (
        <FiShare2 size={15} aria-hidden="true" />
      )}
      {copied ? "Copied" : "Share"}
    </button>
  );
}

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [relatedNews, setRelatedNews] = useState([]);
  const [relatedReleases, setRelatedReleases] = useState([]);
  const [relatedReviews, setRelatedReviews] = useState([]);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [relatedDeals, setRelatedDeals] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/articles/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data?.data) {
          setError("Article not found");
          return;
        }
        setError("");
        setLoadError("");
        setArticle(data.data);
      })
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        if (requestError.response?.status === 404) {
          setError("Article not found");
          return;
        }
        setLoadError("Unable to load this article.");
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!article) return;
    document.title = article.title || "SoleVerse";
    let meta = document.querySelector('meta[name="description"]');
    const description = article.summary || plainText(article.content).slice(0, 160);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description || "");
    return () => {
      document.title = "SoleVerse";
      if (meta?.parentNode) meta.parentNode.removeChild(meta);
    };
  }, [article]);

  useEffect(() => {
    if (!article) return;
    const controller = new AbortController();
    Promise.all([
      api.get("/articles", {
        params: {
          category: article.category,
          status: "published",
          limit: 20,
          sort: "newest",
        },
        signal: controller.signal,
      }),
      api.get("/content/public/brand", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
    ])
      .then(([newsRes, brandRes]) => {
        setRelatedNews(
          newsRes.data.data
            .filter((item) => item._id !== article._id)
            .slice(0, 4),
        );
        const brandNames = brandRes.data.data.map((item) => item.title);
        const match = (article.tags || []).find((tag) =>
          brandNames.some((name) => sameBrand(name, tag)),
        );
        if (!match) return Promise.resolve(null);
        return Promise.all([
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
          api.get("/content/public/deal", {
            params: { limit: 100 },
            signal: controller.signal,
          }),
        ]).then(([releaseRes, reviewRes, guideRes, dealRes]) => {
          setRelatedReleases(
            releaseRes.data.data
              .map(normalizeRelease)
              .filter((item) => sameBrand(item.brand, match))
              .slice(0, 3),
          );
          setRelatedReviews(
            reviewRes.data.data
              .map(normalizeReview)
              .filter((item) => sameBrand(item.brand, match))
              .slice(0, 3),
          );
          setRelatedGuides(
            guideRes.data.data
              .map(normalizeGuide)
              .filter((item) => sameBrand(item.brand, match))
              .slice(0, 3),
          );
          setRelatedDeals(
            dealRes.data.data
              .map(normalizeDeal)
              .filter(
                (item) => !item.expired && sameBrand(item.brand, match),
              )
              .slice(0, 3),
          );
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setRelatedLoading(false);
      });
    return () => controller.abort();
  }, [article]);

  const paragraphs = useMemo(() => {
    if (!article) return [];
    return String(article.content)
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [article]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/news"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} aria-hidden="true" /> Back to news
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
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
            >
              Try again
            </button>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> Back to news
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return <ArticleSkeleton />;
  }

  const readTime = estimateReadTime(article.content);
  const hasUpdated = article.updatedAt && article.updatedAt !== article.createdAt;
  const heroDeck = article.summary || deck(article.content);

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
              to="/news"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> All news
            </Link>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
              {article.category || "Sneaker News"}
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
              {article.title}
            </h1>
            {heroDeck && (
              <p className="mt-6 max-w-2xl text-[15px] leading-6 text-white/70">
                {heroDeck}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-wide text-white/50">
              {article.author?.name && (
                <span>
                  <span className="text-white/40">By</span>{" "}
                  <span className="font-black text-white">
                    {article.author.name}
                  </span>
                </span>
              )}
              {article.createdAt && (
                <time dateTime={new Date(article.createdAt).toISOString()}>
                  {formatDate(article.createdAt)}
                </time>
              )}
              {readTime && (
                <span className="inline-flex items-center gap-1.5">
                  <FiClock size={12} aria-hidden="true" /> {readTime}
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ShareButton title={article.title} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              {article.image && (
                <div className="relative aspect-[16/9] overflow-hidden bg-[#f1f0ec]">
                  <img
                    src={optimizeImage(article.image, 1200)}
                    alt={article.title}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-12 space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[70ch] text-lg leading-8 text-black/85"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {article.tags?.length > 0 && (
                <div className="mt-12 border-t border-black/10 pt-8">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                    <FiTag size={12} aria-hidden="true" /> Tagged
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-black/15 px-3.5 py-2 text-xs font-bold text-black/75"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              <section
                aria-label="Article details"
                className="border border-black/10 bg-white p-6"
              >
                <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                  Article Info
                </h2>
                <dl className="mt-4 divide-y divide-black/10 text-sm">
                  {article.author?.name && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Author
                      </dt>
                      <dd className="text-right font-semibold text-black">
                        {article.author.name}
                      </dd>
                    </div>
                  )}
                  {article.category && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Category
                      </dt>
                      <dd className="text-right font-semibold text-black">
                        {article.category}
                      </dd>
                    </div>
                  )}
                  {article.createdAt && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Published
                      </dt>
                      <dd className="text-right font-semibold text-black">
                        <time
                          dateTime={new Date(article.createdAt).toISOString()}
                        >
                          {formatDate(article.createdAt)}
                        </time>
                      </dd>
                    </div>
                  )}
                  {hasUpdated && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Updated
                      </dt>
                      <dd className="text-right font-semibold text-black">
                        <time
                          dateTime={new Date(article.updatedAt).toISOString()}
                        >
                          {formatDate(article.updatedAt)}
                        </time>
                      </dd>
                    </div>
                  )}
                  {readTime && (
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-xs font-bold uppercase tracking-wide text-black/45">
                        Read time
                      </dt>
                      <dd className="text-right font-semibold text-black">
                        {readTime}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <Link
                to="/news"
                className="group flex items-center justify-between border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
              >
                <span>
                  <span className="block text-[10px] font-black uppercase tracking-wide text-black/50">
                    News desk
                  </span>
                  <span className="mt-1 block text-sm font-bold text-black">
                    Back to the newsroom
                  </span>
                </span>
                <FiArrowUpRight
                  className="shrink-0 text-black/40 transition group-hover:text-black"
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </aside>
          </div>
        </div>
      </article>

      {relatedNews.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              From the desk
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              More {article.category || "News"}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedNews.map((item) => (
                <NewsCard key={item._id} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedReleases.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Related drops
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Releases
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} variant="grid" />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedReviews.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Related verdicts
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Reviews
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Keep learning
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Guides
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedDeals.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Cop a pair for less
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Deals
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedLoading &&
        relatedNews.length === 0 &&
        relatedReleases.length === 0 &&
        relatedReviews.length === 0 &&
        relatedGuides.length === 0 &&
        relatedDeals.length === 0 &&
        !error &&
        !loadError && (
          <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
            <div className="border-t border-black/15 pt-10">
              <h2 className="text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                More News
              </h2>
              <div className="mt-8">
                <ReleaseGridSkeleton count={3} />
              </div>
            </div>
          </section>
        )}

      <Newsletter settings={newsletterSettings} />
      <Footer />
    </main>
  );
}

export default ArticleDetail;
