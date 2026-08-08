import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useHomepage } from "../../context/HomepageContext";
import DealHero from "../../components/Deals/DealHero";
import DealIndex from "../../components/Deals/DealIndex";
import DealCard from "../../components/Deals/DealCard";
import Newsletter from "../../components/Newsletter/Newsletter";
import {
  extractDealRetailers,
  normalizeDeal,
} from "../../utils/deal";

function Deals() {
  const { data: homepage } = useHomepage();
  const newsletterSettings = homepage?.settings?.homepage?.newsletter || {};
  const [heroDeal, setHeroDeal] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    document.title = "Sneaker Deals — SoleVerse";
    return () => {
      document.title = "SoleVerse";
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/content/public/deal", {
        params: { featured: true, limit: 1 },
        signal: controller.signal,
      })
      .then(({ data }) =>
        setHeroDeal(data.data[0] ? normalizeDeal(data.data[0]) : null),
      )
      .catch((requestError) => {
        if (requestError.code === "ERR_CANCELED") return;
        setHeroDeal(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setHeroLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/content/public/deal", {
          params: { limit: 100 },
          signal: controller.signal,
        });
        setDeals((data.data || []).map(normalizeDeal));
      } catch (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setError("Unable to load deals right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [reloadKey]);

  const activeDeals = useMemo(
    () => deals.filter((deal) => !deal.expired),
    [deals],
  );

  const biggestDiscounts = useMemo(() => {
    const list = activeDeals
      .filter(
        (deal) => deal.discountPercentage !== null && deal.discountPercentage > 0,
      )
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 4);
    return list.length >= 3 ? list : [];
  }, [activeDeals]);

  const endingSoon = useMemo(() => {
    const list = activeDeals
      .filter((deal) => deal.endingSoon)
      .sort((a, b) => a.expiration - b.expiration)
      .slice(0, 4);
    return list.length >= 3 ? list : [];
  }, [activeDeals]);

  const retailers = useMemo(() => extractDealRetailers(activeDeals), [activeDeals]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#080808]">
      <DealHero deal={heroDeal} loading={heroLoading} />

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-10 sm:py-14">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
            Today's best
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            All Deals
          </h2>
          <p className="mt-2 text-sm text-black/55">
            {activeDeals.length} active deals across the SoleVerse deals desk.
          </p>
        </div>

        <div className="mt-8">
          <DealIndex
            deals={deals}
            loading={loading}
            error={error}
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        </div>
      </section>

      {biggestDiscounts.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Money savers
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Biggest Discounts
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {biggestDiscounts.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </section>
      )}

      {endingSoon.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Don't sleep
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Ending Soon
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {endingSoon.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </section>
      )}

      {retailers.length >= 3 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14">
          <div className="border-t border-black/15 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">
              Where to shop
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Popular Retailers
            </h2>
            <div className="mt-8 flex flex-wrap gap-3" aria-label="Popular retailers">
              {retailers.map((retailer) => (
                <span
                  key={retailer}
                  className="border border-black/15 bg-white px-5 py-3 text-xs font-black uppercase tracking-wide text-black"
                >
                  {retailer}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter settings={newsletterSettings} />
    </main>
  );
}

export default Deals;
