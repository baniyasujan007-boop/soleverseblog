import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import GuideHero from "../../components/Guides/GuideHero";
import GuideIndex from "../../components/Guides/GuideIndex";
import GuideCard from "../../components/Guides/GuideCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import { normalizeGuide } from "../../utils/guide";

function Guides() {
  const [heroGuide, setHeroGuide] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [newsletterSettings, setNewsletterSettings] = useState({});

  useEffect(() => {
    document.title = "Sneaker Guides — SoleVerse";
    return () => {
      document.title = "SoleVerse";
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/content/public/guide", {
        params: { featured: true, limit: 1 },
        signal: controller.signal,
      })
      .then(({ data }) =>
        setHeroGuide(data.data[0] ? normalizeGuide(data.data[0]) : null),
      )
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        setHeroGuide(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setHeroLoading(false);
      });
    api
      .get("/cms/public/homepage", { signal: controller.signal })
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
        const { data } = await api.get("/content/public/guide", {
          params: { limit: 100 },
          signal: controller.signal,
        });
        setGuides(data.data.map(normalizeGuide));
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load guides right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [reloadKey]);

  const categoryRails = useMemo(() => {
    const groups = new Map();
    guides.forEach((guide) => {
      if (!guide.category) return;
      if (!groups.has(guide.category)) groups.set(guide.category, []);
      groups.get(guide.category).push(guide);
    });
    return [...groups.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([name, items]) => ({ name, items: items.slice(0, 4) }));
  }, [guides]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <GuideHero guide={heroGuide} loading={heroLoading} />

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
            Guide index
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            All Guides
          </h2>
          <p className="mt-2 text-sm text-black/55">
            {guides.length} guides across the SoleVerse knowledge desk.
          </p>
        </div>

        <div className="mt-8">
          <GuideIndex
            guides={guides}
            loading={loading}
            error={error}
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        </div>
      </section>

      {categoryRails.map((rail) => (
        <section
          key={rail.name}
          className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14"
        >
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Knowledge hub
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              {rail.name}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rail.items.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default Guides;
