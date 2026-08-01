import { cloneElement, lazy, Suspense, useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
const Hero = lazy(() => import("../../components/Hero/Hero"));
const LatestNews = lazy(() => import("../../components/LatestNews/LatestNews"));
const LatestReleases = lazy(
  () => import("../../components/LatestReleases/LatestReleases"),
);
const TopBrands = lazy(() => import("../../components/TopBrands/TopBrands"));
const Newsletter = lazy(() => import("../../components/Newsletter/Newsletter"));
const Trending = lazy(() => import("../../components/Trending/Trending"));

function Skeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api
      .get("/cms/public/homepage")
      .then(({ data: response }) => setData(response.data))
      .catch(() =>
        setData({
          settings: { homepage: { sections: [] } },
          heroSlides: [],
          latestNews: [],
          releases: [],
          brands: [],
          trending: [],
        }),
      );
  }, []);
  const sections = useMemo(
    () =>
      (data?.settings?.homepage?.sections || [])
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order),
    [data],
  );
  if (!data)
    return (
      <main className="min-h-screen bg-white text-slate-900">
        {" "}
        <Skeleton />
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
    topBrands: <TopBrands brands={data.brands} />,
    newsletter: <Newsletter settings={data.settings.homepage.newsletter} />,
    trending: <Trending items={data.trending} />,
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
