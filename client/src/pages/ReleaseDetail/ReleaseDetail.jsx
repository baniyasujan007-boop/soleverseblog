import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
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
import { normalizeBrand } from "../../utils/brand";
import { optimizeImage } from "../../utils/image";

const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", INR: "₹" };

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const formatCurrency = (value, currency = "USD") => {
  const number = toNumber(value);
  if (number === null) return "";
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  const amount = Number.isInteger(number)
    ? number.toLocaleString("en-US")
    : number.toFixed(2);
  return `${symbol}${amount}`;
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

function ReleaseDetail() {
  const { id } = useParams();
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
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/content/public/release/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data?.data) {
          setError("Release not found");
          return;
        }
        setError("");
        setLoadError("");
        setRelease(normalizeRelease(data.data));
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
    document.title = release.metaTitle || `${release.name} — SoleVerse Release`;
    let meta = document.querySelector('meta[name="description"]');
    if (release.metaDescription) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", release.metaDescription);
    }
    return () => {
      document.title = "SoleVerse";
      if (release.metaDescription && meta?.parentNode) {
        meta.parentNode.removeChild(meta);
      }
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
            .filter(
              (item) =>
                item.id !== release.id && sameBrand(item.brand, release.brand),
            )
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
            .map(normalizeDeal)
            .filter(
              (item) =>
                !item.expired && sameBrand(item.brand, release.brand),
            )
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

  const price = useMemo(() => {
    if (!release) return "";
    if (release.retailPrice !== null && release.retailPrice !== undefined) {
      return formatCurrency(release.retailPrice, release.currency);
    }
    return release.price;
  }, [release]);

  const atAGlance = useMemo(() => {
    if (!release) return [];
    return [
      ["Brand", release.brand],
      ["Model", release.model],
      ["Colorway", release.colorway],
      ["SKU / Style Code", release.sku],
      ["Category", release.category],
      ["Release type", release.releaseType],
      ["Region", release.region],
      ["Availability", release.availability],
      ["Release date", formatDate(release.releaseDate)],
      ["Retail price", price],
    ].filter(([, value]) => value);
  }, [release, price]);

  const craft = useMemo(() => {
    if (!release) return [];
    return [
      ["Designer", release.designer],
      ["Materials", release.materials],
      ["Technology", release.technology],
      ["Available sizes", release.sizes],
    ].filter(([, value]) => value);
  }, [release]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/releases"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} aria-hidden="true" /> Back to releases
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
              to="/releases"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> Back to releases
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
          to="/releases"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/55 transition hover:text-black"
        >
          <FiArrowLeft size={14} aria-hidden="true" /> Releases
        </Link>
        <div className="mt-10" aria-hidden="true">
          <div className="h-3 w-48 animate-pulse rounded bg-black/10" />
          <div className="mt-6 h-14 w-full max-w-xl animate-pulse rounded bg-black/10" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-black/10" />
          <div className="mt-8 h-3 w-1/3 animate-pulse rounded bg-black/10" />
        </div>
        <div className="mt-12">
          <ReleaseGridSkeleton count={3} />
        </div>
      </main>
    );
  }

  const hasEditorial = Boolean(release.summary || release.content);
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
              to="/releases"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> All releases
            </Link>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
              {[release.brand, release.releaseType, release.availability]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
              <div>
                <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
                  {release.name}
                </h1>
                {(release.brand || release.model || release.colorway) && (
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/60">
                    {[release.brand, release.model, release.colorway]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {release.summary && (
                  <p className="mt-6 max-w-xl text-[15px] leading-6 text-white/70">
                    {release.summary}
                  </p>
                )}
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-[11px] uppercase tracking-wide text-white/50">
                  {release.releaseDate && (
                    <div>
                      <dt className="text-white/40">Release date</dt>
                      <dd className="mt-1 font-black text-white">
                        <time
                          dateTime={
                            !Number.isNaN(new Date(release.releaseDate).getTime())
                              ? new Date(release.releaseDate).toISOString()
                              : undefined
                          }
                        >
                          {formatDate(release.releaseDate)}
                        </time>
                      </dd>
                    </div>
                  )}
                  {price && (
                    <div>
                      <dt className="text-white/40">Retail</dt>
                      <dd className="mt-1 font-black text-[#eee0c9]">{price}</dd>
                    </div>
                  )}
                  {release.availability && (
                    <div>
                      <dt className="text-white/40">Availability</dt>
                      <dd className="mt-1 font-black text-white">
                        {release.availability}
                      </dd>
                    </div>
                  )}
                  {release.region && (
                    <div>
                      <dt className="text-white/40">Region</dt>
                      <dd className="mt-1 font-black text-white">{release.region}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {relatedBrand ? (
                    <Link
                      to={`/brand/${relatedBrand.id}`}
                      className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eee0c9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                    >
                      Visit {release.brand} hub{" "}
                      <FiExternalLink size={16} aria-hidden="true" />
                    </Link>
                  ) : null}
                  {release.sku && (
                    <span className="border border-white/25 px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-white/60">
                      {release.sku}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-end justify-center">
                {release.image ? (
                  <img
                    src={optimizeImage(release.image, 900)}
                    alt={release.name}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full max-w-[360px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]"
                  />
                ) : (
                  <div className="grid h-[320px] w-full max-w-[360px] place-items-center border border-white/10 bg-white/5">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/30">
                      {release.brand || "SoleVerse"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
          <div
            className={`grid gap-12 ${
              showAside ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""
            }`}
          >
            <div className="min-w-0 space-y-12">
              {release.summary && (
                <section aria-label="About the release">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    About the Release
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-black/80">
                    {release.summary}
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

              {craft.length > 0 && (
                <section aria-label="What to know">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    What to Know
                  </h2>
                  <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {craft.map(([label, value]) => (
                      <div key={label} className="border-t border-black/10 pt-4">
                        <dt className="text-[11px] font-bold uppercase tracking-wide text-black/45">
                          {label}
                        </dt>
                        <dd className="mt-1 font-semibold text-black">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {!hasEditorial && craft.length === 0 && !showAside && (
                <p className="text-sm text-black/55">
                  Details for this release are on their way.
                </p>
              )}
            </div>

            {showAside && (
              <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
                {atAGlance.length > 0 && (
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
                )}

                {relatedBrand && (
                  <section
                    aria-label="About the brand"
                    className="border border-black/10 bg-white p-6"
                  >
                    <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                      About the Brand
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-black/75">
                      {relatedBrand.summary || relatedBrand.shortDescription}
                    </p>
                    <Link
                      to={`/brand/${relatedBrand.id}`}
                      className="mt-4 inline-flex items-center gap-2 bg-black px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
                    >
                      View {relatedBrand.name}{" "}
                      <FiArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </section>
                )}
              </aside>
            )}
          </div>
        </div>
      </article>

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
        relatedReleases.length === 0 &&
        relatedReviews.length === 0 &&
        relatedGuides.length === 0 &&
        relatedDeals.length === 0 &&
        !error &&
        !loadError && (
          <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
            <div className="border-t border-black/15 pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                Related drops
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                Related Releases
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

export default ReleaseDetail;
