import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import BrandHero from "../../components/Brands/BrandHero";
import ReleaseCard from "../../components/LatestReleases/ReleaseCard";
import ReviewCard from "../../components/Reviews/ReviewCard";
import NewsCard from "../../components/LatestNews/NewsCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/layouts/Footer/Footer";
import { ReleaseGridSkeleton, ReviewGridSkeleton } from "../../components/common/Skeleton/Skeleton";
import { normalizeBrand } from "../../utils/brand";
import { normalizeRelease } from "../../utils/release";
import { normalizeReview } from "../../utils/review";

function Chip({ children, accent = "#080808" }) {
  return (
    <li
      className="border border-black/15 px-3.5 py-2 text-xs font-bold text-black/75"
      style={{ borderColor: `${accent}33` }}
    >
      {children}
    </li>
  );
}

function EditorialSection({ kicker, title, body, accent }) {
  if (!body) return null;
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
      <div className="border-t border-black/15 pt-10">
        {kicker && (
          <p
            className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50"
            style={{ color: accent }}
          >
            {kicker}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
          {title}
        </h2>
        <div className="mt-5 max-w-4xl whitespace-pre-line text-lg leading-8 text-black/75">
          {body}
        </div>
      </div>
    </section>
  );
}

function Rail({ title, kicker, children, loading, grid }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
      <div className="border-t border-black/15 pt-10">
        {kicker && (
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
            {kicker}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
          {title}
        </h2>
        <div className="mt-8" aria-busy={loading}>
          {loading ? <div>{grid}</div> : children}
        </div>
      </div>
    </section>
  );
}

function BrandDetail() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState("");
  const [releases, setReleases] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [guides, setGuides] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/content/public/brand/${id}`, { signal: controller.signal })
      .then(({ data }) => setBrand(normalizeBrand(data.data)))
      .catch(() => setError("Brand not found"));
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!brand) return;
    document.title = brand.metaTitle || `${brand.name} — SoleVerse Brand`;
    return () => {
      document.title = "SoleVerse";
    };
  }, [brand]);

  useEffect(() => {
    if (!brand) return;
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
      api.get("/articles", {
        params: { search: brand.name, limit: 4 },
        signal: controller.signal,
      }),
    ])
      .then(([releaseRes, reviewRes, guideRes, articleRes]) => {
        setReleases(
          releaseRes.data.data
            .map(normalizeRelease)
            .filter((item) => item.brand === brand.name)
            .slice(0, 6),
        );
        setReviews(
          reviewRes.data.data
            .map(normalizeReview)
            .filter((item) => item.brand === brand.name)
            .slice(0, 6),
        );
        setGuides(
          guideRes.data.data
            .filter((item) => item.metadata?.brand === brand.name)
            .slice(0, 4),
        );
        setArticles(articleRes.data.data.slice(0, 4));
      })
      .catch(() => {
        setReleases([]);
        setReviews([]);
        setGuides([]);
        setArticles([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [brand]);

  const stats = useMemo(
    () => ({
      releases: releases.length,
      reviews: reviews.length,
      guides: guides.length,
      articles: articles.length,
    }),
    [releases, reviews, guides, articles],
  );

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-6 text-center text-[#080808]">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.045em]">{error}</h1>
          <Link
            to="/brands"
            className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-2.5 text-xs font-black uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            <FiArrowLeft size={14} /> Back to brands
          </Link>
        </div>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-16 sm:px-10">
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-black/55 transition hover:text-black"
        >
          <FiArrowLeft size={14} /> Brands
        </Link>
        <div className="mt-10">
          <ReleaseGridSkeleton count={2} />
        </div>
      </main>
    );
  }

  const accent = brand.primaryColor || "#080808";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <article>
        <BrandHero
          brand={brand}
          stats={stats}
          backLink={{ to: "/brands", label: "All brands" }}
        />

        <div className="py-12 sm:py-16">
          <EditorialSection
            kicker="History"
            title="The Origin Story"
            body={brand.history}
            accent={accent}
          />
          <EditorialSection
            kicker="Mission"
            title="What Drives Them"
            body={brand.mission}
            accent={accent}
          />
          <EditorialSection
            kicker="Innovation"
            title="Pushing the Craft"
            body={brand.innovation}
            accent={accent}
          />
          <EditorialSection
            kicker="Legacy"
            title="Their Mark on Culture"
            body={brand.legacy}
            accent={accent}
          />

          {brand.technologies.length > 0 && (
            <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
              <div className="border-t border-black/15 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                  Tech
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                  Technologies
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {brand.technologies.map((item) => (
                    <Chip key={item} accent={accent}>
                      {item}
                    </Chip>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {brand.signatureModels.length > 0 && (
            <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
              <div className="border-t border-black/15 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                  Iconics
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                  Signature Models
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {brand.signatureModels.map((item) => (
                    <Chip key={item} accent={accent}>
                      {item}
                    </Chip>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {brand.athletes.length > 0 && (
            <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
              <div className="border-t border-black/15 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
                  Collaborations
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
                  Athletes & Collaborators
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {brand.athletes.map((item) => (
                    <Chip key={item} accent={accent}>
                      {item}
                    </Chip>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {releases.length > 0 && (
            <Rail
              kicker={`${brand.name} drops`}
              title="Latest Releases"
              loading={loading}
              grid={<ReleaseGridSkeleton count={6} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {releases.map((release) => (
                  <ReleaseCard key={release.id} release={release} variant="grid" />
                ))}
              </div>
            </Rail>
          )}

          {reviews.length > 0 && (
            <Rail
              kicker={`${brand.name} verdicts`}
              title="Latest Reviews"
              loading={loading}
              grid={<ReviewGridSkeleton count={6} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </Rail>
          )}

          {guides.length > 0 && (
            <Rail
              kicker="Know before you buy"
              title="Buying Guides"
              loading={loading}
              grid={<ReleaseGridSkeleton count={4} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {guides.map((guide) => (
                  <Link
                    key={guide._id}
                    to={`/guide/${guide._id}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808]"
                  >
                    <article className="h-full border border-black/10 bg-white p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <p className="text-[10px] font-black uppercase tracking-wide text-black/50">
                        {guide.category || "Buying Guide"}
                      </p>
                      <h3 className="mt-3 text-lg font-bold leading-6 tracking-[-0.02em] text-black">
                        {guide.title}
                      </h3>
                      {guide.summary && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">
                          {guide.summary}
                        </p>
                      )}
                      <span className="mt-4 inline-block bg-black px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white transition group-hover:bg-[#eee0c9] group-hover:text-black">
                        Read guide
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </Rail>
          )}

          {articles.length > 0 && (
            <Rail
              kicker="News desk"
              title="Related Articles"
              loading={loading}
              grid={<ReleaseGridSkeleton count={4} />}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {articles.map((article) => (
                  <NewsCard key={article._id} article={article} />
                ))}
              </div>
            </Rail>
          )}
        </div>
      </article>

      <Newsletter settings={newsletterSettings} />
      <Footer />
    </main>
  );
}

export default BrandDetail;
