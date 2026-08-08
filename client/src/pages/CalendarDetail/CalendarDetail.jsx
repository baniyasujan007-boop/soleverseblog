import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiExternalLink } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReviewCard from "../../components/Reviews/ReviewCard";
import GuideCard from "../../components/Guides/GuideCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import { CalendarGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { normalizeCalendar } from "../../utils/calendar";
import { normalizeRelease } from "../../utils/release";
import { normalizeReview } from "../../utils/review";
import { normalizeGuide, sameBrand } from "../../utils/guide";
import { normalizeBrand } from "../../utils/brand";
import { optimizeImage } from "../../utils/image";

const rawDeal = (item = {}) => {
  const metadata = item.metadata || {};
  return {
    id: item._id,
    name: item.title,
    image: item.image,
    brand: metadata.brand || item.category,
    retailer: metadata.retailerName,
    salePrice: metadata.salePrice,
  };
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function CalendarDetail() {
  const { id } = useParams();
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};
  const [release, setRelease] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [relatedReleases, setRelatedReleases] = useState([]);
  const [relatedReviews, setRelatedReviews] = useState([]);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [relatedDeals, setRelatedDeals] = useState([]);
  const [relatedBrand, setRelatedBrand] = useState(null);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/content/public/calendar/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data?.data) {
          setError("Release not found");
          return;
        }
        setError("");
        setLoadError("");
        setRelease(normalizeCalendar(data.data));
      })
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        if (requestError.response?.status === 404) {
          setError("Release not found");
          return;
        }
        setLoadError("Unable to load this release right now.");
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!release) return;
    document.title =
      release.metaTitle || `${release.name} — Release Calendar`;
    return () => {
      document.title = "SoleVerse";
    };
  }, [release]);

  useEffect(() => {
    if (!release) return;
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
      api.get("/content/public/deal", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
      api.get("/content/public/brand", {
        params: { limit: 100 },
        signal: controller.signal,
      }),
    ])
      .then(([releaseRes, reviewRes, guideRes, dealRes, brandRes]) => {
        setRelatedReleases(
          releaseRes.data.data
            .map(normalizeRelease)
            .filter((item) => sameBrand(item.brand, release.brand))
            .slice(0, 3),
        );
        setRelatedReviews(
          reviewRes.data.data
            .map(normalizeReview)
            .filter((item) => sameBrand(item.brand, release.brand))
            .slice(0, 3),
        );
        setRelatedGuides(
          guideRes.data.data
            .map(normalizeGuide)
            .filter((item) => sameBrand(item.brand, release.brand))
            .slice(0, 3),
        );
        setRelatedDeals(
          dealRes.data.data
            .map(rawDeal)
            .filter((item) => sameBrand(item.brand, release.brand))
            .slice(0, 3),
        );
        setRelatedBrand(
          brandRes.data.data
            .map(normalizeBrand)
            .find((item) => sameBrand(item.name, release.brand)) || null,
        );
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setRelatedLoading(false);
      });
    return () => controller.abort();
  }, [release]);

  const atAGlance = useMemo(() => {
    if (!release) return [];
    return [
      ["Brand", release.brand],
      ["Model", release.model],
      ["Colorway", release.colorway],
      ["SKU / Style code", release.sku],
      ["Category", release.category],
      ["Release type", release.releaseType],
      ["Region", release.region],
      ["Availability", release.availability],
      ["Release date", formatDate(release.releaseDate)],
      ["Retail price", release.price],
    ].filter(([, value]) => value);
  }, [release]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/calendar"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} aria-hidden="true" /> Back to calendar
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
              to="/calendar"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> Back to calendar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!release) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 sm:px-10">
        <Link
          to="/calendar"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/55 transition hover:text-black"
        >
          <FiArrowLeft size={14} aria-hidden="true" /> Calendar
        </Link>
        <div className="mt-10">
          <CalendarGridSkeleton count={2} />
        </div>
      </main>
    );
  }

  const hasEditorial = Boolean(
    release.description || release.summary || release.content,
  );
  const showAside = atAGlance.length > 0 || relatedBrand;

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
              to="/calendar"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> Release calendar
            </Link>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
              {[release.brand, release.category, release.releaseType, release.availability]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
                  {release.name}
                </h1>
                {(release.model || release.colorway) && (
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/60">
                    {[release.brand, release.model, release.colorway]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {release.releaseDate && (
                  <p className="mt-6 inline-flex items-center gap-2 bg-[#eee0c9] px-3 py-2 text-xs font-black uppercase tracking-wide text-black">
                    <FiCalendar size={13} aria-hidden="true" />
                    {formatDate(release.releaseDate)}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {release.price && (
                    <span className="text-4xl font-black tracking-[-0.03em] text-[#eee0c9]">
                      {release.price}
                    </span>
                  )}
                  {release.region && (
                    <span className="text-sm font-semibold uppercase tracking-wide text-white/50">
                      {release.region}
                    </span>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {relatedBrand ? (
                    <Link
                      to={`/brand/${relatedBrand.id}`}
                      className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
                    >
                      Visit {release.brand} hub <FiExternalLink size={16} aria-hidden="true" />
                    </Link>
                  ) : null}
                  {release.sku && (
                    <span className="border border-white/25 px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-white/60">
                      {release.sku}
                    </span>
                  )}
                </div>
              </div>
              {release.image && (
                <div className="flex items-end justify-center">
                  <img
                    src={optimizeImage(release.image, 900)}
                    alt={release.name}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full max-w-[360px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
          <div
            className={`grid gap-12 ${
              showAside ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""
            }`}
          >
            {hasEditorial && (
              <div className="min-w-0 space-y-12">
                {(release.summary || release.description) && (
                  <section aria-label="About this release">
                    <h2 className="text-2xl font-black tracking-[-0.045em]">
                      About the Release
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-black/80">
                      {release.summary || release.description}
                    </p>
                  </section>
                )}
                {release.content && (
                  <section aria-label="Release details">
                    <h2 className="text-2xl font-black tracking-[-0.045em]">
                      Details
                    </h2>
                    <div className="mt-5 whitespace-pre-line text-lg leading-8 text-black/80">
                      {release.content}
                    </div>
                  </section>
                )}
              </div>
            )}

            {showAside && (
              <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
                <section
                  aria-label="Release at a glance"
                  className="border border-black/10 bg-white p-6"
                >
                  <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                    At a Glance
                  </h2>
                  <dl className="mt-4 divide-y divide-black/10 text-sm">
                    {atAGlance.map(([label, value]) => (
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
                      Visit {release.brand} hub
                    </Link>
                  </section>
                )}
              </aside>
            )}

            {!hasEditorial && !showAside && (
              <p className="text-sm text-black/55">
                Details for this release are on their way.
              </p>
            )}
          </div>
        </div>
      </article>

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
                <Link
                  key={deal.id}
                  to="/deals"
                  className="group flex items-center gap-4 border border-black/10 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
                >
                  {deal.image ? (
                    <img
                      src={optimizeImage(deal.image, 300)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 shrink-0 bg-[#f1f0ec] object-contain p-1"
                    />
                  ) : (
                    <span className="h-14 w-14 shrink-0 bg-[#f1f0ec]" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                      {deal.retailer || deal.brand}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-bold leading-5 text-black group-hover:underline">
                      {deal.name}
                    </span>
                    {deal.salePrice && (
                      <span className="mt-1 block text-sm font-black text-black">
                        {deal.salePrice}
                      </span>
                    )}
                  </span>
                  <FiArrowRight
                    className="ml-auto shrink-0 text-black/40 transition group-hover:text-black"
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedReleases.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              More drops
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Related Releases
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedReleases.map((item) => (
                <ReleaseCard key={item.id} release={item} variant="grid" />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedReviews.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Our verdicts
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

      {relatedLoading &&
        relatedDeals.length === 0 &&
        relatedReleases.length === 0 &&
        relatedReviews.length === 0 &&
        relatedGuides.length === 0 &&
        !error &&
        !loadError && (
          <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
            <div className="border-t border-black/15 pt-10">
              <h2 className="text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                More Releases
              </h2>
              <div className="mt-8">
                <CalendarGridSkeleton count={3} />
              </div>
            </div>
          </section>
        )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default CalendarDetail;
