import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import CalendarHero from "../../components/Calendar/CalendarHero";
import CalendarIndex from "../../components/Calendar/CalendarIndex";
import Newsletter from "../../components/Newsletter/Newsletter";
import {
  getSpotlightRelease,
  normalizeCalendar,
} from "../../utils/calendar";

function Calendar() {
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Release Calendar — SoleVerse";
    return () => {
      document.title = "SoleVerse";
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/content/public/calendar", {
          params: { limit: 100 },
          signal: controller.signal,
        });
        setReleases((data.data || []).map(normalizeCalendar));
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load the release calendar right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [reloadKey]);

  const spotlight = useMemo(() => getSpotlightRelease(releases), [releases]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <CalendarHero spotlight={spotlight} loading={loading && !error} />

      <section className="mx-auto max-w-[1600px] px-5 py-12 sm:px-10 sm:py-16">
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
            Plan your week
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            Upcoming Releases
          </h2>
          <p className="mt-2 text-sm text-black/55">
            Browse the collection view for a full overview, or switch to the
            calendar grid to scan release dates month by month.
          </p>
        </div>

        <CalendarIndex
          releases={releases}
          loading={loading}
          error={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </section>

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default Calendar;
