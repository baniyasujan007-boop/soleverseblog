import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import DealCard from "../../components/Deals/DealCard";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReviewCard from "../../components/Reviews/ReviewCard";
import GuideCard from "../../components/Guides/GuideCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import { DealGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { formatDealPrice, getDealUrl, normalizeDeal } from "../../utils/deal";
import { normalizeRelease } from "../../utils/release";
import { normalizeReview } from "../../utils/review";
import { normalizeGuide, sameBrand } from "../../utils/guide";
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

function DealDetail() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [copied, setCopied] = useState(false);
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
      .get(`/content/public/deal/${id}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!data?.data) {
          setError("Deal not found");
          return;
        }
        setError("");
        setLoadError("");
        setDeal(normalizeDeal(data.data));
      })
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        if (requestError.response?.status === 404) {
          setError("Deal not found");
          return;
        }
        setLoadError("Unable to load this deal right now.");
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!deal) return;
    document.title = deal.metaTitle || `${deal.name} | SoleVerse`;
    return () => {
      document.title = "SoleVerse";
    };
  }, [deal]);

  useEffect(() => {
    if (!deal) return;
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
            .filter((item) => sameBrand(item.brand, deal.brand))
            .slice(0, 3),
        );
        setRelatedReviews(
          reviewRes.data.data
            .map(normalizeReview)
            .filter((item) => sameBrand(item.brand, deal.brand))
            .slice(0, 3),
        );
        setRelatedGuides(
          guideRes.data.data
            .map(normalizeGuide)
            .filter((item) => sameBrand(item.brand, deal.brand))
            .slice(0, 3),
        );
        setRelatedDeals(
          dealRes.data.data
            .map(normalizeDeal)
            .filter(
              (item) =>
                item.id !== deal.id &&
                !item.expired &&
                sameBrand(item.brand, deal.brand),
            )
            .slice(0, 3),
        );
        setRelatedBrand(
          brandRes.data.data
            .map(normalizeBrand)
            .find((item) => sameBrand(item.name, deal.brand)) || null,
        );
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setRelatedLoading(false);
      });
    return () => controller.abort();
  }, [deal]);

  const url = getDealUrl(deal);
  const salePrice =
    deal?.salePrice !== null && deal?.salePrice !== undefined
      ? formatDealPrice(deal.salePrice, deal.currency)
      : "";
  const originalPrice =
    deal?.originalPrice !== null && deal?.originalPrice !== undefined
      ? formatDealPrice(deal.originalPrice, deal.currency)
      : "";
  const showOriginal =
    originalPrice && salePrice && originalPrice !== salePrice;

  const productInfo = useMemo(() => {
    if (!deal) return [];
    return [
      ["Brand", deal.brand],
      ["Model", deal.model],
      ["Colorway", deal.colorway],
      ["Category", deal.productCategory],
      ["Retailer", deal.retailer],
      ["Currency", deal.currency],
      ["Original Price", originalPrice],
      ["Sale Price", salePrice],
      [
        "Discount",
        deal.discountPercentage !== null ? `${deal.discountPercentage}%` : "",
      ],
      ["Availability", deal.availability],
      ["Sizes", deal.availableSizes.length > 0 ? deal.availableSizes.join(", ") : ""],
      ["Start Date", formatDate(deal.startDate)],
      ["Expiration Date", formatDate(deal.expiration)],
    ].filter(([, value]) => value);
  }, [deal, originalPrice, salePrice]);

  const copyCoupon = async () => {
    if (!deal?.couponCode) return;
    try {
      await navigator.clipboard.writeText(deal.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/deals"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} aria-hidden="true" /> Back to deals
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
              to="/deals"
              className="inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> Back to deals
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!deal) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 sm:px-10">
        <Link
          to="/deals"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/55 transition hover:text-black"
        >
          <FiArrowLeft size={14} aria-hidden="true" /> Deals
        </Link>
        <div className="mt-10">
          <DealGridSkeleton count={2} />
        </div>
      </main>
    );
  }

  const hasEditorial = Boolean(
    deal.quickSummary || deal.summary || deal.content,
  );
  const hasLists = deal.whyWeLikeIt.length > 0 || deal.dealNotes.length > 0;

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
              to="/deals"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-white/60 transition hover:text-white"
            >
              <FiArrowLeft size={14} aria-hidden="true" /> All deals
            </Link>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e8d8bd]">
              {[deal.brand, deal.productCategory, deal.retailer]
                .filter(Boolean)
                .join(" · ")}
              {deal.expired ? " · Expired" : ""}
            </p>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
                  {deal.name}
                </h1>
                {(deal.model || deal.colorway) && (
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/60">
                    {[deal.model, deal.colorway].filter(Boolean).join(" · ")}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  {salePrice && (
                    <span className="text-5xl font-black tracking-[-0.04em] text-[#eee0c9]">
                      {salePrice}
                    </span>
                  )}
                  {showOriginal && (
                    <span className="text-2xl font-semibold text-white/40 line-through">
                      {originalPrice}
                    </span>
                  )}
                  {!deal.expired &&
                    deal.discountPercentage !== null &&
                    deal.discountPercentage > 0 && (
                      <span className="bg-[#eee0c9] px-3 py-1.5 text-sm font-black tracking-wide text-black">
                        {deal.discountPercentage}% OFF
                      </span>
                    )}
                  {deal.expired && (
                    <span className="bg-white px-3 py-1.5 text-sm font-black uppercase tracking-wide text-black">
                      Expired
                    </span>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {deal.expired ? (
                    <span className="inline-flex cursor-not-allowed items-center gap-3 bg-white/10 px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white/40">
                      Deal Expired
                    </span>
                  ) : url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#eee0c9] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
                    >
                      Get This Deal <FiExternalLink size={16} aria-hidden="true" />
                    </a>
                  ) : null}
                  {deal.expired && deal.expiration && (
                    <p className="text-xs uppercase tracking-wide text-white/45">
                      Expired on {formatDate(deal.expiration)}
                    </p>
                  )}
                </div>
                {deal.couponCode && !deal.expired && (
                  <p className="mt-6 inline-block border border-dashed border-white/30 bg-white/5 px-3 py-2 text-sm font-black tracking-wide text-[#eee0c9]">
                    Coupon: {deal.couponCode}
                  </p>
                )}
              </div>
              {deal.image && (
                <div className="flex items-end justify-center">
                  <img
                    src={optimizeImage(deal.image, 900)}
                    alt={deal.name}
                    fetchPriority="high"
                    decoding="async"
                    className={`w-full max-w-[360px] object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)] ${
                      deal.expired ? "opacity-60 saturate-50" : ""
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-12">
              {hasEditorial && (
                <section aria-label="Deal summary">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    The Deal
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-black/80">
                    {deal.quickSummary || deal.summary}
                  </p>
                </section>
              )}

              {deal.content && (
                <section aria-label="Deal details">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    Deal Details
                  </h2>
                  <div className="mt-5 whitespace-pre-line text-lg leading-8 text-black/80">
                    {deal.content}
                  </div>
                </section>
              )}

              {deal.whyWeLikeIt.length > 0 && (
                <section aria-label="Why we like it">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    Why We Like It
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {deal.whyWeLikeIt.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm leading-6 text-black/80"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {deal.dealNotes.length > 0 && (
                <section aria-label="Deal notes">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    Deal Notes
                  </h2>
                  <ul className="mt-5 space-y-2">
                    {deal.dealNotes.map((note, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm leading-6 text-black/75"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/50" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {deal.terms && (
                <section aria-label="Terms and conditions">
                  <h2 className="text-2xl font-black tracking-[-0.045em]">
                    Terms & Conditions
                  </h2>
                  <p className="mt-5 whitespace-pre-line text-sm leading-6 text-black/65">
                    {deal.terms}
                  </p>
                </section>
              )}

              {!hasEditorial && !hasLists && !deal.content && !deal.terms && (
                <p className="text-sm text-black/55">
                  More details for this deal are on their way.
                </p>
              )}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              <section
                aria-label="Product information"
                className="border border-black/10 bg-white p-6"
              >
                <h2 className="text-[11px] font-black uppercase tracking-wide text-black/60">
                  Product Information
                </h2>
                <dl className="mt-4 divide-y divide-black/10 text-sm">
                  {productInfo.map(([label, value]) => (
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
                {deal.couponCode && !deal.expired && (
                  <div className="mt-4 border-t border-black/10 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                      Coupon code
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block border border-dashed border-black/30 bg-[#eee0c9]/40 px-3 py-2 text-sm font-black tracking-wide text-black">
                        {deal.couponCode}
                      </span>
                      <button
                        type="button"
                        onClick={copyCoupon}
                        aria-label={`Copy coupon code ${deal.couponCode}`}
                        className="inline-flex items-center gap-2 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#eee0c9] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
                      >
                        {copied ? (
                          <>
                            <FiCheck size={12} aria-hidden="true" /> Copied
                          </>
                        ) : (
                          <>
                            <FiCopy size={12} aria-hidden="true" /> Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <p className="sr-only" role="status" aria-live="polite">
                      {copied ? "Coupon code copied to clipboard" : ""}
                    </p>
                  </div>
                )}
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
                    Visit {deal.brand} hub
                  </Link>
                </section>
              )}
            </aside>
          </div>
        </div>
      </article>

      {relatedDeals.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              More savings
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              More Deals
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedDeals.map((item) => (
                <DealCard key={item.id} deal={item} />
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
                More Deals
              </h2>
              <div className="mt-8">
                <DealGridSkeleton count={3} />
              </div>
            </div>
          </section>
        )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default DealDetail;
