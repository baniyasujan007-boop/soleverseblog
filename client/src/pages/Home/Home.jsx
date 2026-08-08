import { cloneElement, lazy, Suspense, useMemo } from "react";
import { useHomepage } from "../../context/HomepageContext";
const Hero = lazy(() => import("../../components/Hero/Hero"));
const LatestNews = lazy(() => import("../../components/LatestNews/LatestNews"));
const LatestReleases = lazy(
  () => import("../../components/LatestReleases/LatestReleases"),
);
const TopBrands = lazy(() => import("../../components/TopBrands/TopBrands"));
const Newsletter = lazy(() => import("../../components/Newsletter/Newsletter"));
const Trending = lazy(() => import("../../components/Trending/Trending"));
const FeaturedReviews = lazy(
  () => import("../../components/FeaturedReviews/FeaturedReviews"),
);
const FeaturedGuides = lazy(
  () => import("../../components/FeaturedGuides/FeaturedGuides"),
);
const BestDeals = lazy(() => import("../../components/BestDeals/BestDeals"));
const ReleaseCalendar = lazy(
  () => import("../../components/ReleaseCalendar/ReleaseCalendar"),
);

function Skeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
      <div>
        <div className="h-3 w-24 animate-pulse rounded bg-black/10 motion-reduce:animate-none" />
        <div className="mt-2 h-8 w-64 max-w-full animate-pulse rounded bg-black/10 motion-reduce:animate-none" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded bg-white motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { data, error, loading, refetch } = useHomepage();
  const sections = useMemo(
    () =>
      (data?.settings?.homepage?.sections || [])
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order),
    [data],
  );
  if (loading)
    return (
      <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
        {" "}
        <Skeleton />
      </main>
    );
  if (error)
    return (
      <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <p className="text-lg font-black">We couldn't load the homepage.</p>
          <p className="mt-2 text-sm text-black/55">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-7 inline-flex bg-[#080808] px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-black/80"
          >
            Try again
          </button>
        </div>
      </main>
    );
  const modules = {
    hero: (
      <Hero
        slides={data.heroSlides}
        releases={data.releases}
        settings={data.settings.homepage.hero}
      />
    ),
    latestNews: <LatestNews articles={data.latestNews} />,
    latestReleases: <LatestReleases releases={data.releases} />,
    reviews: (
      <FeaturedReviews
        reviews={data.reviews}
        loading={loading}
        settings={{ buttonUrl: "/reviews" }}
      />
    ),
    trending: <Trending items={data.trending} />,
    topBrands: <TopBrands brands={data.brands} />,
    guides: (
      <FeaturedGuides
        guides={data.guides}
        loading={loading}
        settings={{ buttonUrl: "/guides" }}
      />
    ),
    deals: (
      <BestDeals
        deals={data.deals}
        loading={loading}
        settings={{ buttonUrl: "/deals" }}
      />
    ),
    calendar: (
      <ReleaseCalendar
        releases={data.calendar}
        loading={loading}
        settings={{ buttonUrl: "/calendar" }}
      />
    ),
    newsletter: <Newsletter settings={data.settings.homepage.newsletter} />,
  };
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <Suspense fallback={<Skeleton />}>
        {sections.map((section) => (
          <div
            key={section.id}
            className={`${section.customClass || ""} ${section.desktopVisible === false ? "lg:hidden" : ""} ${section.tabletVisible === false ? "md:hidden lg:block" : ""} ${section.mobileVisible === false ? "hidden md:block" : ""}`}
            style={{ backgroundColor: section.backgroundColor || undefined, backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined, padding: section.padding || undefined, margin: section.margin || undefined }}
          >
            {modules[section.id] && cloneElement(modules[section.id], section.id === "newsletter" ? { sectionSettings: section } : { settings: { ...modules[section.id].props.settings, ...section } })}
          </div>
        ))}
      </Suspense>
    </main>
  );
}

export default Home;
