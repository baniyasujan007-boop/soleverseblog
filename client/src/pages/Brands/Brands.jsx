import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import BrandHero from "../../components/Brands/BrandHero";
import BrandIndex from "../../components/Brands/BrandIndex";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReviewCard from "../../components/Reviews/ReviewCard";
import NewsCard from "../../components/LatestNews/NewsCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import { BrandGridSkeleton, ReleaseGridSkeleton, ReviewGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { normalizeBrand, countByBrand } from "../../utils/brand";
import { normalizeRelease } from "../../utils/release";
import { normalizeReview } from "../../utils/review";

function BrandRail({ title, kicker, children, loading, error, onRetry, grid }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
      <div className="flex items-end justify-between border-t border-black/15 pt-10">
        <div>
          {kicker && (
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              {kicker}
            </p>
          )}
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <div aria-busy={loading} className="mt-8">
        {error ? (
          <div
            role="alert"
            className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-black uppercase tracking-wide text-red-900 underline underline-offset-2 transition hover:opacity-55"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div>{grid}</div>
        ) : children}
      </div>
    </section>
  );
}

function Brands() {
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};
  const [heroBrand, setHeroBrand] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [releases, setReleases] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/content/public/brand", {
        params: { featured: true, limit: 1 },
        signal: controller.signal,
      })
      .then(({ data }) =>
        setHeroBrand(data.data[0] ? normalizeBrand(data.data[0]) : null),
      )
      .catch(() => setHeroBrand(null))
      .finally(() => setHeroLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const [brandRes, reviewRes, releaseRes, articleRes] = await Promise.all([
          api.get("/content/public/brand", {
            params: { limit: 100 },
            signal: controller.signal,
          }),
          api.get("/content/public/review", {
            params: { limit: 100 },
            signal: controller.signal,
          }),
          api.get("/content/public/release", {
            params: { limit: 100 },
            signal: controller.signal,
          }),
          api.get("/articles", {
            params: { limit: 4 },
            signal: controller.signal,
          }),
        ]);
        setBrands(brandRes.data.data.map(normalizeBrand));
        setReviews(reviewRes.data.data.map(normalizeReview));
        setReleases(releaseRes.data.data.map(normalizeRelease));
        setArticles(articleRes.data.data);
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load brands right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [reloadKey]);

  const statsByBrand = useMemo(() => {
    const reviewCounts = countByBrand(reviews);
    const releaseCounts = countByBrand(releases);
    return brands.reduce((record, brand) => {
      record[brand.name] = {
        reviews: reviewCounts[brand.name] || 0,
        releases: releaseCounts[brand.name] || 0,
      };
      return record;
    }, {});
  }, [brands, reviews, releases]);

  const featuredReviews = useMemo(() => {
    const byBrand = reviews.filter((review) => review.brand === heroBrand?.name);
    const source = byBrand.length ? byBrand : reviews;
    return source.slice(0, 6);
  }, [reviews, heroBrand]);

  const featuredReleases = useMemo(() => {
    const byBrand = releases.filter((release) => release.brand === heroBrand?.name);
    const source = byBrand.length ? byBrand : releases;
    return source.slice(0, 6);
  }, [releases, heroBrand]);

  const GRID_CLASSES = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <BrandHero
        brand={heroBrand}
        loading={heroLoading}
        stats={{
          releases: featuredReleases.length,
          reviews: featuredReviews.length,
          guides: 0,
          articles: articles.length,
        }}
      />

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
            Brand index
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            Popular Brands
          </h2>
          <p className="mt-2 text-sm text-black/55">
            {brands.length} brands across the SoleVerse universe.
          </p>
        </div>

        <div className="mt-8" aria-busy={loading}>
          <p className="sr-only" role="status">
            {loading
              ? "Loading brands"
              : error
                ? "Unable to load brands"
                : `${brands.length} brands shown`}
          </p>
          {error ? (
            <div
              role="alert"
              className="border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
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
            <BrandGridSkeleton count={8} />
          ) : (
            <BrandIndex brands={brands} stats={statsByBrand} />
          )}
        </div>
      </section>

      {articles.length > 0 && (
        <BrandRail
          kicker="News desk"
          title="Latest Brand News"
          loading={false}
          error=""
          grid={<ReleaseGridSkeleton count={4} />}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        </BrandRail>
      )}

      {featuredReleases.length > 0 && (
        <BrandRail
          kicker={heroBrand ? `${heroBrand.name} drops` : "Release watch"}
          title={
            heroBrand ? `Latest ${heroBrand.name} Releases` : "Latest Releases"
          }
          loading={loading}
          error=""
          grid={<ReleaseGridSkeleton count={6} />}
        >
          <div className={GRID_CLASSES}>
            {featuredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} variant="grid" />
            ))}
          </div>
        </BrandRail>
      )}

      {featuredReviews.length > 0 && (
        <BrandRail
          kicker={heroBrand ? `${heroBrand.name} verdicts` : "Review desk"}
          title={
            heroBrand ? `Latest ${heroBrand.name} Reviews` : "Latest Reviews"
          }
          loading={loading}
          error=""
          grid={<ReviewGridSkeleton count={6} />}
        >
          <div className={GRID_CLASSES}>
            {featuredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </BrandRail>
      )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default Brands;
